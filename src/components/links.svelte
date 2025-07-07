<script lang="ts">
	import type { Link } from '$lib/links.svelte';
	import { readLinks, unreadLinks } from '$lib/links.svelte';

	type Props = {
		links: Link[];
		isUnread: boolean;
	};

	let { links, isUnread }: Props = $props();

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

	function remove(fromUnread: boolean, index: number) {
		(fromUnread ? unreadLinks : readLinks).splice(index, 1);
	}
</script>

<ol role="list" class="flow links">
	{#each links as link, index (link.href)}
		<li class="link">
			<a href={link.href} rel="nofollow" class="link-title">{link.title}</a>
			<menu class="link-actions" role="list">
				<li>
					{#if isUnread}
						<button type="button" onclick={() => markAsRead(index)}>
							<span class="visually-hidden">Mark as read</span>
							✅
						</button>
					{:else}
						<button type="button" onclick={() => markAsUnread(index)}>
							<span class="visually-hidden">Mark as unread</span>
							♻
						</button>
					{/if}
				</li>
				<li>
					<button type="button" onclick={() => remove(isUnread, index)}>
						<span class="visually-hidden">Delete</span>
						🚮
					</button>
				</li>
			</menu>
		</li>
	{:else}
		<div class="no-links-message">No links here</div>
	{/each}
</ol>
