<script lang="ts">
	import type { Link } from '$lib/storage/generic';

	type Props = {
		addUnreadLink: (linkToAdd: Link) => void;
	};

	let { addUnreadLink }: Props = $props();

	let hrefToAdd = $state('');
	let titleToAdd = $state('');

	function handleAddLink(e: SubmitEvent) {
		e.preventDefault();

		const url = new URL(hrefToAdd);
		const title = titleToAdd || url.hostname;
		addUnreadLink({
			title,
			href: url.href
		});

		// After successful addition, clear the form
		hrefToAdd = '';
	}
</script>

<form class="add-link wrapper" data-wrapper-type="inner" onsubmit={handleAddLink}>
	<label for="add-link-href">Link</label>
	<input
		id="add-link-href"
		type="text"
		placeholder="https://example.com"
		required
		autocomplete="off"
		bind:value={hrefToAdd}
	/>
	<label for="add-link-title">Title</label>
	<input
		id="add-link-title"
		type="text"
		placeholder="Example Article"
		autocomplete="off"
		bind:value={titleToAdd}
	/>
	<button type="submit">Add</button>
</form>
