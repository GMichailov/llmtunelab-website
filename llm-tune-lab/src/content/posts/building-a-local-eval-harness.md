---
title: "Building a local eval harness that doesn't lie to you"
date: 2024-04-15
category: "tooling"
excerpt: "Why most local evaluation setups give inflated scores, and how to build one that reflects real-world performance."
---

Evaluation numbers are easy to inflate. A slightly different prompt template, a generous few-shot selection, or a tokenizer mismatch can add 5-10 points to your benchmark. Here's how to build a harness that tells you the truth.

## The common pitfalls

Most local eval setups go wrong in predictable ways:

1. **Prompt template mismatch** — your eval uses a different chat template than your serving setup
2. **Tokenizer drift** — the model expects one tokenizer, you're using another
3. **Generation params** — greedy decoding for eval vs. sampling in production
4. **Context window** — truncating silently instead of flagging overflows

## A minimal harness

Here's the core loop:

```python
import json
from pathlib import Path

def evaluate(model, tasks, template_fn):
    results = {}
    for task in tasks:
        prompt = template_fn(task["input"])
        output = model.generate(prompt, max_tokens=task["max_tokens"])
        score = task["metric"](output, task["expected"])
        results[task["name"]] = score
    return results
```

The important part isn't the loop — it's the `template_fn`. This should be the **exact same template** you use in production. Copy it from your serving config, don't reimplement it.

## Sanity checks

Before trusting your numbers, run these checks:

- **Baseline comparison**: run the same eval through the reference implementation
- **Determinism check**: greedy decoding should produce identical outputs across runs
- **Truncation audit**: log how many examples hit the context limit
- **Metric alignment**: verify your metric computation matches the canonical implementation

## What to automate

Once the harness is trustworthy, wrap it in a script that:

1. Loads the model from your quantized checkpoint
2. Runs all tasks with the production chat template
3. Outputs a JSON report with per-task scores and metadata
4. Flags any task where the context was truncated

This gives you a reproducible eval you can run after every quantization experiment.
