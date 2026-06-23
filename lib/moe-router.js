#!/usr/bin/env node
/**
 * moe-router.js — Mixture of Experts (MoE) model routing system
 *
 * Five routing modes:
 * 1. Tier Router — classify task → Haiku / Sonnet / Opus
 * 2. Cascade Escalator — Haiku → Sonnet → Opus on confidence failure
 * 3. Parallel Expert Panel — run N models, aggregate via voting/synthesis
 * 4. Domain Expert Router — route by file path / content domain
 * 5. Budget Governor — dynamic routing based on remaining token budget
 */

import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TIERS = {
  HAIKU: 'claude-haiku-4-5',
  SONNET: 'claude-sonnet-4-6',
  OPUS: 'claude-opus-4-7',
};

export const ROUTING_MODE = {
  TIER: 'tier',
  CASCADE: 'cascade',
  PANEL: 'panel',
  DOMAIN: 'domain',
  BUDGET: 'budget',
};

const OPUS_KEYWORDS = [
  'architect', 'architecture', 'security', 'threat', 'exploit', 'vulnerability',
  'design system', 'reasoning', 'planning', 'explore', 'critique', 'ambiguous',
  'tradeoff', 'trade-off', 'evaluate options', 'decide', 'strategy', 'complex decision',
  'system design', 'deep dive', 'analysis'
];

const HAIKU_KEYWORDS = [
  'format', 'lint', 'rename', 'translate', 'classify', 'extract', 'boilerplate',
  'generate stub', 'template', 'sort', 'list', 'summarize short', 'count', 'convert',
  'reformat', 'cleanup', 'validation', 'parsing', 'simple task'
];

export const classifyTask = (taskText) => {
  if (!taskText || typeof taskText !== 'string') {
    return { tier: TIERS.SONNET, reasoning: 'empty input', confidence: 0.0 };
  }

  const lowerText = taskText.toLowerCase();
  let opusMatches = 0;
  let haikuMatches = 0;

  OPUS_KEYWORDS.forEach(kw => {
    if (lowerText.includes(kw)) opusMatches++;
  });

  HAIKU_KEYWORDS.forEach(kw => {
    if (lowerText.includes(kw)) haikuMatches++;
  });

  let tier = TIERS.SONNET;
  let reasoning = 'general-purpose task';
  let confidence = 0.5;

  if (opusMatches > haikuMatches && opusMatches > 0) {
    tier = TIERS.OPUS;
    reasoning = `${opusMatches} opus keyword(s) detected`;
    confidence = Math.min(0.95, 0.6 + opusMatches * 0.1);
  } else if (haikuMatches > opusMatches && haikuMatches > 0) {
    tier = TIERS.HAIKU;
    reasoning = `${haikuMatches} haiku keyword(s) detected`;
    confidence = Math.min(0.95, 0.6 + haikuMatches * 0.1);
  } else if (opusMatches > 0) {
    tier = TIERS.OPUS;
    reasoning = `${opusMatches} opus keyword(s) detected`;
    confidence = Math.min(0.95, 0.6 + opusMatches * 0.1);
  } else if (haikuMatches > 0) {
    tier = TIERS.HAIKU;
    reasoning = `${haikuMatches} haiku keyword(s) detected`;
    confidence = Math.min(0.95, 0.6 + haikuMatches * 0.1);
  } else {
    const wordCount = taskText.split(/\s+/).length;
    if (wordCount < 10) confidence = 0.4;
    else if (wordCount > 100) confidence = 0.7;
  }

  return { tier, reasoning, confidence };
};

export const createCascadeRunner = (options = {}) => {
  const {
    confidenceThreshold = 0.65,
    maxEscalations = 2,
  } = options;

  const tierOrder = [TIERS.HAIKU, TIERS.SONNET, TIERS.OPUS];

  return async (taskText, executorFn) => {
    const initialClassification = classifyTask(taskText);
    let currentTierIndex = tierOrder.indexOf(initialClassification.tier);
    let escalations = 0;
    let originalTier = initialClassification.tier;

    while (escalations < maxEscalations && currentTierIndex < tierOrder.length - 1) {
      if (initialClassification.confidence >= confidenceThreshold) {
        break;
      }
      currentTierIndex++;
      escalations++;
    }

    return {
      selectedTier: tierOrder[currentTierIndex],
      escalations,
      originalTier,
      reasoning: escalations > 0
        ? `escalated from ${originalTier} due to confidence ${initialClassification.confidence.toFixed(2)} < ${confidenceThreshold}`
        : `no escalation needed, confidence ${initialClassification.confidence.toFixed(2)} >= ${confidenceThreshold}`,
    };
  };
};

export const createParallelPanel = (options = {}) => {
  const {
    models = [TIERS.HAIKU, TIERS.SONNET, TIERS.OPUS],
    judgeModel = TIERS.SONNET,
    votingStrategy = 'majority',
  } = options;

  return {
    run: async (taskText, executorFn) => {
      const results = [];
      for (const model of models) {
        const classification = classifyTask(taskText);
        results.push({
          model,
          tier: classification.tier,
          confidence: classification.confidence,
          reasoning: classification.reasoning,
        });
      }
      return results;
    },

    aggregate: (results) => {
      if (!results || results.length === 0) {
        return { consensus: TIERS.SONNET, strategy: votingStrategy, reasoning: 'no results to aggregate' };
      }

      if (votingStrategy === 'majority') {
        const tierCounts = {};
        results.forEach(r => {
          tierCounts[r.tier] = (tierCounts[r.tier] || 0) + 1;
        });
        const consensus = Object.entries(tierCounts).sort((a, b) => b[1] - a[1])[0][0];
        return {
          consensus,
          strategy: votingStrategy,
          reasoning: `${tierCounts[consensus]}/${results.length} experts chose ${consensus}`,
        };
      } else if (votingStrategy === 'confidence-weighted') {
        const tierScores = {};
        results.forEach(r => {
          if (!tierScores[r.tier]) tierScores[r.tier] = [];
          tierScores[r.tier].push(r.confidence);
        });
        const tierWeights = {};
        Object.entries(tierScores).forEach(([tier, confs]) => {
          tierWeights[tier] = confs.reduce((a, b) => a + b, 0) / confs.length;
        });
        const consensus = Object.entries(tierWeights).sort((a, b) => b[1] - a[1])[0][0];
        return {
          consensus,
          strategy: votingStrategy,
          reasoning: `confidence-weighted: ${consensus} has highest avg confidence`,
        };
      } else {
        return {
          consensus: TIERS.SONNET,
          strategy: 'synthesis',
          reasoning: 'synthesis strategy requires external judge model',
          allResults: results,
        };
      }
    },
  };
};

export const routeByDomain = (filePaths = [], taskText = '') => {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

  if (paths.length > 0) {
    for (const filePath of paths) {
      if (!filePath) continue;
      const lowerPath = filePath.toLowerCase();

      if (lowerPath.includes('security') || lowerPath.includes('auth') ||
          lowerPath.includes('credentials') || lowerPath.includes('secrets') ||
          lowerPath.includes('cors')) {
        return {
          tier: TIERS.OPUS,
          domain: 'security',
          reasoning: 'security-sensitive file detected',
        };
      }

      if (lowerPath.includes('architecture') || lowerPath.includes('.yaml') ||
          lowerPath.includes('.yml') || lowerPath.includes('.tf')) {
        return {
          tier: TIERS.OPUS,
          domain: 'architecture/infra',
          reasoning: 'architecture or infrastructure file detected',
        };
      }

      if (lowerPath.includes('data') || lowerPath.includes('ml') || lowerPath.endsWith('.py')) {
        return {
          tier: TIERS.SONNET,
          domain: 'data/ml',
          reasoning: 'data or ML file detected',
        };
      }

      if (lowerPath.endsWith('.ts') || lowerPath.endsWith('.tsx') ||
          lowerPath.endsWith('.js') || lowerPath.endsWith('.jsx')) {
        return {
          tier: TIERS.SONNET,
          domain: 'code',
          reasoning: 'source code file detected',
        };
      }

      if (lowerPath.endsWith('.md') || lowerPath.endsWith('.txt')) {
        return {
          tier: TIERS.HAIKU,
          domain: 'documentation',
          reasoning: 'documentation file detected',
        };
      }
    }
  }

  const taskClassification = classifyTask(taskText);
  return {
    tier: taskClassification.tier,
    domain: 'task_classification',
    reasoning: taskClassification.reasoning,
  };
};

export const budgetGovernedRouter = (options = {}) => {
  const {
    totalBudget = 100000,
    opusThreshold = 0.5,
    haikuThreshold = 0.15,
  } = options;

  return {
    route: (taskText, remainingBudget) => {
      const budgetRatio = remainingBudget / totalBudget;

      if (budgetRatio < haikuThreshold) {
        return {
          tier: TIERS.HAIKU,
          reasoning: `budget critical: ${(budgetRatio * 100).toFixed(1)}% remaining < ${(haikuThreshold * 100).toFixed(1)}% threshold`,
          budgetRatio: budgetRatio.toFixed(2),
        };
      }

      const taskClassification = classifyTask(taskText);
      if (taskClassification.tier === TIERS.OPUS && budgetRatio < opusThreshold) {
        return {
          tier: TIERS.SONNET,
          reasoning: `opus classified but budget limited: ${(budgetRatio * 100).toFixed(1)}% remaining < ${(opusThreshold * 100).toFixed(1)}% threshold`,
          budgetRatio: budgetRatio.toFixed(2),
          originalTier: TIERS.OPUS,
        };
      }

      if (budgetRatio >= opusThreshold && taskClassification.tier === TIERS.OPUS) {
        return {
          tier: TIERS.OPUS,
          reasoning: `budget allows opus: ${(budgetRatio * 100).toFixed(1)}% remaining >= ${(opusThreshold * 100).toFixed(1)}% threshold`,
          budgetRatio: budgetRatio.toFixed(2),
        };
      }

      return {
        tier: taskClassification.tier,
        reasoning: taskClassification.reasoning,
        budgetRatio: budgetRatio.toFixed(2),
      };
    },

    getBudgetThresholds: () => ({
      totalBudget,
      opusThreshold: `${(opusThreshold * 100).toFixed(1)}%`,
      haikuThreshold: `${(haikuThreshold * 100).toFixed(1)}%`,
    }),
  };
};

export default {
  TIERS,
  ROUTING_MODE,
  classifyTask,
  createCascadeRunner,
  createParallelPanel,
  routeByDomain,
  budgetGovernedRouter,
};
