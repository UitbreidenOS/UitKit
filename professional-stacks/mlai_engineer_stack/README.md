# ML/AI Engineer Stack

A comprehensive collection of skills, agents, workflows, and prompts designed for machine learning and AI engineers working with Claude Code.

## Overview

This stack provides specialized tooling and guidance for:

- **Model development** — Training, fine-tuning, and evaluation workflows
- **Data engineering** — Data pipeline design, feature engineering, and dataset management
- **Experiment tracking** — Logging, versioning, and comparing ML experiments
- **Production ML** — Model deployment, monitoring, and inference optimization
- **Prompt engineering** — Creating, testing, and optimizing Claude prompts
- **RAG systems** — Building retrieval-augmented generation systems
- **Fine-tuning** — Instruction-tuning and domain-specific model adaptation

## Directory Structure

```
mlai_engineer_stack/
├── skills/                  # ML/AI-specific slash commands
│   ├── model-training.md
│   ├── experiment-tracking.md
│   ├── prompt-optimization.md
│   └── ... (language subdirectories: fr/, de/, es/, nl/)
├── agents/                  # Specialized agent definitions
│   ├── ml-researcher.md
│   ├── data-engineer.md
│   └── prompt-specialist.md
├── workflows/               # End-to-end ML processes
│   ├── model-evaluation.md
│   ├── rag-pipeline-setup.md
│   └── prompt-tuning-cycle.md
├── prompts/                 # Reusable prompt templates
│   ├── code-review-ml.md
│   ├── dataset-analysis.md
│   └── model-comparison.md
├── hooks/                   # Event-triggered automations for ML workflows
│   ├── experiment-logger.sh
│   └── model-checkpoint-reminder.sh
├── examples/                # Complete working ML projects
│   ├── sentiment-analysis-pipeline/
│   ├── rag-chatbot/
│   └── prompt-tuning-framework/
└── README.md                # This file
```

## Key Components

### Skills
Focused tools for specific ML/AI tasks:
- **model-training** — Setting up training loops, hyperparameter tuning, loss curves
- **experiment-tracking** — Logging runs with MLflow, Weights & Biases, or Neptune
- **prompt-optimization** — Testing and improving Claude prompts systematically
- **dataset-analysis** — Exploratory data analysis and data quality checks
- **rag-implementation** — Building retrieval-augmented generation pipelines

### Agents
Specialized subagents for domain-specific work:
- **ml-researcher** — Model architecture design, research paper synthesis, novel approaches
- **data-engineer** — Data pipeline design, ETL optimization, schema design
- **prompt-specialist** — Prompt engineering, testing frameworks, optimization strategies

### Workflows
Complete processes for common ML tasks:
- **Model evaluation** — Benchmarking, cross-validation, error analysis
- **RAG pipeline setup** — Embedding selection, vector database configuration, retrieval tuning
- **Prompt tuning cycle** — Testing, iteration, performance measurement

### Hooks
Automations that trigger during your workflow:
- Auto-log experiment metrics when running training scripts
- Remind about model checkpointing best practices
- Track prompt version changes automatically

### Examples
Production-ready project templates:
- End-to-end sentiment analysis pipeline with fine-tuning
- RAG chatbot with retrieval optimization
- Prompt optimization framework with automated testing

## Translation

All skills, agents, workflows, and guides are available in:
- English (en/)
- French (fr/)
- German (de/)
- Spanish (es/)
- Dutch (nl/)

Each language subdirectory mirrors the English structure.

## Usage

### Activating a Skill
```
/ml-model-training
```

### Delegating to an Agent
```
@ml-researcher help me understand transformer architectures for my use case
```

### Following a Workflow
See the specific workflow file in `workflows/` for step-by-step guidance.

### Using a Prompt Template
Reference prompt files in `prompts/` when working with Claude to structure your requests.

## Contributing

When adding new content to this stack:

1. **Follow naming conventions** — Files use `kebab-case.md`, directories use `kebab-case/`
2. **Include translations** — All non-hook files must be translated to fr/, de/, es/, nl/
3. **Match the established format** — Skills use the standard format; agents use the agent format
4. **Reference Claude Code features** — Use actual slash commands, agents, and MCP servers
5. **Write for senior developers** — Assume domain knowledge; focus on patterns and best practices

## Integration with Claude Code

This stack integrates with Claude Code through:

- **Slash commands** — Activate skills with `/skill-name`
- **Agent delegation** — Spawn specialized agents with `@agent-name`
- **Hooks** — Automated triggers on specific events
- **MCP servers** — Access external tools (MLflow, Hugging Face, etc.)

## Resources

- [CLAUDE.md](../CLAUDE.md) — Repository guidelines and conventions
- [Claude Documentation](https://claude.com) — Claude API and models
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) — SDK examples

## Status

This stack is actively maintained and expanded. Check individual files for last-updated dates and version information.

---

**Last updated:** 2026-06-13
