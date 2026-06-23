#!/usr/bin/env node

const path = require('path');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

const colorTier = (tier) => {
  if (tier.includes('haiku')) return `${GREEN}${tier}${RESET}`;
  if (tier.includes('sonnet')) return `${YELLOW}${tier}${RESET}`;
  if (tier.includes('opus')) return `${RED}${tier}${RESET}`;
  return tier;
};

const help = () => {
  console.log(`
${BOLD}claudient-moe — Mixture of Experts model routing${RESET}

${BOLD}Usage:${RESET}
  claudient moe classify <task>
  claudient moe cascade <task> [--confidence-threshold=0.65]
  claudient moe panel <task> [--models=haiku,sonnet,opus] [--strategy=majority|synthesis|weighted]
  claudient moe domain <paths> <task>
  claudient moe budget <task> --remaining=<N> [--total=100000]
  claudient moe status

${BOLD}Examples:${RESET}
  claudient moe classify "format the CSV file"
  claudient moe cascade "design a distributed system"
  claudient moe domain "src/security/auth.ts" "review"
  claudient moe budget "refactor module" --remaining 25000 --total 100000
  claudient moe status
  `);
};

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    help();
    process.exit(0);
  }

  const MoeRouter = await import(path.resolve(__dirname, '../lib/moe-router.js'));
  const { classifyTask, createCascadeRunner, createParallelPanel, routeByDomain, budgetGovernedRouter, TIERS } = MoeRouter.default;

  const command = args[0];

  switch (command) {
    case 'classify': {
      const task = args.slice(1).join(' ');
      if (!task) {
        console.error('Usage: claudient moe classify <task>');
        process.exit(1);
      }
      const result = classifyTask(task);
      console.log(`${BOLD}Tier Router${RESET}`);
      console.log(`Tier:       ${colorTier(result.tier)}`);
      console.log(`Reasoning:  ${result.reasoning}`);
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      break;
    }

    case 'cascade': {
      const thresholdArg = args.find(a => a.startsWith('--confidence-threshold='));
      const threshold = thresholdArg ? parseFloat(thresholdArg.split('=')[1]) : 0.65;
      const taskArgs = args.filter(a => !a.startsWith('--'));
      const task = taskArgs.slice(1).join(' ');
      if (!task) {
        console.error('Usage: claudient moe cascade <task> [--confidence-threshold=0.65]');
        process.exit(1);
      }
      const cascadeRunner = createCascadeRunner({ confidenceThreshold: threshold });
      const result = await cascadeRunner(task);
      console.log(`${BOLD}Cascade Escalator${RESET}`);
      console.log(`Original Tier:  ${colorTier(result.originalTier)}`);
      console.log(`Final Tier:     ${colorTier(result.selectedTier)}`);
      console.log(`Escalations:    ${result.escalations}`);
      console.log(`Reasoning:      ${result.reasoning}`);
      break;
    }

    case 'panel': {
      const strategyArg = args.find(a => a.startsWith('--strategy='));
      const strategy = strategyArg ? strategyArg.split('=')[1] : 'majority';
      const modelsArg = args.find(a => a.startsWith('--models='));
      const taskArgs = args.filter(a => !a.startsWith('--'));
      const task = taskArgs.slice(1).join(' ');
      if (!task) {
        console.error('Usage: claudient moe panel <task> [--strategy=majority|synthesis|weighted]');
        process.exit(1);
      }
      const panel = createParallelPanel({ votingStrategy: strategy });
      const panelResults = await panel.run(task);
      const aggregated = panel.aggregate(panelResults);
      console.log(`${BOLD}Parallel Expert Panel${RESET}`);
      console.log(`\n${BOLD}Individual Experts:${RESET}`);
      panelResults.forEach(r => {
        console.log(`  ${colorTier(r.model)}: ${r.tier} (confidence: ${(r.confidence * 100).toFixed(1)}%)`);
      });
      console.log(`\n${BOLD}Consensus${RESET}`);
      console.log(`Tier:     ${colorTier(aggregated.consensus)}`);
      console.log(`Strategy: ${aggregated.strategy}`);
      console.log(`Details:  ${aggregated.reasoning}`);
      break;
    }

    case 'domain': {
      if (args.length < 3) {
        console.error('Usage: claudient moe domain <paths> <task>');
        process.exit(1);
      }
      const paths = args[1].split(',').map(p => p.trim());
      const task = args.slice(2).join(' ');
      const result = routeByDomain(paths, task);
      console.log(`${BOLD}Domain Expert Router${RESET}`);
      console.log(`Detected Domain: ${result.domain}`);
      console.log(`Routed Tier:     ${colorTier(result.tier)}`);
      console.log(`Reasoning:       ${result.reasoning}`);
      break;
    }

    case 'budget': {
      const remainingArg = args.find(a => a.startsWith('--remaining='));
      const totalArg = args.find(a => a.startsWith('--total='));
      if (!remainingArg) {
        console.error('Usage: claudient moe budget <task> --remaining=<N> [--total=100000]');
        process.exit(1);
      }
      const remaining = parseInt(remainingArg.split('=')[1], 10);
      const total = totalArg ? parseInt(totalArg.split('=')[1], 10) : 100000;
      const taskArgs = args.filter(a => !a.startsWith('--'));
      const task = taskArgs.slice(1).join(' ');
      if (!task) {
        console.error('Usage: claudient moe budget <task> --remaining=<N> [--total=100000]');
        process.exit(1);
      }
      const governor = budgetGovernedRouter({ totalBudget: total });
      const result = governor.route(task, remaining);
      console.log(`${BOLD}Budget Governor${RESET}`);
      console.log(`Budget Ratio:    ${result.budgetRatio} (${(parseFloat(result.budgetRatio) * 100).toFixed(1)}%)`);
      console.log(`Routed Tier:     ${colorTier(result.tier)}`);
      console.log(`Reasoning:       ${result.reasoning}`);
      if (result.originalTier) console.log(`Original Tier:   ${colorTier(result.originalTier)}`);
      break;
    }

    case 'status': {
      console.log(`${BOLD}MoE Routing System Status${RESET}\n`);
      console.log('╔════════════════════════════════════════════════╗');
      console.log('║ Mode              │ Status     │ Threshold     ║');
      console.log('╠════════════════════════════════════════════════╣');
      console.log('║ Tier Router       │ Active     │ Keyword-based ║');
      console.log('║ Cascade Escalator │ Active     │ 0.65 conf     ║');
      console.log('║ Parallel Panel    │ Active     │ Voting        ║');
      console.log('║ Domain Router     │ Active     │ Path heuristic║');
      console.log('║ Budget Governor   │ Active     │ 15% / 50%     ║');
      console.log('╚════════════════════════════════════════════════╝');
      console.log(`\nTier Costs (relative):`);
      console.log(`  ${GREEN}Haiku${RESET}  : 1x cost (fastest, cheapest)`);
      console.log(`  ${YELLOW}Sonnet${RESET} : 12x cost (balanced)`);
      console.log(`  ${RED}Opus${RESET}   : 300x cost (most powerful reasoning)`);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      help();
      process.exit(1);
  }
}

main().catch(err => {
  console.error(`${RED}Error:${RESET}`, err.message);
  process.exit(1);
});
