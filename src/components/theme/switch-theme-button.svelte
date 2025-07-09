<script lang="ts">
	import Mesicek from './mesicek.svelte';
	import Sunicko from './sunicko.svelte';
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';

	// eslint-disable-next-line svelte/prefer-writable-derived
	let currentTheme: 'light' | 'dark' = $state('light');

	onMount(() => {
		const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
		let preferredTheme = $state(mediaQuery.matches ? 'dark' : 'light');

		const removeMediaQueryListener = on(mediaQuery, 'change', (e) => {
			preferredTheme = e.matches ? 'dark' : 'light';
		});

		$effect(() => {
			currentTheme = (localStorage.getItem('color-theme') as 'dark' | 'light') ?? preferredTheme;
		});

		return removeMediaQueryListener;
	});

	$effect(() => {
		document.documentElement.dataset['theme'] = currentTheme;
	});

	function isLightTheme() {
		return currentTheme === 'light';
	}

	function switchTheme() {
		if (isLightTheme()) {
			currentTheme = 'dark';
		} else {
			currentTheme = 'light';
		}
		localStorage.setItem('color-theme', currentTheme);
	}
</script>

<button class="switch-theme" onclick={switchTheme}>
	{#if isLightTheme()}
		<Mesicek />
	{:else}
		<Sunicko />
	{/if}
	<span class="visually-hidden">
		Switch to {isLightTheme() ? 'dark' : 'light'} theme
	</span>
</button>
