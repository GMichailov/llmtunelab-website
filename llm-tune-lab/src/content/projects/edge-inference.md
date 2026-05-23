---
title: "Edge Inference"
description: "Open-source inference engine for VLM processing on suboptimal hardware."
status: "in-progress"
tags: ["LLM", "Inference", "Robotics"]
links:
  github: "https://github.com/GMichailov/VLM-Edge-Inference/tree/main/src"
date: 2026-05-22
updated: 2026-05-23
---

This project aims to run batch inference layer by layer efficiently using a large VLM to generate and store outputs.
The demos for this project will be running the dense Qwen 3.5 27B and the MoE Qwen 3.5 122B-A10B on my Raspberry Pi with 2 GB RAM total and a 128GB SSD card.

## Purpose

Obviously, the demo is overkill because there is no reason to run a model that massive on a raspberry pi, however, we want to prototype and push the boundaries for edge inference. There are many situations, especially in robotics where fast and slow decisions can be made. The GPU hardware is extremely expensive and limiting, so we are creating a prototype that can process inputs at a time interval, save the results, and return them in an efficient manner.