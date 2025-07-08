<script lang="ts">
	import type { Link } from '$lib/storage/generic';

	type Props = {
		links: Link[];
		isUnread: boolean;
		markAsOther(index: number): void;
		removeLink(index: number): void;
	};

	let { links, isUnread, markAsOther, removeLink }: Props = $props();

	function getLinkHost(href: string): string {
		try {
			return new URL(href).hostname;
		} catch {
			return '';
		}
	}
</script>

<ol role="list" class="flow links">
	<!--
    TODO: when adding a link with the same href as one already present, an edge case is hit
    and rendering of the list might break
  -->
	{#each links as link, index (link.href)}
		<li class="link">
			<a href={link.href} rel="nofollow" class="link-title">
				{link.title}
				<small class="link-domain-name">
					<span class="visually-hidden">from</span>
					{getLinkHost(link.href)}
				</small>
			</a>
			<menu class="link-actions" role="list">
				<li>
					<button type="button" onclick={() => markAsOther(index)}>
						{#if isUnread}
							<span class="visually-hidden">Mark as read</span>
							✅
						{:else}
							<span class="visually-hidden">Mark as unread</span>
							♻
						{/if}
					</button>
				</li>
				<li>
					<button type="button" onclick={() => removeLink(index)}>
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
