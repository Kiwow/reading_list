<script lang="ts">
	import RelativeTimeElement from '@github/relative-time-element';
	import { onMount } from 'svelte';
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

	onMount(() => {
		if (!customElements.get('relative-time')) {
			RelativeTimeElement.define();
		}
	});
</script>

<ol class="flow links">
	{#each links as link, index (link.href.concat(' ', link.addedOn ?? ''))}
		<li class="link">
			<a href={link.href} rel="nofollow" class="link-title">
				{link.title}
				<div class="additional-info">
					<i class="link-domain-name" aria-hidden="true">
						{getLinkHost(link.href)}
					</i>
					{#if Object.hasOwn(link, 'addedOn')}
						<span class="visually-hidden">, added </span>
						<relative-time class="time-added" datetime={link.addedOn}></relative-time>
					{/if}
				</div>
			</a>
			<menu class="link-actions">
				<li>
					<button type="button" onclick={() => markAsOther(index)}>
						{#if isUnread}
							Read
						{:else}
							Unread
						{/if}
					</button>
				</li>
				<li>
					<button type="button" onclick={() => removeLink(index)}>Delete</button>
				</li>
			</menu>
		</li>
	{:else}
		<div class="no-links-message">No links here</div>
	{/each}
</ol>
