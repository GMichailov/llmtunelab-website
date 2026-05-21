import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		category: z.enum(['local inference', 'models', 'tooling']),
		excerpt: z.string(),
		draft: z.boolean().optional().default(false),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		status: z.enum(['active', 'in-progress', 'completed', 'on-hold']),
		tags: z.array(z.string()),
		links: z.object({
			github: z.string().optional(),
			paper: z.string().optional(),
			demo: z.string().optional(),
		}).optional(),
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		draft: z.boolean().optional().default(false),
	}),
});

export const collections = { posts, projects };
