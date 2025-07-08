<script lang="ts">
	import type { Link, LinkType } from '$lib/storage/generic';
	import { BrowserLinkStorage } from '$lib/storage/browserstorage';
	import { exampleReadLinks, exampleUnreadLinks } from '$lib/example-links.svelte';
	import AddLink from '../components/add-link.svelte';
	import Links from '../components/links.svelte';
	import DebugButton from '../components/debug-button.svelte';

	const localLinkStorage = new BrowserLinkStorage();

	const unreadLinks = $state(localLinkStorage.getLinkList('unread'));
	$effect(() => {
		localLinkStorage.setLinkList('unread', unreadLinks);
	});

	const readLinks = $state(localLinkStorage.getLinkList('read'));
	$effect(() => {
		localLinkStorage.setLinkList('read', readLinks);
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
		<h2>Unread links</h2>
		<Links
			links={unreadLinks}
			isUnread={true}
			markAsOther={markAsRead}
			removeLink={(index) => remove('unread', index)}
		/>
	</section>
	<section class="flow">
		<h2>Read links</h2>
		<Links
			links={readLinks}
			isUnread={false}
			markAsOther={markAsUnread}
			removeLink={(index) => remove('read', index)}
		/>
	</section>
</main>

<DebugButton
	populate={() => {
		// Empty the arrays without having to make them reassinable
		unreadLinks.length = 0;
		readLinks.length = 0;

		for (const link of exampleUnreadLinks) {
			unreadLinks.push(link);
		}
		for (const link of exampleReadLinks) {
			readLinks.push(link);
		}
	}}
/>
