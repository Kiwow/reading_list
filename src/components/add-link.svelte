<script lang="ts">
	import type { Link } from '$lib/storage/generic';

	type Props = {
		addUnreadLink: (linkToAdd: Link) => void;
	};

	let { addUnreadLink }: Props = $props();

	let linkToAdd = $state('');

	function handleAddLink(e: SubmitEvent) {
		e.preventDefault();

		const url = new URL(linkToAdd);
		addUnreadLink({
			title: '[TODO] ' + url.hostname,
			href: url.href
		});

		// After successful addition, clear the form
		linkToAdd = '';
	}
</script>

<form class="add-link wrapper" data-wrapper-type="inner" onsubmit={handleAddLink}>
	<label for="add-link-input">Add a link</label>
	<input id="add-link-input" placeholder="https://example.com" type="text" bind:value={linkToAdd} />
	<button type="submit">Add</button>
</form>
