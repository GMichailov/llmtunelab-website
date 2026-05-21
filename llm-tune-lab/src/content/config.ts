import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		category: z.enum(['local inference', 'models', 'tooling']),
		excerpt: z.string(),
		draft: z.boolean().optional().default(false),
	}),
});

export const collections = { posts };
