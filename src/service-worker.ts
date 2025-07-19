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

function canCacheResource(request: Request, response: Response): boolean {
	return (
		response.status === 200 &&
		'no-store' !== response.headers.get('Cache-Control') &&
		'no-store' !== request.headers.get('Cache-Control')
	);
}

sw.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (url.pathname === '/' && url.origin === sw.origin && event.request.mode === 'navigate') {
			// For navigation requests of the homepage, we use a cache-first policy
			// This means that we serve the document from the cache if available,
			// and only afterwards go to the network and update the cache
			const response = await cache.match(event.request);
			if (response !== undefined) {
				// Enqueue the request for the network
				fetch(event.request)
					.catch((error) => {
						throw new Error('Failed to fetch document in the background', { cause: error });
					})
					.then((response) => {
						if (canCacheResource(event.request, response)) {
							return cache.put(event.request, response.clone());
						}
						throw new Error('Cannot cache document navigation??');
					})
					.catch((error) => {
						throw new Error('Failed to cache document navigation', { cause: error });
					});

				// Returned cached response without waiting for the network
				return response;
			}
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
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (canCacheResource(event.request, response)) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});
