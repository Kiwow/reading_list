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
			href: url.href,
			addedOn: new Date().toISOString()
		});

		// After successful addition, clear the form
		hrefToAdd = '';
		titleToAdd = '';
	}
</script>

<form class="add-link wrapper" data-wrapper-type="inner" onsubmit={handleAddLink}>
	<div class="inputs">
		<label>
			Link
			<input
				type="url"
				placeholder="https://example.com"
				required
				autocomplete="off"
				bind:value={hrefToAdd}
			/>
		</label>
		<label>
			Title
			<input type="text" placeholder="Example Article" autocomplete="off" bind:value={titleToAdd} />
		</label>
	</div>
	<button type="submit" class="text-box">Add link</button>
</form>
