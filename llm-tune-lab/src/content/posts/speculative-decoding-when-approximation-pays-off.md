---
title: "Speculative decoding: when approximation pays off"
date: 2024-04-18
category: "models"
excerpt: "Using a tiny draft model to speed up autoregressive generation by 2-3x, without sacrificing output quality."
---

Autoregressive generation is inherently serial — each token depends on all previous tokens. Speculative decoding breaks this bottleneck by guessing ahead and verifying in parallel.

## How it works

The idea is simple: run a small **draft model** that generates K candidate tokens, then run the large **target model** on all K tokens in a single forward pass. The target model either accepts or rejects each token.

```
Draft model:  token₁  token₂  token₃  token₄
                ↓       ↓       ↓       ↓
Target model:  ✓       ✓       ✗
```

In this example, tokens 1 and 2 are accepted. Token 3 is rejected, and generation resumes from the target model's distribution at that position.

## The math

The expected speedup depends on the **acceptance rate** (α) and the number of speculative tokens (K):

```
Speedup ≈ (1 + α·K) / (1 + K·cost_ratio)
```

Where `cost_ratio` is the draft model's cost relative to verifying K tokens with the target. In practice, with a 7B draft model and 70B target, you see 2-3x speedup on code generation tasks.

## When it doesn't work

Speculative decoding struggles with:

- **High-entropy outputs** (creative writing, brainstorming) — low acceptance rates
- **Very small targets** — the overhead of the draft model isn't worth it
- **Batched inference** — the gains are per-sequence and don't compound

## Practical tips

1. Pick a draft model from the same family (Llama 3 8B drafts for Llama 3 70B)
2. Start with K=4 speculative tokens
3. Monitor acceptance rate — if it drops below 60%, reduce K or switch draft models
