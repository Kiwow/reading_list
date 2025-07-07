<script lang="ts">
	import AddLink from '../components/add-link.svelte';
	import Links from '../components/links.svelte';
	import type { Link } from '$lib/links.svelte';
	import { unreadLinks, readLinks } from '$lib/links.svelte';

	function addUnreadLink(linkToAdd: Link): void {
		unreadLinks.unshift(linkToAdd);
	}
</script>

<main class="flow wrapper">
	<AddLink {addUnreadLink} />
	<section class="flow">
		<h2>Unread articles</h2>
		<Links links={unreadLinks} isUnread={true} />
	</section>
	<section class="flow">
		<h2>Read articles</h2>
		<Links links={readLinks} isUnread={false} />
	</section>
</main>
