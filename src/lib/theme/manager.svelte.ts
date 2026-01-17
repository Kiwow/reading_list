import { on } from 'svelte/events';

type InferredTheme = 'dark' | 'light';
type Theme = InferredTheme | 'custom';

export class ThemeManager {
	static allThemes: Theme[] = ['light', 'dark', 'custom'];

	#currentTheme: Theme;
	#preferredTheme: InferredTheme;

	constructor() {
		const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
		this.#preferredTheme = $state(mediaQuery.matches ? 'dark' : 'light');

		on(mediaQuery, 'change', (e) => {
			this.#preferredTheme = e.matches ? 'dark' : 'light';
		});

		this.#currentTheme = $derived(
			(localStorage.getItem('color-theme') as Theme) ?? this.#preferredTheme
		);

		$effect(() => {
			document.documentElement.dataset.theme = this.#currentTheme;
		});
	}

	get currentTheme() {
		return this.#currentTheme;
	}

	switchTheme(name: Theme) {
		this.#currentTheme = name;
		localStorage.setItem('color-theme', name);
	}
}
