// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
	site: 'https://gmichailov.github.io',
	base: '/llmtunelab',
	integrations: [mdx()],
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
		},
	},
});
