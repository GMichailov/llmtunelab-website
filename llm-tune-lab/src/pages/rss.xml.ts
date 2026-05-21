import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

	return rss({
		title: 'LLM Tune Lab',
		description: 'Field notes from the lab — fine-tuning, evaluation, and inference for open-weight LLMs.',
		site: context.site!,
		items: posts.map(post => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.excerpt,
			link: `/posts/${post.id}/`,
		})),
		customData: '<language>en-us</language>',
	});
}
