import type { Link } from '$lib/links.svelte';
import type { LinkStorage, LinkType } from './generic';

export class LocalLinkStorage implements LinkStorage {
	private static getLocalStorageKey(linkType: LinkType) {
		return `link-storage_${linkType}` as const;
	}

	private getStorageValue(linkType: LinkType) {
		const key = LocalLinkStorage.getLocalStorageKey(linkType);
		return localStorage.getItem(key);
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
			console.error(new Error('Failed to read link list from local storage', { cause: err }));

			console.groupCollapsed('local storage contents');
			console.log('Recovering from failed localstorage read, below is the original contents');
			console.log(value);
			console.groupEnd();

			this.setLinkList(linkType, []);
			return [];
		}
	}

	setLinkList(linkType: LinkType, list: Link[]): void {
		const key = LocalLinkStorage.getLocalStorageKey(linkType);
		localStorage.setItem(key, JSON.stringify(list));
	}
}
