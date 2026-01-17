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

	function exportData() {
		const localStorageContents = Object.fromEntries(
			[
				'color-theme',
				'custom-colors',
				'filled-examples',
				'link-storage_read',
				'link-storage_unread'
			].map((key) => {
				const value = localStorage.getItem(key);
				return [key, value];
			})
		);

		const blob = new Blob([JSON.stringify(localStorageContents, null, 2)], {
			type: 'application/json'
		});

		const objectURL = URL.createObjectURL(blob);
		try {
			const a = document.createElement('a');
			a.download = 'reading-list-data.json';
			a.href = objectURL;
			a.click();
		} finally {
			URL.revokeObjectURL(objectURL);
		}
	}

	async function importData() {
		const input = document.createElement('input') as HTMLInputElement;
		input.type = 'file';

		const filePromise = new Promise((resolve) => {
			input.addEventListener(
				'change',
				() => {
					resolve(input.files?.[0]);
				},
				{ once: true }
			);
		});
		input.click();

		const file = (await filePromise) as File | undefined;

		if (!file) {
			throw new Error('No file contents :(');
		}

		const fileContents = await file.text();
		const localStorageContents = JSON.parse(fileContents);
		for (const [key, value] of Object.entries(localStorageContents)) {
			if (typeof key !== 'string' || typeof value !== 'string') {
				throw new Error('Bad data');
			}
		}

		localStorage.clear();

		for (const [key, value] of Object.entries(localStorageContents)) {
			localStorage.setItem(key, value as string);
		}

		location.reload();
	}
</script>

<div class="theme-editor">
	<menu>
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

	<menu class="buttons">
		<li>
			<button type="button" onclick={importData}>Import data</button>
		</li>
		<li>
			<button type="button" onclick={exportData}>Export data</button>
		</li>
	</menu>
</div>
