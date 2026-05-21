---
title: "Speculative Quantization for Adaptive Inference"
description: "A working paper exploring speculative decoding techniques applied to mixed-precision quantization, enabling dynamic precision switching during inference."
status: "in-progress"
tags: ["quantization", "speculative decoding", "research paper", "mixed-precision"]
links:
  github: "https://github.com/llmtunelab/speculative-quant"
date: 2025-04-01
updated: 2025-05-18
---

## Abstract

We propose a method that applies the speculative decoding framework to mixed-precision quantization. Instead of running the entire model at a single precision level, we speculatively execute layers at lower precision and verify against a higher-precision draft.

## Problem Statement

Current mixed-precision approaches require offline calibration to determine per-layer precision assignments. This is suboptimal because:

- Input difficulty varies across batches
- Static assignments waste precision on easy tokens
- Recalibration is expensive when the distribution shifts

## Proposed Approach

Our method introduces a lightweight "precision predictor" that runs ahead of the main model. For each layer:

1. The predictor estimates the sensitivity of the current input to quantization error
2. Layers predicted to be robust run at INT4
3. Layers predicted to be sensitive run at INT8 or FP16
4. A verification step checks for divergence

## Current Status

The paper is in active writing. We have preliminary results on Llama 3 8B and Mistral 7B showing 15-20% throughput improvement with less than 0.3% accuracy degradation on GSM8K.
