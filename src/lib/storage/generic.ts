import type { Link } from '$lib/links.svelte';

export type LinkType = 'read' | 'unread';

export type LinkStorage = {
	// TODO: should the null be there? the LocalStorage implementation
	// just returns  an empty list
	getLinkList(linkType: LinkType): Link[] | null;
	setLinkList(linkType: LinkType, list: Link[]): void;
};
