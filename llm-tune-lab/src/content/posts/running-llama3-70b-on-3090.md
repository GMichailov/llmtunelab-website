---
title: "Running Llama 3 70B on a single 3090, comfortably"
date: 2024-04-21
category: "local inference"
excerpt: "Quantization, KV cache offload, and the surprisingly large gap between 'it boots' and 'it's usable'."
---

Running a 70B model on consumer hardware sounds like a party trick. It's not — it's a systems problem, and most of the effort goes into things that don't show up in benchmark tables.

## The quantization question

The first decision is quantization. At 70B parameters, FP16 needs ~140 GB of VRAM. A single 3090 has 24 GB. Even 4-bit quantization (AWQ or GPTQ) needs ~40 GB for weights alone, plus KV cache.

The practical answer: **Q3_K_M with KV cache offloaded to system RAM.** It's not pretty, but it works for batch-1 inference at acceptable speeds.

## My recipe of choice

Here's the configuration that gave me the best quality-per-token on a single 3090:

```bash
./main \
  -m llama-3-70b-q3_k_m.gguf \
  --ctx-size 4096 \
  --batch-size 512 \
  --n-gpu-layers 35 \
  --threads 8 \
  --temp 0.7 \
  --top-p 0.9
```

The key parameter is `--n-gpu-layers 35`. That keeps the first 35 layers on the GPU and offloads the rest to RAM. The split point matters more than you'd think — too few GPU layers and you're bandwidth-starved, too many and you OOM mid-generation.

## What "usable" actually means

I define usable as: **generates coherent text at >3 tokens/second with a 4096 context window.** Below that, the interaction feels broken regardless of output quality.

At Q3_K_M with 35 GPU layers, I get roughly 4.5 t/s on prompt processing and 3.8 t/s during generation. Good enough for interactive use. Not good enough for production.

## The verdict

Can you do it? Yes. Should you? Depends on your tolerance for latency and your willingness to spend an afternoon tuning offload parameters. The gap between "it boots" and "it's usable" is wider than most blog posts suggest.
