# Production AI Advisor

An AI system built with TypeScript.

It demonstrates how to build LLM features with predictable behavior, evals, retrieval, and monitoring.

This is an independent demo inspired by patterns from my private productivity project named Tascalm.

The system uses an LLM to provide personalized advices on productivity, reaching goals more efficiently, and avoiding overload. It uses the user's daily task and habit data.  
This demo uses synthetic data.

## Architecture

```text
User Data
    ↓
Statistics
    ↓
Deterministic Signals
    ↓
Knowledge Retrieval
    ↓
Prompt Builder
    ↓
LLM
    ↓
Structured Output
    ↓
Validation
    ↓
Advice
```

The same pipeline is tested with a golden dataset before changes are deployed.

```text
Golden Cases
    ↓
Deterministic Checks
    ↓
Retrieval Evals
    ↓
LLM Evals
    ↓
Quality Gates
    ↓
CI
```

## Key Design Decisions

### 1. Deterministic rules stay in code

The application calculates deterministic signals such as `LOW_TASK_COMPLETION`. The LLM focuses on interpretation and language.

**Why:** deterministic logic should stay deterministic.

### 2. Product knowledge is separated from business logic

Product guidance is stored separately and provided to the LLM as context.

**Why:** product knowledge can change without changing business logic.

### 3. Retrieval is used when the knowledge base grows

Small knowledge bases can be sent directly to the LLM. Larger ones use embeddings and vector retrieval.

Exact signal IDs can use direct lookup. Semantic search is used when the required knowledge is not known in advance.

**Why:** the model receives only relevant context, reducing tokens and noise.

### 4. The LLM returns structured output

The LLM returns a typed response which is validated before use.

**Why:** LLM output is treated as untrusted application input.

## Evaluation

Changes are tested against synthetic golden cases.

```text
Golden Cases
    ↓
Deterministic Evals
    ↓
Retrieval Evals
    ↓
LLM-as-a-Judge
    ↓
Quality Gates
```

Deterministic behavior is checked with code.

Retrieval quality is measured with `Recall@K` and `Precision@K`.

Subjective qualities such as groundedness, relevance, usefulness, and tone are evaluated with an LLM judge.

**Why:** prompt, model, and retrieval changes should be measurable before deployment.

## Quality Gates

Eval results are checked against defined thresholds.

Examples:

```text
Schema validity        >= 99%
Critical rules         = 100%
Recall@5               >= 90%
Groundedness           >= 4.0
```

A critical regression fails the pipeline.

## Observability

Production monitoring covers latency, errors, token usage, cost, validation failures, fallbacks, retrieval failures, and LLM API failures.

**Why:** quality, reliability, latency, and cost all matter in production.

## Repository Structure

```text
src/
├── signals/
├── retrieval/
├── llm/
├── schemas/
├── evaluation/
└── advisor.ts

knowledge/
evals/
docs/
.github/workflows/
```

## CI

```text
Unit Tests → Evals → Quality Gates
```

Failed quality gates block the pipeline.

## Tech Stack

TypeScript · Node.js · Zod · LLM API · Embeddings · Vector Retrieval · Vitest · GitHub Actions

## Goal

The goal is to show how an LLM can be used as one component of a reliable backend system.