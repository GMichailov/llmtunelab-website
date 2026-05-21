---
title: "LoRA Kernel"
description: "Open-source CUDA kernel library for LoRA fine-tuning, providing fused adapters and memory-efficient backward passes for consumer-GPU training."
status: "active"
tags: ["CUDA", "LoRA", "fine-tuning", "GPU kernels"]
links:
  github: "https://github.com/llmtunelab/lora-kernel"
date: 2025-03-10
updated: 2025-05-15
---

## Motivation

Standard LoRA implementations materialize full gradient tensors before applying the low-rank update. On consumer GPUs with 24GB VRAM, this caps your usable model size at around 13B parameters with batch size 1.

LoRA Kernel fuses the adapter forward and backward passes into single CUDA kernels, reducing peak memory by 30-40% and improving throughput on Ada Lovelace and Hopper architectures.

## Architecture

The library provides three fused kernels:

1. **Fused LoRA Forward** — computes `W₀x + BAx` in a single kernel launch, avoiding the intermediate `BAx` allocation
2. **Fused LoRA Backward** — computes both gradient flows in one pass
3. **Quantized Adapter Merge** — merges LoRA weights into a quantized base model without dequantization

## Benchmarks

Results on RTX 4090 with Llama 3 8B:

| Batch Size | Standard LoRA | LoRA Kernel | Memory Saved |
|------------|--------------|-------------|-------------|
| 1          | 18.2 GB      | 11.4 GB     | 37%         |
| 2          | OOM          | 19.1 GB     | —           |

## Getting Started

```bash
pip install lora-kernel
```

See the [GitHub repository](https://github.com/llmtunelab/lora-kernel) for full documentation.
