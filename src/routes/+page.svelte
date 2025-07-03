<script lang="ts">
	const articles = $state([
		{
			title: 'Example article',
			href: '#'
		},
		{
			title: 'Another article, this time with a much longer name—indeed, it is a long one',
			href: '#'
		},
		{
			title: 'Yet another example article',
			href: '#'
		}
	]);

	const readArticles = $state([
		{
			title: 'Example article',
			href: '#'
		},
		{
			title: 'Another article, this time with a much longer name—indeed, it is a long one',
			href: '#'
		},
		{
			title: 'Yet another example article',
			href: '#'
		}
	]);

	function markAsRead(index: number) {
		const item = articles[index];
		if (!item) {
			throw new Error('No such item');
		}

		articles.splice(index, 1);
		readArticles.unshift(item);
	}

	function markAsUnread(index: number) {
		const item = readArticles[index];
		if (!item) {
			throw new Error('No such item');
		}

		readArticles.splice(index, 1);
		articles.push(item);
	}
</script>

<main class="flow wrapper">
	<button type="button" class="add-link">Add link</button>
	<section class="flow">
		<h2>Unread articles</h2>
		<ol role="list" class="flow links">
			{#each articles as article, index}
				<li class="link">
					<a href={article.href} class="link-title">{article.title}</a>
					<menu class="link-actions" role="list">
						<li>
							<button type="button" onclick={() => markAsRead(index)}>
								<span class="visually-hidden">Mark as read</span>
								✅
							</button>
						</li>
						<li>
							<button type="button">
								<span class="visually-hidden">Delete</span>
								🚮
							</button>
						</li>
					</menu>
				</li>
			{/each}
		</ol>
	</section>
	<section class="flow">
		<h2>Read articles</h2>
		<ol role="list" class="flow links">
			{#each readArticles as article, index}
				<li class="link">
					<a href={article.href} class="link-title">{article.title}</a>
					<menu class="link-actions" role="list">
						<li>
							<button type="button" onclick={() => markAsUnread(index)}>
								<span class="visually-hidden">Mark as unread</span>
								♻
							</button>
						</li>
						<li>
							<button type="button">
								<span class="visually-hidden">Delete</span>
								🚮
							</button>
						</li>
					</menu>
				</li>
			{/each}
		</ol>
	</section>
</main>
