<script lang="ts">
	import { ThemeVariable } from '$lib/theme/theme-variable.svelte';

	const backgroundDefault = '#8c8cff';
	const textDefault = '#ffff8c';

	const loaded = JSON.parse(localStorage.getItem('custom-colors') ?? '{}') as Record<
		string,
		string
	>;

	const text = $state(
		new ThemeVariable('--color-text', loaded.text ?? loaded.secondary ?? textDefault)
	);
	const background = $state(
		new ThemeVariable(
			'--color-background',
			loaded.background ?? loaded.primary ?? backgroundDefault
		)
	);
	const backgroundAlt = $state(new ThemeVariable('--color-background-alt', loaded.backgroundAlt));
	const backgroundAccent = $state(
		new ThemeVariable('--color-background-accent', loaded.backgroundAccent)
	);

	$effect(() => {
		localStorage.setItem(
			'custom-colors',
			JSON.stringify({
				text,
				background,
				backgroundAlt,
				backgroundAccent
			})
		);
	});
</script>

<menu class="theme-editor">
	<li>
		<label>
			<span class="label">Text</span>
			<input type="text" placeholder={textDefault} bind:value={text.value} />
			<input type="color" bind:value={text.value} />
		</label>
	</li>
	<li>
		<label>
			<span class="label">Background</span>
			<input type="text" placeholder={backgroundDefault} bind:value={background.value} />
			<input type="color" bind:value={background.value} />
		</label>
	</li>
	<li>
		<label>
			<span class="label">Background (alternative)</span>
			<input type="text" placeholder="#c0ffee" bind:value={backgroundAlt.value} />
			<input
				type="color"
				oninput={function () {
					backgroundAlt.value = this.value;
				}}
			/>
		</label>
	</li>
	<li>
		<label>
			<span class="label">Background (accent)</span>
			<input type="text" placeholder="#c0ffee" bind:value={backgroundAccent.value} />
			<input
				type="color"
				oninput={function () {
					backgroundAccent.value = this.value;
				}}
			/>
		</label>
	</li>
</menu>
