// TODO: when adding a link with the same href as one already present, an edge case is hit
// and rendering of the list in links.svelte might break

export const unreadLinks = $state([
	{
		title: 'Example article',
		href: '#1'
	},
	{
		title: 'Another article, this time with a much longer name—indeed, it is a long one',
		href: '#2'
	},
	{
		title: 'Yet another example article',
		href: '#3'
	}
]);

export const readLinks = $state([
	{
		title: 'Example article',
		href: '#4'
	},
	{
		title: 'Another article, this time with a much longer name—indeed, it is a long one',
		href: '#5'
	},
	{
		title: 'Yet another example article',
		href: '#6'
	}
]);
