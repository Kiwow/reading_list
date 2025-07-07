import type { Link } from '$lib/links.svelte';
import type { LinkStorage, LinkType } from './generic';

type BrowserStorage = {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
};

export class BrowserLinkStorage implements LinkStorage {
	constructor(private readonly storage: BrowserStorage) {}

	private static getStorageKey(linkType: LinkType) {
		return `link-storage_${linkType}` as const;
	}

	private getStorageValue(linkType: LinkType) {
		const key = BrowserLinkStorage.getStorageKey(linkType);
		return this.storage.getItem(key);
	}

	getLinkList(linkType: LinkType): Link[] {
		const value = this.getStorageValue(linkType);
		if (value === null) {
			return [];
		}

		try {
			const deserialized = JSON.parse(value) as unknown;
			if (
				deserialized instanceof Array &&
				deserialized.every((item) => typeof item === 'object' && 'title' in item && 'href' in item)
			) {
				// somewhat generous validation
				return deserialized as Link[];
			}
			throw new Error('Invalid link format after parsing');
		} catch (err) {
			console.error(new Error('Failed to read link list from browser storage', { cause: err }));

			console.groupCollapsed('browser storage contents');
			console.log('Recovering from failed browser storage read, below is the original contents');
			console.log(value);
			console.groupEnd();

			this.setLinkList(linkType, []);
			return [];
		}
	}

	setLinkList(linkType: LinkType, list: Link[]): void {
		const key = BrowserLinkStorage.getStorageKey(linkType);
		this.storage.setItem(key, JSON.stringify(list));
	}
}

export const localLinkStorage = new BrowserLinkStorage(localStorage);
