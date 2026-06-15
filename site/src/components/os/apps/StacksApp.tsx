import { useState, useMemo } from "react";
import { Eyebrow, Tag } from "./ui";

/* ─── helpers ─── */
const title = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface StackDef {
  name: string;
  icon: string;
  desc: string;
  color: string;
  skills: { id: string; name: string }[];
  cmds: string[];
}

/* ─── all 50 stacks with real skill data ─── */
const stacks: StackDef[] = [
  { name: "Full-Stack Developer", icon: "⚡", desc: "Frontend + backend + database + deployment skills.", color: "#3fb950",
    skills: [
      { id: "adr-writer", name: "ADR Writer" }, { id: "debugging-assistant", name: "Debugging Assistant" },
      { id: "dependency-auditor", name: "Dependency Auditor" }, { id: "performance-analyzer", name: "Performance Analyzer" },
      { id: "pr-reviewer", name: "PR Reviewer" }, { id: "refactoring-recommender", name: "Refactoring Recommender" },
      { id: "security-scanner", name: "Security Scanner" }, { id: "test-generator", name: "Test Generator" },
    ], cmds: ["review-pr", "generate-tests", "audit-deps"] },
  { name: "AI SDR", icon: "📞", desc: "Prospecting, outreach, and pipeline management.", color: "#f54e00",
    skills: [
      { id: "campaign-tracker", name: "Campaign Tracker" }, { id: "crm-logger", name: "CRM Logger" },
      { id: "email-personalizer", name: "Email Personalizer" }, { id: "follow-up-scheduler", name: "Follow-Up Scheduler" },
      { id: "lead-scorer", name: "Lead Scorer" }, { id: "meeting-confirmator", name: "Meeting Confirmator" },
      { id: "objection-handler", name: "Objection Handler" }, { id: "response-classifier", name: "Response Classifier" },
    ], cmds: ["prospect-batch", "score-lead", "execute-sequence"] },
  { name: "DevOps Platform", icon: "🏗️", desc: "CI/CD, IaC, monitoring, incident response.", color: "#1d4aff",
    skills: [
      { id: "ci_cd", name: "CI/CD Pipelines" }, { id: "docker", name: "Docker Optimization" },
      { id: "infrastructure", name: "Infrastructure Disaster Recovery" }, { id: "kubernetes", name: "Kubernetes Deployment" },
      { id: "logging", name: "ELK Logging" }, { id: "monitoring", name: "Prometheus Alerting" },
      { id: "security", name: "Security Scanning" }, { id: "terraform", name: "Terraform Modules" },
    ], cmds: ["deploy-k8s", "tf-apply", "run-pipeline"] },
  { name: "Data Engineer", icon: "🔧", desc: "ETL, dbt, Spark, warehouse, and pipelines.", color: "#1078a3",
    skills: [
      { id: "data-validation", name: "Data Validation" }, { id: "data-warehousing", name: "Data Warehousing" },
      { id: "etl-debugging", name: "ETL Debugging" }, { id: "performance-tuning", name: "Performance Tuning" },
      { id: "pipeline-design", name: "Pipeline Design" }, { id: "schema-migration", name: "Schema Migration" },
      { id: "sql-optimization", name: "SQL Optimization" }, { id: "streaming-data", name: "Streaming Data" },
    ], cmds: ["run-pipeline", "optimize-sql", "migrate-schema"] },
  { name: "Founder / CEO", icon: "🚀", desc: "Fundraising, strategy, hiring, and growth.", color: "#f5b800",
    skills: [
      { id: "financial-planning", name: "Financial Planning" }, { id: "fundraising-strategy", name: "Fundraising Strategy" },
      { id: "go-to-market", name: "Go-to-Market Strategy" }, { id: "hiring-strategy", name: "Hiring Strategy" },
      { id: "investor-relations", name: "Investor Relations" }, { id: "market-analysis", name: "Market Analysis" },
      { id: "product-strategy", name: "Product Strategy" }, { id: "team-building", name: "Team Building" },
    ], cmds: ["plan-fundraising", "analyze-market", "build-strategy"] },
  { name: "Content Marketing", icon: "📝", desc: "SEO, copywriting, social media, analytics.", color: "#b62ad9",
    skills: [
      { id: "analytics-sync", name: "Analytics Sync" }, { id: "audience-segmentation", name: "Audience Segmentation" },
      { id: "competitor-analysis", name: "Competitor Analysis" }, { id: "content-calendar", name: "Content Calendar" },
      { id: "copy-quality", name: "Copy Quality" }, { id: "email-campaign", name: "Email Campaign" },
      { id: "seo-optimization", name: "SEO Optimization" }, { id: "social-media", name: "Social Media" },
    ], cmds: ["plan-content", "optimize-seo", "run-campaign"] },
  { name: "Finance / CFO", icon: "💰", desc: "Financial modeling, reporting, compliance.", color: "#f1a82c",
    skills: [
      { id: "balance-sheet-analyst", name: "Balance Sheet Analyst" }, { id: "budget-analyzer", name: "Budget Analyzer" },
      { id: "cash-flow-forecaster", name: "Cash Flow Forecaster" }, { id: "cost-optimizer", name: "Cost Optimizer" },
      { id: "financial-modeler", name: "Financial Modeler" }, { id: "headcount-planner", name: "Headcount Planner" },
      { id: "investor-deck-builder", name: "Investor Deck Builder" }, { id: "variance-reporter", name: "Variance Reporter" },
    ], cmds: ["build-model", "forecast-cash", "report-variance"] },
  { name: "Security Engineer", icon: "🔒", desc: "Threat modeling, pentesting, incident response.", color: "#da3633",
    skills: [
      { id: "audit-report-writer", name: "Audit Report Writer" }, { id: "compliance-checker", name: "Compliance Checker" },
      { id: "cve-analyzer", name: "CVE Analyzer" }, { id: "incident-classifier", name: "Incident Classifier" },
      { id: "penetration-planner", name: "Penetration Planner" }, { id: "secure-coding-validator", name: "Secure Coding Validator" },
      { id: "security-reviewer", name: "Security Reviewer" }, { id: "threat-modeler", name: "Threat Modeler" },
    ], cmds: ["security-review", "threat-model", "triage-cves"] },
  { name: "Product Manager", icon: "📋", desc: "Roadmap planning, user research, PRDs.", color: "#a371f7",
    skills: [
      { id: "competitive-mapper", name: "Competitive Mapper" }, { id: "feature-spec-writer", name: "Feature Spec Writer" },
      { id: "prd-outliner", name: "PRD Outliner" }, { id: "requirements-analyzer", name: "Requirements Analyzer" },
      { id: "roadmap-prioritizer", name: "Roadmap Prioritizer" }, { id: "stakeholder-summarizer", name: "Stakeholder Summarizer" },
      { id: "success-metrics-definer", name: "Success Metrics Definer" }, { id: "user-story-generator", name: "User Story Generator" },
    ], cmds: ["analyze-competitors", "prioritize-roadmap", "write-prd"] },
  { name: "GTM Engineer", icon: "🎯", desc: "CRM automation, pipeline ops, revenue intel.", color: "#f78166",
    skills: [
      { id: "account-researcher", name: "Account Researcher" }, { id: "battlecard", name: "Battlecard" },
      { id: "cold-email", name: "Cold Email" }, { id: "icp", name: "ICP Qualification" },
      { id: "linkedin-content", name: "LinkedIn Content" }, { id: "meeting-prep", name: "Meeting Prep" },
      { id: "output-reviewer", name: "Output Reviewer" }, { id: "post-call", name: "Post-Call" },
    ], cmds: ["research-account", "prep-meeting", "write-cold"] },
  { name: "SRE", icon: "🛡️", desc: "SLOs, incident response, chaos engineering.", color: "#58a6ff",
    skills: [
      { id: "capacity-planner", name: "Capacity Planner" }, { id: "chaos-engineer", name: "Chaos Engineer" },
      { id: "error-budget-manager", name: "Error Budget Manager" }, { id: "incident-triage", name: "Incident Triage" },
      { id: "on-call-designer", name: "On-Call Designer" }, { id: "post-mortem-writer", name: "Post-Mortem Writer" },
      { id: "runbook-executor", name: "Runbook Executor" }, { id: "slo-monitor", name: "SLO Monitor" },
    ], cmds: ["runbook-execute", "slo-status", "incident-check"] },
  { name: "ML/AI Engineer", icon: "🧠", desc: "Model training, MLOps, feature stores.", color: "#d2a8ff",
    skills: [
      { id: "ablation-study-planner", name: "Ablation Study Planner" }, { id: "bias-auditor", name: "Bias Auditor" },
      { id: "dataset-analyzer", name: "Dataset Analyzer" }, { id: "evaluation-framework-builder", name: "Evaluation Framework Builder" },
      { id: "experiment-designer", name: "Experiment Designer" }, { id: "hyperparameter-tuner", name: "Hyperparameter Tuner" },
      { id: "model-card-writer", name: "Model Card Writer" }, { id: "paper-summarizer", name: "Paper Summarizer" },
    ], cmds: ["run-experiment", "tune-hyper", "write-model-card"] },
  { name: "Community Manager", icon: "👥", desc: "Engagement, moderation, growth.", color: "#3fb950",
    skills: [
      { id: "community-health", name: "Community Health" }, { id: "content-planner", name: "Content Planner" },
      { id: "engagement-strategy", name: "Engagement Strategy" }, { id: "event-coordinator", name: "Event Coordinator" },
      { id: "feedback-synthesizer", name: "Feedback Synthesizer" }, { id: "moderation-policy", name: "Moderation Policy" },
      { id: "onboarding-flow", name: "Onboarding Flow" }, { id: "advocacy-program", name: "Advocacy Program" },
      { id: "analytics-reporter", name: "Analytics Reporter" }, { id: "crisis-responder", name: "Crisis Responder" },
      { id: "gamification-designer", name: "Gamification Designer" }, { id: "influencer-outreach", name: "Influencer Outreach" },
      { id: "newsletter-curator", name: "Newsletter Curator" }, { id: "sentiment-analyzer", name: "Sentiment Analyzer" },
    ], cmds: ["report-health", "plan-event", "moderate-content", "launch-campaign", "analyze-sentiment", "build-onboarding"] },
  { name: "Sales Operations", icon: "💼", desc: "Pipeline, forecasting, territory planning.", color: "#f1a82c",
    skills: [
      { id: "pipeline-analyzer", name: "Pipeline Analyzer" }, { id: "deal-velocity-analyzer", name: "Deal Velocity Analyzer" },
      { id: "compliance-auditor", name: "Compliance Auditor" }, { id: "compensation-modeler", name: "Compensation Modeler" },
      { id: "win-loss-analyzer", name: "Win/Loss Analyzer" }, { id: "territory-planner", name: "Territory Planner" },
      { id: "territory-optimizer", name: "Territory Optimizer" }, { id: "quota-tracker", name: "Quota Tracker" },
      { id: "deal-analyzer", name: "Deal Analyzer" }, { id: "sales-enablement-creator", name: "Sales Enablement Creator" },
      { id: "forecast-builder", name: "Forecast Builder" }, { id: "ramp-tracker", name: "Ramp Tracker" },
      { id: "sales-metrics-reporter", name: "Sales Metrics Reporter" }, { id: "deal-stage-scorer", name: "Deal Stage Scorer" },
    ], cmds: ["optimize-territory", "build-forecast", "analyze-pipeline"] },
  { name: "QA Testing Engineer", icon: "🧪", desc: "Test planning, automation, coverage.", color: "#79c0ff",
    skills: [
      { id: "test-planner", name: "Test Planner" }, { id: "bug-triage-classifier", name: "Bug Triage Classifier" },
      { id: "regression-risk-assessor", name: "Regression Risk Assessor" }, { id: "test-case-generator", name: "Test Case Generator" },
      { id: "test-suite-optimizer", name: "Test Suite Optimizer" }, { id: "automated-test-writer", name: "Automated Test Writer" },
      { id: "coverage-analyzer", name: "Coverage Analyzer" }, { id: "test-executor", name: "Test Executor" },
    ], cmds: ["run-tests", "generate-tests", "plan-tests"] },
  { name: "Newsletter Writer", icon: "📬", desc: "Research, writing, growth, monetization.", color: "#d2a8ff",
    skills: [
      { id: "topic-researcher", name: "Topic Researcher" }, { id: "headline-writer", name: "Headline Writer" },
      { id: "content-drafter", name: "Content Drafter" }, { id: "editor-polisher", name: "Editor Polisher" },
      { id: "growth-strategist", name: "Growth Strategist" }, { id: "sponsor-manager", name: "Sponsor Manager" },
      { id: "analytics-interpreter", name: "Analytics Interpreter" }, { id: "archive-optimizer", name: "Archive Optimizer" },
    ], cmds: ["draft-newsletter", "research-topic", "analyze-growth"] },
  { name: "YouTube Creator", icon: "🎬", desc: "Content planning, SEO, analytics.", color: "#FF0000",
    skills: [
      { id: "thumbnail-ideator", name: "Thumbnail Ideator" }, { id: "topic-analyzer", name: "Topic Analyzer" },
      { id: "analytics-tracker", name: "Analytics Tracker" }, { id: "competitor-analyzer", name: "Competitor Analyzer" },
      { id: "script-optimizer", name: "Script Optimizer" }, { id: "trend-scout", name: "Trend Scout" },
      { id: "metadata-writer", name: "Metadata Writer" }, { id: "seo-validator", name: "SEO Validator" },
    ], cmds: ["script-draft", "content-batch", "analyze-topic"] },
  { name: "Technical Writer", icon: "✍️", desc: "Docs, API references, style guides.", color: "#8b949e",
    skills: [
      { id: "documentation-outliner", name: "Documentation Outliner" }, { id: "content-structure-auditor", name: "Content Structure Auditor" },
      { id: "localization-prep", name: "Localization Prep" }, { id: "style-guide-enforcer", name: "Style Guide Enforcer" },
      { id: "audience-mapper", name: "Audience Mapper" }, { id: "seo-optimizer", name: "SEO Optimizer" },
    ], cmds: ["audit-clarity", "define-audience", "outline-docs"] },
  { name: "B2B Consultant", icon: "🤝", desc: "Client advisory, proposals, delivery.", color: "#1078a3",
    skills: [
      { id: "proposal-writer", name: "Proposal Writer" }, { id: "client-interview-prep", name: "Client Interview Prep" },
      { id: "deliverable-outliner", name: "Deliverable Outliner" }, { id: "sow-generator", name: "SOW Generator" },
      { id: "case-study-builder", name: "Case Study Builder" }, { id: "engagement-manager", name: "Engagement Manager" },
    ], cmds: ["write-proposal", "prep-interview", "build-case-study"] },
  { name: "Investor / VC", icon: "📈", desc: "Deal sourcing, due diligence, portfolio.", color: "#f5b800",
    skills: [
      { id: "deal-flow-screener", name: "Deal Flow Screener" }, { id: "due-diligence-checklist", name: "Due Diligence Checklist" },
      { id: "market-sizer", name: "Market Sizer" }, { id: "founder-assessor", name: "Founder Assessor" },
      { id: "portfolio-tracker", name: "Portfolio Tracker" }, { id: "term-sheet-analyzer", name: "Term Sheet Analyzer" },
      { id: "thesis-builder", name: "Thesis Builder" }, { id: "memo-writer", name: "Memo Writer" },
    ], cmds: ["screen-deal", "run-diligence", "track-portfolio"] },
  { name: "Legal Operations", icon: "⚖️", desc: "Contract management, compliance, risk.", color: "#da3633",
    skills: [
      { id: "contract-reviewer", name: "Contract Reviewer" }, { id: "clause-drafter", name: "Clause Drafter" },
      { id: "risk-assessor", name: "Risk Assessor" }, { id: "compliance-tracker", name: "Compliance Tracker" },
      { id: "legal-research", name: "Legal Research" }, { id: "nda-generator", name: "NDA Generator" },
    ], cmds: ["review-contract", "draft-clause", "track-compliance"] },
  { name: "Agentic AI Engineer", icon: "🤖", desc: "Agent design, orchestration, observability.", color: "#b62ad9",
    skills: [
      { id: "agent-designer", name: "Agent Designer" }, { id: "error-recovery-planner", name: "Error Recovery Planner" },
      { id: "observability-framework", name: "Observability Framework" }, { id: "orchestrator-builder", name: "Orchestrator Builder" },
      { id: "prompt-framework", name: "Prompt Framework" },
    ], cmds: ["design-agent", "design-prompt-framework", "build-orchestrator"] },
  { name: "AI Compliance & Risk", icon: "🛑", desc: "Regulatory mapping, model auditing.", color: "#da3633",
    skills: [
      { id: "compliance-framework-designer", name: "Compliance Framework Designer" }, { id: "risk-assessment-conductor", name: "Risk Assessment Conductor" },
      { id: "model-auditor", name: "Model Auditor" }, { id: "data-governance-validator", name: "Data Governance Validator" },
      { id: "regulatory-mapping-tool", name: "Regulatory Mapping Tool" },
    ], cmds: ["design-compliance-framework", "conduct-risk-assessment", "audit-model"] },
  { name: "AI Ethics & Governance", icon: "🔬", desc: "Bias assessment, ethical frameworks.", color: "#a371f7",
    skills: [
      { id: "ethical-framework-designer", name: "Ethical Framework Designer" }, { id: "bias-assessor", name: "Bias Assessor" },
      { id: "governance-auditor", name: "Governance Auditor" }, { id: "compliance-tracker", name: "Compliance Tracker" },
      { id: "risk-framework-builder", name: "Risk Framework Builder" },
    ], cmds: ["build-risk-framework", "audit-governance", "track-compliance"] },
  { name: "AI Product Manager", icon: "🧩", desc: "AI-specific product strategy and research.", color: "#d2a8ff",
    skills: [
      { id: "feature-prioritization", name: "Feature Prioritization" }, { id: "market-research", name: "Market Research" },
      { id: "competitive-analysis", name: "Competitive Analysis" }, { id: "roadmap-planning", name: "Roadmap Planning" },
      { id: "user-research-synthesis", name: "User Research Synthesis" },
    ], cmds: [] },
  { name: "Analytics Engineer", icon: "📊", desc: "dbt, metrics, data quality, pipelines.", color: "#3fb950",
    skills: [
      { id: "dbt-model-builder", name: "dbt Model Builder" }, { id: "metric-definer", name: "Metric Definer" },
      { id: "data-quality-checker", name: "Data Quality Checker" }, { id: "warehouse-optimizer", name: "Warehouse Optimizer" },
      { id: "dashboard-designer", name: "Dashboard Designer" }, { id: "attribution-modeler", name: "Attribution Modeler" },
      { id: "cohort-analyzer", name: "Cohort Analyzer" }, { id: "experiment-analyzer", name: "Experiment Analyzer" },
    ], cmds: ["build-model", "define-metrics", "check-quality"] },
  { name: "Brand Manager", icon: "🎨", desc: "Brand strategy, messaging, guidelines.", color: "#f78166",
    skills: [
      { id: "brand-strategy", name: "Brand Strategy" }, { id: "messaging-framework", name: "Messaging Framework" },
      { id: "visual-guidelines", name: "Visual Guidelines" }, { id: "tone-voice", name: "Tone & Voice" },
      { id: "competitor-positioning", name: "Competitor Positioning" }, { id: "brand-audit", name: "Brand Audit" },
      { id: "campaign-brief", name: "Campaign Brief" }, { id: "narrative-builder", name: "Narrative Builder" },
    ], cmds: ["audit-brand", "build-strategy", "define-positioning"] },
  { name: "Cloud Architect", icon: "☁️", desc: "Multi-cloud design, migration, cost.", color: "#58a6ff",
    skills: [
      { id: "architecture-designer", name: "Architecture Designer" }, { id: "cost-optimizer", name: "Cost Optimizer" },
      { id: "migration-planner", name: "Migration Planner" }, { id: "disaster-recovery", name: "Disaster Recovery" },
      { id: "network-designer", name: "Network Designer" },
    ], cmds: ["design-architecture", "plan-migration", "optimize-cost"] },
  { name: "Customer Success", icon: "🤗", desc: "Onboarding, retention, expansion.", color: "#3fb950",
    skills: [
      { id: "onboarding-designer", name: "Onboarding Designer" }, { id: "health-scorer", name: "Health Scorer" },
      { id: "qbr-builder", name: "QBR Builder" }, { id: "churn-predictor", name: "Churn Predictor" },
      { id: "expansion-planner", name: "Expansion Planner" }, { id: "nps-analyzer", name: "NPS Analyzer" },
      { id: "playbook-writer", name: "Playbook Writer" }, { id: "escalation-handler", name: "Escalation Handler" },
    ], cmds: ["score-health", "build-qbr", "plan-expansion"] },
  { name: "Database Admin", icon: "🗄️", desc: "DB ops, tuning, backup, migration.", color: "#79c0ff",
    skills: [
      { id: "query-optimizer", name: "Query Optimizer" }, { id: "backup-strategist", name: "Backup Strategist" },
      { id: "migration-planner", name: "Migration Planner" }, { id: "performance-tuner", name: "Performance Tuner" },
      { id: "replication-manager", name: "Replication Manager" }, { id: "schema-designer", name: "Schema Designer" },
      { id: "security-hardener", name: "Security Hardener" }, { id: "capacity-planner", name: "Capacity Planner" },
    ], cmds: [] },
  { name: "Distributed Systems", icon: "🌐", desc: "Consensus, CAP, fault tolerance.", color: "#58a6ff",
    skills: [
      { id: "system-designer", name: "System Designer" }, { id: "consensus-analyzer", name: "Consensus Analyzer" },
      { id: "fault-tolerance-reviewer", name: "Fault Tolerance Reviewer" }, { id: "scalability-planner", name: "Scalability Planner" },
      { id: "data-modeler", name: "Data Modeler" },
    ], cmds: ["design-system", "analyze-consensus", "plan-scaling"] },
  { name: "Ecommerce Operator", icon: "🛒", desc: "Store ops, product, fulfillment.", color: "#f1a82c",
    skills: [
      { id: "product-listing-optimizer", name: "Product Listing Optimizer" }, { id: "pricing-strategist", name: "Pricing Strategist" },
      { id: "inventory-forecaster", name: "Inventory Forecaster" }, { id: "conversion-analyzer", name: "Conversion Analyzer" },
      { id: "review-manager", name: "Review Manager" }, { id: "email-automator", name: "Email Automator" },
      { id: "fulfillment-optimizer", name: "Fulfillment Optimizer" }, { id: "return-handler", name: "Return Handler" },
    ], cmds: [] },
  { name: "Embedded / IoT", icon: "📟", desc: "Firmware, protocols, edge computing.", color: "#8b949e",
    skills: [
      { id: "firmware-reviewer", name: "Firmware Reviewer" }, { id: "protocol-designer", name: "Protocol Designer" },
      { id: "memory-optimizer", name: "Memory Optimizer" }, { id: "power-analyzer", name: "Power Analyzer" },
      { id: "ota-planner", name: "OTA Update Planner" }, { id: "security-hardener", name: "Security Hardener" },
      { id: "test-harness-builder", name: "Test Harness Builder" }, { id: "edge-compute-designer", name: "Edge Compute Designer" },
    ], cmds: [] },
  { name: "Frontend Engineer", icon: "🎨", desc: "React, performance, accessibility.", color: "#58a6ff",
    skills: [
      { id: "component-designer", name: "Component Designer" }, { id: "performance-auditor", name: "Performance Auditor" },
      { id: "accessibility-checker", name: "Accessibility Checker" }, { id: "responsive-designer", name: "Responsive Designer" },
      { id: "state-manager", name: "State Manager" }, { id: "test-writer", name: "Test Writer" },
      { id: "animation-designer", name: "Animation Designer" },
    ], cmds: [] },
  { name: "Game Developer", icon: "🎮", desc: "Game design, physics, AI, multiplayer.", color: "#b62ad9",
    skills: [
      { id: "game-design-doc", name: "Game Design Doc" }, { id: "physics-system", name: "Physics System" },
      { id: "ai-behavior", name: "AI Behavior" }, { id: "level-designer", name: "Level Designer" },
      { id: "multiplayer-architect", name: "Multiplayer Architect" }, { id: "performance-profiler", name: "Performance Profiler" },
      { id: "narrative-designer", name: "Narrative Designer" }, { id: "ux-polish", name: "UX Polish" },
    ], cmds: [] },
  { name: "Growth Engineer", icon: "📈", desc: "A/B testing, funnels, experimentation.", color: "#3fb950",
    skills: [
      { id: "experiment-designer", name: "Experiment Designer" }, { id: "funnel-analyzer", name: "Funnel Analyzer" },
      { id: "feature-flag-manager", name: "Feature Flag Manager" }, { id: "cohort-builder", name: "Cohort Builder" },
      { id: "retention-modeler", name: "Retention Modeler" }, { id: "onboarding-optimizer", name: "Onboarding Optimizer" },
      { id: "pricing-tester", name: "Pricing Tester" }, { id: "growth-metrics", name: "Growth Metrics" },
    ], cmds: [] },
  { name: "Healthcare", icon: "🏥", desc: "Clinical workflows, HIPAA, EHR.", color: "#f78166",
    skills: [
      { id: "clinical-workflow", name: "Clinical Workflow" }, { id: "hipaa-compliance", name: "HIPAA Compliance" },
      { id: "ehr-integration", name: "EHR Integration" }, { id: "patient-communication", name: "Patient Communication" },
      { id: "care-pathway", name: "Care Pathway" }, { id: "medical-coding", name: "Medical Coding" },
      { id: "telehealth-designer", name: "Telehealth Designer" }, { id: "quality-metrics", name: "Quality Metrics" },
    ], cmds: [] },
  { name: "HR / People Ops", icon: "👤", desc: "Hiring, culture, compensation.", color: "#d2a8ff",
    skills: [
      { id: "job-description-writer", name: "Job Description Writer" }, { id: "interview-designer", name: "Interview Designer" },
      { id: "compensation-benchmarker", name: "Compensation Benchmarker" }, { id: "onboarding-designer", name: "Onboarding Designer" },
      { id: "performance-review", name: "Performance Review" }, { id: "culture-builder", name: "Culture Builder" },
      { id: "engagement-survey", name: "Engagement Survey" }, { id: "policy-drafter", name: "Policy Drafter" },
    ], cmds: [] },
  { name: "Infrastructure as Code", icon: "🏛️", desc: "Terraform, Pulumi, Ansible, CloudFormation.", color: "#1d4aff",
    skills: [
      { id: "module-designer", name: "Module Designer" }, { id: "state-manager", name: "State Manager" },
      { id: "cost-estimator", name: "Cost Estimator" }, { id: "security-scanner", name: "Security Scanner" },
      { id: "drift-detector", name: "Drift Detector" },
    ], cmds: ["design-module", "scan-security", "detect-drift"] },
  { name: "Mobile Developer", icon: "📱", desc: "iOS, Android, React Native, Flutter.", color: "#58a6ff",
    skills: [
      { id: "ui-designer", name: "UI Designer" }, { id: "performance-profiler", name: "Performance Profiler" },
      { id: "offline-strategist", name: "Offline Strategist" }, { id: "push-notification-designer", name: "Push Notification Designer" },
      { id: "app-store-optimizer", name: "App Store Optimizer" }, { id: "crash-analyzer", name: "Crash Analyzer" },
      { id: "accessibility-auditor", name: "Accessibility Auditor" }, { id: "test-automator", name: "Test Automator" },
    ], cmds: [] },
  { name: "Operations Manager", icon: "⚙️", desc: "Process optimization, SOPs, reporting.", color: "#8b949e",
    skills: [
      { id: "sop-writer", name: "SOP Writer" }, { id: "process-mapper", name: "Process Mapper" },
      { id: "kpi-dashboard", name: "KPI Dashboard" }, { id: "vendor-manager", name: "Vendor Manager" },
      { id: "capacity-planner", name: "Capacity Planner" }, { id: "risk-assessor", name: "Risk Assessor" },
      { id: "budget-tracker", name: "Budget Tracker" }, { id: "automation-identifier", name: "Automation Identifier" },
    ], cmds: [] },
  { name: "Platform Engineer", icon: "🔩", desc: "Internal dev platforms, service mesh.", color: "#1d4aff",
    skills: [
      { id: "service-mesh-designer", name: "Service Mesh Designer" }, { id: "ci-cd-architect", name: "CI/CD Architect" },
      { id: "developer-portal-builder", name: "Developer Portal Builder" }, { id: "observability-engineer", name: "Observability Engineer" },
      { id: "cost-governance", name: "Cost Governance" },
    ], cmds: ["design-mesh", "build-portal", "setup-observability"] },
  { name: "Podcast Producer", icon: "🎙️", desc: "Recording, editing, distribution.", color: "#b62ad9",
    skills: [
      { id: "episode-planner", name: "Episode Planner" }, { id: "audio-editor", name: "Audio Editor" },
      { id: "show-notes-writer", name: "Show Notes Writer" }, { id: "guest-researcher", name: "Guest Researcher" },
      { id: "rss-feed-manager", name: "RSS Feed Manager" }, { id: "social-clip-writer", name: "Social Clip Writer" },
      { id: "sponsor-pitch-writer", name: "Sponsor Pitch Writer" }, { id: "transcript-generator", name: "Transcript Generator" },
    ], cmds: [] },
  { name: "Product Operations", icon: "🔄", desc: "Feedback loops, releases, tooling.", color: "#a371f7",
    skills: [
      { id: "customer-feedback-synthesizer", name: "Customer Feedback Synthesizer" }, { id: "metrics-analyzer", name: "Metrics Analyzer" },
      { id: "release-planning", name: "Release Planning" }, { id: "roadmap-prioritizer", name: "Roadmap Prioritizer" },
      { id: "launch-coordinator", name: "Launch Coordinator" }, { id: "stakeholder-mapper", name: "Stakeholder Mapper" },
      { id: "tooling-evaluator", name: "Tooling Evaluator" }, { id: "user-research-synthesizer", name: "User Research Synthesizer" },
    ], cmds: ["plan-release", "analyze-roadmap", "synthesize-feedback"] },
  { name: "Recruiter / TA", icon: "🎯", desc: "Sourcing, screening, employer brand.", color: "#f78166",
    skills: [
      { id: "sourcing-strategy", name: "Sourcing Strategy" }, { id: "candidate-screener", name: "Candidate Screener" },
      { id: "interview-scorecard", name: "Interview Scorecard" }, { id: "job-description-writer", name: "Job Description Writer" },
      { id: "employer-brand-writer", name: "Employer Brand Writer" }, { id: "diversity-pipeline", name: "Diversity Pipeline" },
      { id: "offer-letter-drafter", name: "Offer Letter Drafter" }, { id: "onboarding-checklist", name: "Onboarding Checklist" },
    ], cmds: [] },
  { name: "Solutions Architect", icon: "🏗️", desc: "System design, migrations, reviews.", color: "#1078a3",
    skills: [
      { id: "solution-architect", name: "Solution Architect" }, { id: "capacity-planning", name: "Capacity Planning" },
      { id: "api-contract-design", name: "API Contract Design" }, { id: "cost-modeling", name: "Cost Modeling" },
      { id: "requirements-discovery", name: "Requirements Discovery" }, { id: "technical-debt-assessment", name: "Technical Debt Assessment" },
      { id: "design-review", name: "Design Review" }, { id: "migration-planning", name: "Migration Planning" },
    ], cmds: ["design-system", "design-review", "discover-requirements"] },
  { name: "User Research", icon: "🔍", desc: "Interviews, usability, personas.", color: "#d2a8ff",
    skills: [
      { id: "research-planner", name: "Research Planner" }, { id: "usability-test-designer", name: "Usability Test Designer" },
      { id: "persona-builder", name: "Persona Builder" }, { id: "interview-guide-writer", name: "Interview Guide Writer" },
      { id: "journey-mapper", name: "Journey Mapper" }, { id: "research-ops-coordinator", name: "Research Ops Coordinator" },
      { id: "screener-designer", name: "Screener Designer" }, { id: "synthesis-facilitator", name: "Synthesis Facilitator" },
    ], cmds: [] },
  { name: "Bio Research", icon: "🧬", desc: "Genomics, protocols, analysis.", color: "#3fb950",
    skills: [
      { id: "protocol-designer", name: "Protocol Designer" }, { id: "sequence-analyzer", name: "Sequence Analyzer" },
      { id: "experiment-tracker", name: "Experiment Tracker" }, { id: "literature-reviewer", name: "Literature Reviewer" },
      { id: "data-pipeline", name: "Data Pipeline" }, { id: "statistical-analyzer", name: "Statistical Analyzer" },
      { id: "lab-notebook", name: "Lab Notebook" }, { id: "grant-writer", name: "Grant Writer" },
    ], cmds: [] },
  { name: "Blockchain / Web3", icon: "⛓️", desc: "Smart contracts, DeFi, auditing.", color: "#f5b800",
    skills: [
      { id: "smart-contract-auditor", name: "Smart Contract Auditor" }, { id: "token-designer", name: "Token Designer" },
      { id: "defi-strategist", name: "DeFi Strategist" }, { id: "gas-optimizer", name: "Gas Optimizer" },
      { id: "governance-designer", name: "Governance Designer" }, { id: "security-reviewer", name: "Security Reviewer" },
      { id: "nft-architect", name: "NFT Architect" }, { id: "bridge-analyzer", name: "Bridge Analyzer" },
    ], cmds: [] },
  { name: "API Developer", icon: "🔌", desc: "REST, GraphQL, API design, docs.", color: "#58a6ff",
    skills: [
      { id: "api-designer", name: "API Designer" }, { id: "openapi-spec-writer", name: "OpenAPI Spec Writer" },
      { id: "rate-limit-planner", name: "Rate Limit Planner" }, { id: "auth-designer", name: "Auth Designer" },
      { id: "versioning-strategist", name: "Versioning Strategist" }, { id: "performance-tester", name: "Performance Tester" },
      { id: "documentation-generator", name: "Documentation Generator" }, { id: "error-handler", name: "Error Handler" },
    ], cmds: [] },
];

/* ─── search + filter state ─── */
type SortKey = "name" | "skills";

export function StacksApp() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    let list = stacks.map((s, i) => ({ ...s, idx: i }));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.skills.some((sk) => sk.name.toLowerCase().includes(q)) ||
          s.desc.toLowerCase().includes(q)
      );
    }
    if (sort === "skills") list.sort((a, b) => b.skills.length - a.skills.length);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, sort]);

  const stack = filtered[active] ?? filtered[0];
  if (!stack) return <div className="p-6 text-mute text-sm">No stacks found.</div>;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* ── Sidebar ── */}
      <aside className="sm:w-60 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3 pb-2">
          <Eyebrow color="#3fb950">Workspace Stacks</Eyebrow>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder="Search stacks or skills…"
            className="mt-2 w-full rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[12px] text-ink placeholder:text-mute/60 focus:outline-none focus:ring-1 focus:ring-brand-blue/40"
          />
          <div className="mt-1.5 flex gap-1">
            <button onClick={() => setSort("name")} className={`flex-1 text-[10px] font-semibold rounded py-1 transition ${sort === "name" ? "bg-white border border-hairline text-ink" : "text-mute hover:text-body"}`}>A–Z</button>
            <button onClick={() => setSort("skills")} className={`flex-1 text-[10px] font-semibold rounded py-1 transition ${sort === "skills" ? "bg-white border border-hairline text-ink" : "text-mute hover:text-body"}`}>Most skills</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
          {filtered.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              className={`w-full text-left flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                i === active ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
              }`}
            >
              <span className="text-sm">{s.icon}</span>
              <span className="flex-1 truncate">{s.name}</span>
              <span className="text-[10px] text-mute font-medium">{s.skills.length}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-hairline text-[10px] text-mute">
          {stacks.length} stacks · {stacks.reduce((a, s) => a + s.skills.length, 0)} skills total
        </div>
      </aside>

      {/* ── Detail ── */}
      <div className="flex-1 min-w-0 overflow-auto p-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">{stack.icon}</span>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-ink">{stack.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Tag color={stack.color}>{stack.skills.length} skills</Tag>
              {stack.cmds.length > 0 && <Tag color="#8b949e">{stack.cmds.length} commands</Tag>}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-body max-w-lg leading-relaxed">{stack.desc}</p>

        {/* Skills */}
        <div className="mt-5">
          <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">Skills Included</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {stack.skills.map((sk) => (
              <div
                key={sk.id}
                className="flex items-center gap-2.5 rounded-lg border border-hairline bg-white px-3 py-2 text-[12.5px] font-medium text-ink hover:border-olive/60 transition"
              >
                <span className="grid place-items-center size-4.5 rounded-full text-white text-[10px] shrink-0" style={{ backgroundColor: stack.color }}>✓</span>
                <span className="truncate">{sk.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commands */}
        {stack.cmds.length > 0 && (
          <div className="mt-5">
            <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">Commands</div>
            <div className="space-y-1.5">
              {stack.cmds.map((c) => {
                const full = `npx claudient ${stack.name.toLowerCase().replace(/[\s/]/g, "_")} ${c}`;
                return (
                  <div key={c} className="flex items-center gap-2">
                    <pre className="flex-1 rounded-lg bg-[#1d1f27] text-[#e6e6e6] px-3 py-2 text-[11.5px] font-mono overflow-auto">
                      <code>{full}</code>
                    </pre>
                    <button
                      onClick={() => copy(full)}
                      className="shrink-0 rounded-md border border-olive/50 bg-white px-2 py-1.5 text-[10px] font-semibold text-body hover:bg-cream transition"
                    >
                      {copied === full ? "✓" : "Copy"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Install */}
        <div className="mt-5">
          <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">Install Full Stack</div>
          <div className="flex items-center gap-2">
            <pre className="flex-1 rounded-xl bg-[#1d1f27] text-[#e6e6e6] px-4 py-3 text-[12px] font-mono overflow-auto">
              <code>{`npx claudient stack ${stack.name.toLowerCase().replace(/[\s/]/g, "_")}_stack`}</code>
            </pre>
            <button
              onClick={() => copy(`npx claudient stack ${stack.name.toLowerCase().replace(/[\s/]/g, "_")}_stack`)}
              className="shrink-0 rounded-lg border border-olive/50 bg-white px-3 py-2.5 text-[12px] font-semibold text-ink hover:bg-cream transition"
            >
              {copied.includes("stack") ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
