import type { Link, LinkStorage, LinkType } from '$lib/storage/generic';

type BrowserStorage = {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
};

export class BrowserLinkStorage implements LinkStorage {
	constructor(private readonly storage: BrowserStorage = window.localStorage) {}

	private static getStorageKey(linkType: LinkType) {
		return `link-storage_${linkType}` as const;
	}

	private getStorageValue(linkType: LinkType) {
		const key = BrowserLinkStorage.getStorageKey(linkType);
		return this.storage.getItem(key);
	}

	getLinkList(linkType: LinkType) {
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

			console.groupCollapsed(
				'Browser storage will get cleared to recover from failed read. Below is the original bad value'
			);
			console.log(value);
			console.groupEnd();

			this.setLinkList(linkType, []);
			return [];
		}
	}

	setLinkList(linkType: LinkType, list: Link[]) {
		const key = BrowserLinkStorage.getStorageKey(linkType);
		this.storage.setItem(key, JSON.stringify(list));
	}
}
