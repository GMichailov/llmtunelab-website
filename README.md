# LLM Tune Lab

Technical blog about fine-tuning, evaluating, and serving open-weight LLMs. Built with [Astro](https://astro.build).

## Quick Start

```bash
cd llm-tune-lab
npm install
npm run dev       # dev server at localhost:4321
npm run build     # static build to dist/
npm run preview   # preview production build
```

## Project Structure

```
llm-tune-lab/
├── astro.config.mjs          # Site config, MDX + Shiki setup
├── public/
│   ├── logo.png              # Full logo
│   ├── logo_clear.png        # Logo (transparent bg, used in header/footer)
│   ├── favicon.svg
│   └── favicon.ico
├── src/
│   ├── content.config.ts     # Content collection schema (glob loader)
│   ├── styles/
│   │   └── global.css        # Design tokens, reset, base styles
│   ├── layouts/
│   │   ├── BaseLayout.astro  # HTML shell, fonts, meta, nav + footer
│   │   └── PostLayout.astro  # Blog post layout (narrow content, prose styles)
│   ├── components/
│   │   ├── NavHeader.astro   # Logo top-left, nav links right, divider
│   │   ├── Footer.astro      # Subscribe form, branding, links, copyright
│   │   └── PostCard.astro    # Post list item (date, category, title, excerpt)
│   ├── content/
│   │   └── posts/            # Blog posts (md/mdx)
│   │       ├── running-llama3-70b-on-3090.md
│   │       ├── speculative-decoding-when-approximation-pays-off.md
│   │       └── building-a-local-eval-harness.md
│   └── pages/
│       ├── index.astro       # Homepage — hero + recent posts
│       ├── archive.astro     # All posts with category filter tabs
│       ├── about.astro       # About the lab
│       ├── rss.xml.ts        # RSS feed endpoint
│       └── posts/
│           └── [...slug].astro  # Dynamic post pages
```

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `index.astro` | Hero section + 3 most recent posts |
| `/archive` | `archive.astro` | All posts with client-side category filtering |
| `/about` | `about.astro` | Static about page |
| `/posts/[slug]` | `posts/[...slug].astro` | Individual blog post |
| `/rss.xml` | `rss.xml.ts` | RSS feed |

## Design Tokens

Defined in `src/styles/global.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0f1117` | Page background |
| `--text-primary` | `#ffffff` | Headings, primary text |
| `--text-secondary` | `#d1d5db` | Body text, descriptions |
| `--text-muted` | `#6b7280` | Metadata, dates, labels |
| `--accent` | `#8b5cf6` | Purple accent (links, badges, buttons) |
| `--border` | `#374151` | Dividers, input borders |
| `--code-bg` | `#1e1e1e` | Code block backgrounds |
| `--font-body` | Inter | Body text |
| `--font-mono` | Fira Code | Code, inline monospace |

## Writing Posts

Create a `.md` or `.mdx` file in `src/content/posts/` with this frontmatter:

```yaml
---
title: "Post Title"
date: 2025-01-15
category: "local inference"  # local inference | models | tooling
excerpt: "Short description for card and RSS."
draft: false                  # omit or set false to publish
---
```

Posts are auto-discovered via the glob loader in `content.config.ts`. Set `draft: true` to exclude from builds.

## Content Collections

Uses Astro's glob loader (not the legacy `type: 'content'` API):

```ts
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({ ... }),
});
```

## Fonts

Google Fonts loaded in `BaseLayout.astro`: **Inter** (400/500/600/700) for body, **Fira Code** (400/500) for code.
