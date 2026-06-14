---
name: agent-memory
description: "Agent memory and context management: design persistent memory systems, manage context windows, implement summarization strategies, and build stateful agents that learn across sessions"
updated: 2026-06-13
---

# Agent Memory & Context Management Skill

## When to activate
- Building agents that need to remember information across conversation turns
- Designing systems that must work within LLM context window limits (100K-200K tokens)
- Implementing long-term memory (vector stores, structured databases) for agents
- Building multi-session agents that accumulate knowledge over time
- When agent responses degrade due to context overflow or information loss
- Designing memory hierarchies (working memory, episodic, semantic, procedural)

## When NOT to use
- Stateless one-shot completions where no memory is needed
- Simple chatbots without domain-specific persistence requirements
- When the conversation fits entirely within the context window with room to spare
- Single-turn question-answering without session continuity

## Instructions

### 1. Memory Architecture Design

Choose the appropriate memory type for each information category:

| Memory Type | Analogy | Use Case | Implementation |
|---|---|---|---|
| **Working Memory** | Short-term RAM | Current conversation context | Context window (system prompt + messages) |
| **Episodic Memory** | Personal experiences | Past interactions, decisions made | Vector store with timestamps |
| **Semantic Memory** | Facts & knowledge | Domain knowledge, user preferences | Structured DB or knowledge graph |
| **Procedural Memory** | Skills & habits | Learned workflows, tool patterns | Fine-tuning or prompt templates |

### 2. Context Window Management

Strategies for staying within token limits:

**Prioritization (when context is full):**
1. System instructions (never evict)
2. Current task context (never evict)
3. Recent conversation turns (compress older turns)
4. Retrieved memory (summarize or re-retrieve)
5. Tool results (keep only relevant outputs)

**Compression techniques:**
- **Summarization:** Replace N old messages with 1 summary message
- **Selective inclusion:** Only include relevant turns based on current query
- **Rolling window:** Keep last K turns + summary of everything before
- **Semantic retrieval:** Instead of full history, retrieve relevant past interactions

### 3. Memory Read/Write Patterns

```python
# Memory write: after each significant interaction
async def store_memory(agent_id: str, interaction: dict):
    """Store important information from an interaction."""
    # Extract key facts, decisions, preferences
    facts = extract_facts(interaction)
    
    # Store in appropriate memory system
    for fact in facts:
        await semantic_memory.upsert(
            agent_id=agent_id,
            content=fact.text,
            metadata={
                "type": fact.type,  # preference, decision, fact
                "source": "conversation",
                "timestamp": datetime.now(),
                "confidence": fact.confidence,
            }
        )

# Memory read: before generating response
async def recall_memories(agent_id: str, query: str, top_k: int = 10):
    """Retrieve relevant memories for the current query."""
    # Semantic search across all memory types
    episodic = await episodic_memory.search(query, top_k=5)
    semantic = await semantic_memory.search(query, top_k=5)
    
    # Rank by relevance × recency × importance
    combined = rank_memories(episodic + semantic, query)
    return combined[:top_k]
```

### 4. Summarization Strategies

**Progressive summarization (best for long conversations):**
```
Turn 1-10: Full messages in context
Turn 11-50: Summary of turns 1-10 + full turns 11-50
Turn 51-100: Summary of turns 1-50 + full turns 51-100
Turn 101+: Summary of summaries + full recent turns
```

**Topic-based summarization:**
- Group past messages by topic
- Summarize each topic independently
- Include topic summaries as structured context

### 5. Memory Consistency & Conflicts

Handle contradictory information:
- **Timestamp precedence:** Newer information overrides older
- **Confidence scoring:** Higher confidence facts persist
- **Explicit contradiction detection:** Flag conflicts, ask user to clarify
- **Version tracking:** Keep history of changing facts (user preferences evolve)

### 6. Memory Persistence Patterns

**File-based (simple):**
```json
// .agent-memory/user-123.json
{
  "preferences": {"language": "en", "style": "concise"},
  "decisions": [
    {"date": "2026-06-13", "topic": "auth", "decision": "JWT over sessions"}
  ],
  "knowledge": ["project uses FastAPI", "deployed on AWS ECS"]
}
```

**Vector store (scalable):**
- Embed all memories with metadata
- Retrieve top-K relevant memories per query
- Decay old, unused memories over time

**Knowledge graph (structured):**
- Entity → relationship → entity triples
- Query by entity (all facts about user X) or relationship (all decisions about auth)

### 7. Context Budget Allocation

For a 200K token context window:

```
System prompt:          ~2K tokens  (1%)
Agent instructions:     ~3K tokens  (1.5%)
Retrieved memories:     ~5K tokens  (2.5%)
Tool descriptions:      ~5K tokens  (2.5%)
Current task context:   ~10K tokens (5%)
Conversation history:   ~170K tokens (85%)
Response generation:    ~5K tokens  (2.5%)
```

Adjust based on use case:
- Memory-heavy agents: Increase memory allocation, reduce history
- Conversation-heavy: Increase history, reduce memory
- Tool-heavy: Increase tool descriptions, use summarization for history

## Example

**Building a customer support agent with memory:**

```yaml
memory_config:
  working_memory:
    type: context_window
    max_tokens: 8000
    strategy: rolling_window
    keep_recent: 20  # last 20 messages
  
  episodic_memory:
    type: vector_store
    provider: pinecone
    embedding: text-embedding-3-small
    store:
      - past_tickets
      - resolution_steps
      - customer_feedback
    retrieval:
      top_k: 5
      min_similarity: 0.75
      rerank: true
  
  semantic_memory:
    type: structured_db
    provider: postgresql
    store:
      - customer_preferences  # language, timezone, product tier
      - product_knowledge     # known issues, workarounds
      - agent_decisions       # escalation history, compensation given
    update_policy: upsert_on_conflict  # newer wins
  
  memory_operations:
    on_turn_complete:
      - extract_facts(turn)
      - update_semantic_memory(facts)
      - store_episodic_if_significant(turn)
    
    on_new_conversation:
      - load_customer_profile(semantic_memory)
      - recall_recent_tickets(episodic_memory, days=30)
      - inject_into_system_prompt()
    
    on_context_overflow:
      - summarize_oldest_turns(n=10)
      - replace_with_summary()
      - re_retrieve_memories(current_query)
```

## Anti-Patterns

- **Memory bloat:** Storing every detail without pruning → retrieval noise
- **Stale memory:** Not updating facts when they change → incorrect responses
- **Context stuffing:** Filling context with low-relevance memories → degraded performance
- **No summarization:** Keeping full history until context overflow → abrupt information loss
- **Over-reliance on memory:** Retrieving memories for simple queries that don't need them → latency and cost
