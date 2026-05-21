---
title: "Debate-to-Distill: Generating Capability-Aware Tool Calling GRPO Data via Agentic Debate for LLM Self-Distillation in RLVR Domains"
description: "A framework for helping tool-using models to learn when to reason independently versus when to call external tools or stronger models. It uses agentic debate, verifiable rewards, and self-distillation to generate GRPO training data that improves capability-aware decision-making while reducing unnecessary inference cost."
status: "active"
tags: ["Reinforcement Learning", "Agents"]
links:
  github: "https://github.com/llmtunelab/"
date: 2026-05-10
updated: 2026-05-20
---

## Motivation

In the last few years, Agentic AI systems have risen to prominence as a tool for automation. Agentic AI is an LLM backbone being fed textual context based on an environment and making decisions within this environment, often explored/navigated through tool calling. This has led to significantly more capable systems, however, this leads to a massive cost on inference providers. When a tool call occurs, this current generation sequence leaves the GPU while the tool executes. When the execution completes, the agentic infrastructure includes it as context in the subsequent new prompt and submits another request. When this new request begins being processed, the server must run through another prefill state which is significantly more compute and time intensive than the decode phase. This is even more problematic in the age of long context agents where context windows are reaching and surpassing one million tokens. To somewhat mitigate this problem, chunked prefill tactics have been employed, however, this can only partially mitigate the problem. Additionally, from the labs’ perspective, many models are trained with RL rewards to make tool calls with the primary objective being maximizing the likelihood of correctness, which often comes with unnecessary tool calls rather than risking small reasoning mistakes. Another difficulty with this type of training is that models’ capabilities are closely tied to the number of parameters they use, meaning that while a small model benefits from distillation from a large model, there is a high likelihood that its reasoning capabilities are much weaker than the teacher model’s and therefore opting to reason rather than tool call is model specific. This endeavor explores whether RLVR GRPO training data can be generated through agentic debate and self-distillation for a model to selectively avoid unnecessary tool calls when the task appears solvable within the model’s internal capabilities. A success will be demonstrating that a model was successfully able to reduce the number of tool calls it makes within an environment (measured both through tool invocations and inference time) while maintaining its current level of capabilities.

## Other Considerations

Generating RL data is very expensive and difficult for a few reasons. First and foremost, RL training requires data to be generated repeatedly using updated versions of the policy itself. Using stale trajectories can destabilize training because the model parameters quickly drift away from the distribution that produced the original samples. This creates a difficult systems challenge: inference for rollout generations, parameter synchronization, reward computation, and gradient updates must all occur continuously and efficiently at scale. Balancing these competing workloads is both computationally and financially expensive, especially for long-context agentic systems with frequent tool calls.

## Design

With verifiable rewards to identify when a model can solve a task independently, when it benefits from tools, and when it fails even with full tool access. By selectively masking tools during agentic debate, the system can generate capability-aware training examples: problems the model can solve unaided, problems that may potentially require tool invocation, and problems where tool use would be insufficient due to the capabilities of the model, allowing GRPO data to reward appropriate tool-calling behavior rather than tool use alone.