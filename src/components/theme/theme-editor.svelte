<script lang="ts">
	import { onMount } from 'svelte';

	const primaryDefault = '#8c8cff';
	const secondaryDefault = '#ffff8c';

	let primary: string = $state(primaryDefault);
	let secondary: string = $state(secondaryDefault);
	let tertiary: string | undefined = $state();

	onMount(() => {
		const loaded = localStorage.getItem('custom-colors');
		if (loaded) {
			({ primary, secondary, tertiary } = JSON.parse(loaded));
		}
	});

	$effect(() => {
		document.documentElement.style.setProperty('--color-primary', primary);
		document.documentElement.style.setProperty('--color-secondary', secondary);
		if (tertiary) {
			document.documentElement.style.setProperty('--color-tertiary', tertiary);
		} else {
			document.documentElement.style.removeProperty('--color-tertiary');
		}

		localStorage.setItem(
			'custom-colors',
			JSON.stringify({
				primary,
				secondary,
				tertiary
			})
		);
	});
</script>

<menu class="theme-editor">
	<li>
		<label>
			<span class="label">Primary</span>
			<input type="text" placeholder={primaryDefault} bind:value={primary} />
			<input type="color" bind:value={primary} />
		</label>
	</li>
	<li>
		<label>
			<span class="label">Secondary</span>
			<input type="text" placeholder={secondaryDefault} bind:value={secondary} />
			<input type="color" bind:value={secondary} />
		</label>
	</li>
	<li>
		<label>
			<span class="label">Tertiary</span>
			<input type="text" placeholder="#c0ffee" bind:value={tertiary} />
			<input
				type="color"
				oninput={function () {
					tertiary = this.value;
				}}
			/>
		</label>
	</li>
</menu>
