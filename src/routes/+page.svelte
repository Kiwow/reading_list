<script lang="ts">
	import Links from '../components/links.svelte';
	import { unreadLinks, readLinks } from '$lib/links.svelte';
</script>

<main class="flow wrapper">
	<button type="button" class="add-link">Add link</button>
	<section class="flow">
		<h2>Unread articles</h2>
		<Links links={unreadLinks} isUnread={true} />
	</section>
	<section class="flow">
		<h2>Read articles</h2>
		<Links links={readLinks} isUnread={false} />
	</section>
</main>
