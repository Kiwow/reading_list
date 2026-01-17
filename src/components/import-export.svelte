<script lang="ts">
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

<menu class="import-export">
	<li>
		<button type="button" onclick={importData}>Import data</button>
	</li>
	<li>
		<button type="button" onclick={exportData}>Export data</button>
	</li>
</menu>
