<script lang="ts">
	import type { Link, LinkType } from '$lib/storage/generic';
	import { BrowserLinkStorage } from '$lib/storage/browserstorage';
	import AddLink from '../components/add-link.svelte';
	import Links from '../components/links.svelte';
	import SwitchThemeButton from '../components/theme/switch-theme-button.svelte';
	import { onMount } from 'svelte';

	let unreadLinks: Link[] = $state([]);
	let readLinks: Link[] = $state([]);

	onMount(() => {
		const localLinkStorage = new BrowserLinkStorage();

		unreadLinks = localLinkStorage.getLinkList('unread');
		$effect(() => {
			localLinkStorage.setLinkList('unread', unreadLinks);
		});

		readLinks = localLinkStorage.getLinkList('read');
		$effect(() => {
			localLinkStorage.setLinkList('read', readLinks);
		});
	});

	function addUnreadLink(linkToAdd: Link): void {
		unreadLinks.unshift(linkToAdd);
	}

	function markAsRead(index: number) {
		const item = unreadLinks[index];
		if (!item) {
			throw new Error('No such item');
		}
		unreadLinks.splice(index, 1);
		readLinks.unshift(item);
	}

	function markAsUnread(index: number) {
		const item = readLinks[index];
		if (!item) {
			throw new Error('No such item');
		}
		readLinks.splice(index, 1);
		unreadLinks.push(item);
	}

	function remove(from: LinkType, index: number) {
		(from === 'unread' ? unreadLinks : readLinks).splice(index, 1);
	}
</script>

<main class="flow wrapper">
	<AddLink {addUnreadLink} />
	<section class="flow">
		<h2 id="unread-links">Unread links</h2>
		<Links
			links={unreadLinks}
			isUnread={true}
			markAsOther={markAsRead}
			removeLink={(index) => remove('unread', index)}
		/>
	</section>
	<SwitchThemeButton />
	<section class="flow">
		<h2 id="read-links">Read links</h2>
		<Links
			links={readLinks}
			isUnread={false}
			markAsOther={markAsUnread}
			removeLink={(index) => remove('read', index)}
		/>
	</section>
</main>

<style>
	:global {
		@layer reset, global, theme;

		@import '$lib/styles/reset.css' layer(reset);
		@import '$lib/styles/global.css' layer(global);
		@import '$lib/styles/theme.css' layer(theme);
	}
</style>
