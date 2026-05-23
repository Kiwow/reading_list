/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

// This makes TypeScript work properly in this file
// See https://svelte.dev/docs/kit/service-workers#Type-safety
const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `cache-${version}` as const;

const ASSETS = [
	...build, // files bundled by Vite
	...files // everything in `static`
];

sw.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

function shouldNotCache(request: Request): boolean {
	const cache = request.cache;
	return cache === 'no-store' || cache === 'no-cache' || cache === 'reload';
}

function canCacheResource(request: Request, response: Response): boolean {
	return response.status === 200 && !shouldNotCache(request);
}

async function cacheFirstWithRefresh(cache: Cache, request: Request) {
	// Enqueue the refresh request
	const networkResponsePromise = fetch(request).then((response) => {
		if (canCacheResource(request, response)) {
			cache.put(request, response.clone());
		}
		return response;
	});

	const response = await cache.match(request);
	if (response !== undefined) {
		// Return cached response without waiting for the network
		return response;
	}

	// If response wasn't in cache, wait for and return network response
	return networkResponsePromise;
}

async function networkFirst(cache: Cache, request: Request) {
	try {
		const response = await fetch(request);
		// if we're offline, fetch can return a value that is not a Response
		// instead of throwing - and we can't pass this non-Response to respondWith
		if (!(response instanceof Response)) {
			throw new Error('invalid response from fetch');
		}
		if (canCacheResource(request, response)) {
			cache.put(request, response.clone());
		}
		return response;
	} catch (err) {
		const cachedResponse = await cache.match(request);
		if (cachedResponse !== undefined) {
			return cachedResponse;
		}
		// if there's no cache, then just error out
		// as there is nothing we can do to respond to this request
		throw err;
	}
}

sw.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (
			url.pathname === '/' &&
			url.origin === sw.origin &&
			event.request.mode === 'navigate' &&
			!shouldNotCache(event.request)
		) {
			return cacheFirstWithRefresh(cache, event.request);
		}

		// assets can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);
			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		return networkFirst(cache, event.request);
	}

	event.respondWith(respond());
});
