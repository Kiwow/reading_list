<script lang="ts">
	type Props = {
		populate: Parameters<typeof addEventListener<'click'>>[1];
	};

	const { populate }: Props = $props();
</script>

{#if import.meta.env.DEV}
	<button type="button" onclick={populate}>Populate with example links</button>
{/if}

<style>
	button {
		position: fixed;
		top: var(--space-s);
		right: var(--space-s);
	}
</style>
