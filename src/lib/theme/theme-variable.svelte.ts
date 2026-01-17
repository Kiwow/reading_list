export class ThemeVariable {
	value: string | undefined;

	constructor(customPropertyName: string, initialValue?: string) {
		this.value = $state(initialValue);

		$effect(() => {
			if (this.value) {
				document.documentElement.style.setProperty(customPropertyName, this.value);
			}
		});
	}

	toJSON() {
		return this.value;
	}
}
