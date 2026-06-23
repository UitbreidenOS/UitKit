import { useState } from "react";
import { Eyebrow, Tag } from "./ui";

interface AgentCat {
  name: string;
  icon: string;
  desc: string;
  agents: { name: string; role: string }[];
}

const agentCategories: AgentCat[] = [
  {
    "name": "Role Agents",
    "icon": "\ud83d\udc64",
    "desc": "Domain-specific engineering roles \u2014 from Zig engineers to chaos engineers.",
    "agents": [
      {
        "name": "TypeScript Performance Optimization Engineer",
        "role": "TypeScript / Performance Optimization"
      },
      {
        "name": "React Performance Optimization Architect",
        "role": "React / Performance Optimization"
      },
      {
        "name": "Vue Performance Optimization Specialist",
        "role": "Vue / Performance Optimization"
      },
      {
        "name": "Angular Performance Optimization Consultant",
        "role": "Angular / Performance Optimization"
      },
      {
        "name": "Qwik Performance Optimization Co-Pilot",
        "role": "Qwik / Performance Optimization"
      },
      {
        "name": "Astro Performance Optimization Developer",
        "role": "Astro / Performance Optimization"
      },
      {
        "name": "Node.js Performance Optimization Engineer",
        "role": "Node.js / Performance Optimization"
      },
      {
        "name": "Express Performance Optimization Architect",
        "role": "Express / Performance Optimization"
      },
      {
        "name": "FastAPI Performance Optimization Specialist",
        "role": "FastAPI / Performance Optimization"
      },
      {
        "name": "Django Performance Optimization Consultant",
        "role": "Django / Performance Optimization"
      },
      {
        "name": "Ruby on Rails Performance Optimization Co-Pilot",
        "role": "Ruby on Rails / Performance Optimization"
      },
      {
        "name": "Phoenix Performance Optimization Developer",
        "role": "Phoenix / Performance Optimization"
      },
      {
        "name": "Go Performance Optimization Engineer",
        "role": "Go / Performance Optimization"
      },
      {
        "name": "Rust Performance Optimization Architect",
        "role": "Rust / Performance Optimization"
      },
      {
        "name": "Python Performance Optimization Specialist",
        "role": "Python / Performance Optimization"
      },
      {
        "name": "C++ Performance Optimization Consultant",
        "role": "C++ / Performance Optimization"
      },
      {
        "name": "Dart Flutter Performance Optimization Co-Pilot",
        "role": "Dart Flutter / Performance Optimization"
      },
      {
        "name": "React Native Performance Optimization Developer",
        "role": "React Native / Performance Optimization"
      },
      {
        "name": "PostgreSQL Performance Optimization Engineer",
        "role": "PostgreSQL / Performance Optimization"
      },
      {
        "name": "MongoDB Performance Optimization Architect",
        "role": "MongoDB / Performance Optimization"
      },
      {
        "name": "MySQL Performance Optimization Specialist",
        "role": "MySQL / Performance Optimization"
      },
      {
        "name": "Redis Performance Optimization Consultant",
        "role": "Redis / Performance Optimization"
      },
      {
        "name": "ChromaDB Performance Optimization Co-Pilot",
        "role": "ChromaDB / Performance Optimization"
      },
      {
        "name": "Neo4j Performance Optimization Developer",
        "role": "Neo4j / Performance Optimization"
      },
      {
        "name": "Docker Performance Optimization Engineer",
        "role": "Docker / Performance Optimization"
      },
      {
        "name": "Kubernetes Performance Optimization Architect",
        "role": "Kubernetes / Performance Optimization"
      },
      {
        "name": "Terraform Performance Optimization Specialist",
        "role": "Terraform / Performance Optimization"
      },
      {
        "name": "Ansible Performance Optimization Consultant",
        "role": "Ansible / Performance Optimization"
      },
      {
        "name": "AWS Performance Optimization Co-Pilot",
        "role": "AWS / Performance Optimization"
      },
      {
        "name": "GCP Performance Optimization Developer",
        "role": "GCP / Performance Optimization"
      },
      {
        "name": "Azure Performance Optimization Engineer",
        "role": "Azure / Performance Optimization"
      },
      {
        "name": "Cloudflare Workers Performance Optimization Architect",
        "role": "Cloudflare Workers / Performance Optimization"
      },
      {
        "name": "Vercel Edge Performance Optimization Specialist",
        "role": "Vercel Edge / Performance Optimization"
      },
      {
        "name": "Netlify Performance Optimization Consultant",
        "role": "Netlify / Performance Optimization"
      },
      {
        "name": "OpenTelemetry Performance Optimization Co-Pilot",
        "role": "OpenTelemetry / Performance Optimization"
      },
      {
        "name": "Logstash Performance Optimization Developer",
        "role": "Logstash / Performance Optimization"
      },
      {
        "name": "Pandas Performance Optimization Engineer",
        "role": "Pandas / Performance Optimization"
      },
      {
        "name": "NumPy Performance Optimization Architect",
        "role": "NumPy / Performance Optimization"
      },
      {
        "name": "Apache Spark Performance Optimization Specialist",
        "role": "Apache Spark / Performance Optimization"
      },
      {
        "name": "PyTorch Performance Optimization Consultant",
        "role": "PyTorch / Performance Optimization"
      },
      {
        "name": "LlamaIndex Performance Optimization Co-Pilot",
        "role": "LlamaIndex / Performance Optimization"
      },
      {
        "name": "LangGraph Performance Optimization Developer",
        "role": "LangGraph / Performance Optimization"
      },
      {
        "name": "Playwright Performance Optimization Engineer",
        "role": "Playwright / Performance Optimization"
      },
      {
        "name": "Cypress Performance Optimization Architect",
        "role": "Cypress / Performance Optimization"
      },
      {
        "name": "Jest Performance Optimization Specialist",
        "role": "Jest / Performance Optimization"
      },
      {
        "name": "Vitest Performance Optimization Consultant",
        "role": "Vitest / Performance Optimization"
      },
      {
        "name": "Snyk Performance Optimization Co-Pilot",
        "role": "Snyk / Performance Optimization"
      },
      {
        "name": "TruffleHog Performance Optimization Developer",
        "role": "TruffleHog / Performance Optimization"
      },
      {
        "name": "TypeScript Context Engineering Engineer",
        "role": "TypeScript / Context Engineering"
      },
      {
        "name": "React Context Engineering Architect",
        "role": "React / Context Engineering"
      },
      {
        "name": "Vue Context Engineering Specialist",
        "role": "Vue / Context Engineering"
      },
      {
        "name": "Angular Context Engineering Consultant",
        "role": "Angular / Context Engineering"
      },
      {
        "name": "Qwik Context Engineering Co-Pilot",
        "role": "Qwik / Context Engineering"
      },
      {
        "name": "Astro Context Engineering Developer",
        "role": "Astro / Context Engineering"
      },
      {
        "name": "Node.js Context Engineering Engineer",
        "role": "Node.js / Context Engineering"
      },
      {
        "name": "Express Context Engineering Architect",
        "role": "Express / Context Engineering"
      },
      {
        "name": "FastAPI Context Engineering Specialist",
        "role": "FastAPI / Context Engineering"
      },
      {
        "name": "Django Context Engineering Consultant",
        "role": "Django / Context Engineering"
      },
      {
        "name": "Ruby on Rails Context Engineering Co-Pilot",
        "role": "Ruby on Rails / Context Engineering"
      },
      {
        "name": "Phoenix Context Engineering Developer",
        "role": "Phoenix / Context Engineering"
      },
      {
        "name": "Go Context Engineering Engineer",
        "role": "Go / Context Engineering"
      },
      {
        "name": "Rust Context Engineering Architect",
        "role": "Rust / Context Engineering"
      },
      {
        "name": "Python Context Engineering Specialist",
        "role": "Python / Context Engineering"
      },
      {
        "name": "C++ Context Engineering Consultant",
        "role": "C++ / Context Engineering"
      },
      {
        "name": "Dart Flutter Context Engineering Co-Pilot",
        "role": "Dart Flutter / Context Engineering"
      },
      {
        "name": "React Native Context Engineering Developer",
        "role": "React Native / Context Engineering"
      },
      {
        "name": "PostgreSQL Context Engineering Engineer",
        "role": "PostgreSQL / Context Engineering"
      },
      {
        "name": "MongoDB Context Engineering Architect",
        "role": "MongoDB / Context Engineering"
      },
      {
        "name": "MySQL Context Engineering Specialist",
        "role": "MySQL / Context Engineering"
      },
      {
        "name": "Redis Context Engineering Consultant",
        "role": "Redis / Context Engineering"
      },
      {
        "name": "ChromaDB Context Engineering Co-Pilot",
        "role": "ChromaDB / Context Engineering"
      },
      {
        "name": "Neo4j Context Engineering Developer",
        "role": "Neo4j / Context Engineering"
      },
      {
        "name": "Docker Context Engineering Engineer",
        "role": "Docker / Context Engineering"
      },
      {
        "name": "Kubernetes Context Engineering Architect",
        "role": "Kubernetes / Context Engineering"
      },
      {
        "name": "Terraform Context Engineering Specialist",
        "role": "Terraform / Context Engineering"
      },
      {
        "name": "Ansible Context Engineering Consultant",
        "role": "Ansible / Context Engineering"
      },
      {
        "name": "AWS Context Engineering Co-Pilot",
        "role": "AWS / Context Engineering"
      },
      {
        "name": "GCP Context Engineering Developer",
        "role": "GCP / Context Engineering"
      },
      {
        "name": "Azure Context Engineering Engineer",
        "role": "Azure / Context Engineering"
      },
      {
        "name": "Cloudflare Workers Context Engineering Architect",
        "role": "Cloudflare Workers / Context Engineering"
      },
      {
        "name": "Vercel Edge Context Engineering Specialist",
        "role": "Vercel Edge / Context Engineering"
      },
      {
        "name": "Netlify Context Engineering Consultant",
        "role": "Netlify / Context Engineering"
      },
      {
        "name": "OpenTelemetry Context Engineering Co-Pilot",
        "role": "OpenTelemetry / Context Engineering"
      },
      {
        "name": "Logstash Context Engineering Developer",
        "role": "Logstash / Context Engineering"
      },
      {
        "name": "Pandas Context Engineering Engineer",
        "role": "Pandas / Context Engineering"
      },
      {
        "name": "NumPy Context Engineering Architect",
        "role": "NumPy / Context Engineering"
      },
      {
        "name": "Apache Spark Context Engineering Specialist",
        "role": "Apache Spark / Context Engineering"
      },
      {
        "name": "PyTorch Context Engineering Consultant",
        "role": "PyTorch / Context Engineering"
      },
      {
        "name": "LlamaIndex Context Engineering Co-Pilot",
        "role": "LlamaIndex / Context Engineering"
      },
      {
        "name": "LangGraph Context Engineering Developer",
        "role": "LangGraph / Context Engineering"
      },
      {
        "name": "Playwright Context Engineering Engineer",
        "role": "Playwright / Context Engineering"
      },
      {
        "name": "Cypress Context Engineering Architect",
        "role": "Cypress / Context Engineering"
      },
      {
        "name": "Jest Context Engineering Specialist",
        "role": "Jest / Context Engineering"
      },
      {
        "name": "Vitest Context Engineering Consultant",
        "role": "Vitest / Context Engineering"
      },
      {
        "name": "Snyk Context Engineering Co-Pilot",
        "role": "Snyk / Context Engineering"
      },
      {
        "name": "TruffleHog Context Engineering Developer",
        "role": "TruffleHog / Context Engineering"
      },
      {
        "name": "TypeScript API Design Engineer",
        "role": "TypeScript / API Design"
      },
      {
        "name": "React API Design Architect",
        "role": "React / API Design"
      },
      {
        "name": "Vue API Design Specialist",
        "role": "Vue / API Design"
      },
      {
        "name": "Angular API Design Consultant",
        "role": "Angular / API Design"
      },
      {
        "name": "Qwik API Design Co-Pilot",
        "role": "Qwik / API Design"
      },
      {
        "name": "Astro API Design Developer",
        "role": "Astro / API Design"
      },
      {
        "name": "Node.js API Design Engineer",
        "role": "Node.js / API Design"
      },
      {
        "name": "Express API Design Architect",
        "role": "Express / API Design"
      },
      {
        "name": "FastAPI API Design Specialist",
        "role": "FastAPI / API Design"
      },
      {
        "name": "Django API Design Consultant",
        "role": "Django / API Design"
      },
      {
        "name": "Ruby on Rails API Design Co-Pilot",
        "role": "Ruby on Rails / API Design"
      },
      {
        "name": "Phoenix API Design Developer",
        "role": "Phoenix / API Design"
      },
      {
        "name": "Go API Design Engineer",
        "role": "Go / API Design"
      },
      {
        "name": "Rust API Design Architect",
        "role": "Rust / API Design"
      },
      {
        "name": "Python API Design Specialist",
        "role": "Python / API Design"
      },
      {
        "name": "C++ API Design Consultant",
        "role": "C++ / API Design"
      },
      {
        "name": "Dart Flutter API Design Co-Pilot",
        "role": "Dart Flutter / API Design"
      },
      {
        "name": "React Native API Design Developer",
        "role": "React Native / API Design"
      },
      {
        "name": "PostgreSQL API Design Engineer",
        "role": "PostgreSQL / API Design"
      },
      {
        "name": "MongoDB API Design Architect",
        "role": "MongoDB / API Design"
      },
      {
        "name": "MySQL API Design Specialist",
        "role": "MySQL / API Design"
      },
      {
        "name": "Redis API Design Consultant",
        "role": "Redis / API Design"
      },
      {
        "name": "ChromaDB API Design Co-Pilot",
        "role": "ChromaDB / API Design"
      },
      {
        "name": "Neo4j API Design Developer",
        "role": "Neo4j / API Design"
      },
      {
        "name": "Docker API Design Engineer",
        "role": "Docker / API Design"
      },
      {
        "name": "Kubernetes API Design Architect",
        "role": "Kubernetes / API Design"
      },
      {
        "name": "Terraform API Design Specialist",
        "role": "Terraform / API Design"
      },
      {
        "name": "Ansible API Design Consultant",
        "role": "Ansible / API Design"
      },
      {
        "name": "AWS API Design Co-Pilot",
        "role": "AWS / API Design"
      },
      {
        "name": "GCP API Design Developer",
        "role": "GCP / API Design"
      },
      {
        "name": "Azure API Design Engineer",
        "role": "Azure / API Design"
      },
      {
        "name": "Cloudflare Workers API Design Architect",
        "role": "Cloudflare Workers / API Design"
      },
      {
        "name": "Vercel Edge API Design Specialist",
        "role": "Vercel Edge / API Design"
      },
      {
        "name": "Netlify API Design Consultant",
        "role": "Netlify / API Design"
      },
      {
        "name": "OpenTelemetry API Design Co-Pilot",
        "role": "OpenTelemetry / API Design"
      },
      {
        "name": "Logstash API Design Developer",
        "role": "Logstash / API Design"
      },
      {
        "name": "Pandas API Design Engineer",
        "role": "Pandas / API Design"
      },
      {
        "name": "NumPy API Design Architect",
        "role": "NumPy / API Design"
      },
      {
        "name": "Apache Spark API Design Specialist",
        "role": "Apache Spark / API Design"
      },
      {
        "name": "PyTorch API Design Consultant",
        "role": "PyTorch / API Design"
      },
      {
        "name": "LlamaIndex API Design Co-Pilot",
        "role": "LlamaIndex / API Design"
      },
      {
        "name": "LangGraph API Design Developer",
        "role": "LangGraph / API Design"
      },
      {
        "name": "Playwright API Design Engineer",
        "role": "Playwright / API Design"
      },
      {
        "name": "Cypress API Design Architect",
        "role": "Cypress / API Design"
      },
      {
        "name": "Jest API Design Specialist",
        "role": "Jest / API Design"
      },
      {
        "name": "Vitest API Design Consultant",
        "role": "Vitest / API Design"
      },
      {
        "name": "Snyk API Design Co-Pilot",
        "role": "Snyk / API Design"
      },
      {
        "name": "TruffleHog API Design Developer",
        "role": "TruffleHog / API Design"
      },
      {
        "name": "TypeScript Database Sharding Engineer",
        "role": "TypeScript / Database Sharding"
      },
      {
        "name": "React Database Sharding Architect",
        "role": "React / Database Sharding"
      },
      {
        "name": "Vue Database Sharding Specialist",
        "role": "Vue / Database Sharding"
      },
      {
        "name": "Angular Database Sharding Consultant",
        "role": "Angular / Database Sharding"
      },
      {
        "name": "Qwik Database Sharding Co-Pilot",
        "role": "Qwik / Database Sharding"
      },
      {
        "name": "Astro Database Sharding Developer",
        "role": "Astro / Database Sharding"
      },
      {
        "name": "Node.js Database Sharding Engineer",
        "role": "Node.js / Database Sharding"
      },
      {
        "name": "Express Database Sharding Architect",
        "role": "Express / Database Sharding"
      },
      {
        "name": "FastAPI Database Sharding Specialist",
        "role": "FastAPI / Database Sharding"
      },
      {
        "name": "Django Database Sharding Consultant",
        "role": "Django / Database Sharding"
      },
      {
        "name": "Ruby on Rails Database Sharding Co-Pilot",
        "role": "Ruby on Rails / Database Sharding"
      },
      {
        "name": "Phoenix Database Sharding Developer",
        "role": "Phoenix / Database Sharding"
      },
      {
        "name": "Go Database Sharding Engineer",
        "role": "Go / Database Sharding"
      },
      {
        "name": "Rust Database Sharding Architect",
        "role": "Rust / Database Sharding"
      },
      {
        "name": "Python Database Sharding Specialist",
        "role": "Python / Database Sharding"
      },
      {
        "name": "C++ Database Sharding Consultant",
        "role": "C++ / Database Sharding"
      },
      {
        "name": "Dart Flutter Database Sharding Co-Pilot",
        "role": "Dart Flutter / Database Sharding"
      },
      {
        "name": "React Native Database Sharding Developer",
        "role": "React Native / Database Sharding"
      },
      {
        "name": "PostgreSQL Database Sharding Engineer",
        "role": "PostgreSQL / Database Sharding"
      },
      {
        "name": "MongoDB Database Sharding Architect",
        "role": "MongoDB / Database Sharding"
      },
      {
        "name": "MySQL Database Sharding Specialist",
        "role": "MySQL / Database Sharding"
      },
      {
        "name": "Redis Database Sharding Consultant",
        "role": "Redis / Database Sharding"
      },
      {
        "name": "ChromaDB Database Sharding Co-Pilot",
        "role": "ChromaDB / Database Sharding"
      },
      {
        "name": "Neo4j Database Sharding Developer",
        "role": "Neo4j / Database Sharding"
      },
      {
        "name": "Docker Database Sharding Engineer",
        "role": "Docker / Database Sharding"
      },
      {
        "name": "Kubernetes Database Sharding Architect",
        "role": "Kubernetes / Database Sharding"
      },
      {
        "name": "Terraform Database Sharding Specialist",
        "role": "Terraform / Database Sharding"
      },
      {
        "name": "Ansible Database Sharding Consultant",
        "role": "Ansible / Database Sharding"
      },
      {
        "name": "AWS Database Sharding Co-Pilot",
        "role": "AWS / Database Sharding"
      },
      {
        "name": "GCP Database Sharding Developer",
        "role": "GCP / Database Sharding"
      },
      {
        "name": "Azure Database Sharding Engineer",
        "role": "Azure / Database Sharding"
      },
      {
        "name": "Cloudflare Workers Database Sharding Architect",
        "role": "Cloudflare Workers / Database Sharding"
      },
      {
        "name": "Vercel Edge Database Sharding Specialist",
        "role": "Vercel Edge / Database Sharding"
      },
      {
        "name": "Netlify Database Sharding Consultant",
        "role": "Netlify / Database Sharding"
      },
      {
        "name": "OpenTelemetry Database Sharding Co-Pilot",
        "role": "OpenTelemetry / Database Sharding"
      },
      {
        "name": "Logstash Database Sharding Developer",
        "role": "Logstash / Database Sharding"
      },
      {
        "name": "Pandas Database Sharding Engineer",
        "role": "Pandas / Database Sharding"
      },
      {
        "name": "NumPy Database Sharding Architect",
        "role": "NumPy / Database Sharding"
      },
      {
        "name": "Apache Spark Database Sharding Specialist",
        "role": "Apache Spark / Database Sharding"
      },
      {
        "name": "PyTorch Database Sharding Consultant",
        "role": "PyTorch / Database Sharding"
      },
      {
        "name": "LlamaIndex Database Sharding Co-Pilot",
        "role": "LlamaIndex / Database Sharding"
      },
      {
        "name": "LangGraph Database Sharding Developer",
        "role": "LangGraph / Database Sharding"
      },
      {
        "name": "Playwright Database Sharding Engineer",
        "role": "Playwright / Database Sharding"
      },
      {
        "name": "Cypress Database Sharding Architect",
        "role": "Cypress / Database Sharding"
      },
      {
        "name": "Jest Database Sharding Specialist",
        "role": "Jest / Database Sharding"
      },
      {
        "name": "Vitest Database Sharding Consultant",
        "role": "Vitest / Database Sharding"
      },
      {
        "name": "Snyk Database Sharding Co-Pilot",
        "role": "Snyk / Database Sharding"
      },
      {
        "name": "TruffleHog Database Sharding Developer",
        "role": "TruffleHog / Database Sharding"
      },
      {
        "name": "TypeScript Data Pipelines Engineer",
        "role": "TypeScript / Data Pipelines"
      },
      {
        "name": "React Data Pipelines Architect",
        "role": "React / Data Pipelines"
      },
      {
        "name": "Vue Data Pipelines Specialist",
        "role": "Vue / Data Pipelines"
      },
      {
        "name": "Angular Data Pipelines Consultant",
        "role": "Angular / Data Pipelines"
      },
      {
        "name": "Qwik Data Pipelines Co-Pilot",
        "role": "Qwik / Data Pipelines"
      },
      {
        "name": "Astro Data Pipelines Developer",
        "role": "Astro / Data Pipelines"
      },
      {
        "name": "Node.js Data Pipelines Engineer",
        "role": "Node.js / Data Pipelines"
      },
      {
        "name": "Express Data Pipelines Architect",
        "role": "Express / Data Pipelines"
      },
      {
        "name": "FastAPI Data Pipelines Specialist",
        "role": "FastAPI / Data Pipelines"
      },
      {
        "name": "Django Data Pipelines Consultant",
        "role": "Django / Data Pipelines"
      },
      {
        "name": "Ruby on Rails Data Pipelines Co-Pilot",
        "role": "Ruby on Rails / Data Pipelines"
      },
      {
        "name": "Phoenix Data Pipelines Developer",
        "role": "Phoenix / Data Pipelines"
      },
      {
        "name": "Go Data Pipelines Engineer",
        "role": "Go / Data Pipelines"
      },
      {
        "name": "Rust Data Pipelines Architect",
        "role": "Rust / Data Pipelines"
      },
      {
        "name": "Python Data Pipelines Specialist",
        "role": "Python / Data Pipelines"
      },
      {
        "name": "C++ Data Pipelines Consultant",
        "role": "C++ / Data Pipelines"
      },
      {
        "name": "Dart Flutter Data Pipelines Co-Pilot",
        "role": "Dart Flutter / Data Pipelines"
      },
      {
        "name": "React Native Data Pipelines Developer",
        "role": "React Native / Data Pipelines"
      }
    ]
  },
  {
    "name": "Advisory Agents",
    "icon": "\ud83c\udf93",
    "desc": "C-suite and executive advisory agents for strategic decisions.",
    "agents": [
      {
        "name": "Next.js Performance Optimization Strategist",
        "role": "Next.js / Performance Optimization"
      },
      {
        "name": "Nuxt.js Performance Optimization Manager",
        "role": "Nuxt.js / Performance Optimization"
      },
      {
        "name": "SolidJS Performance Optimization Advisor",
        "role": "SolidJS / Performance Optimization"
      },
      {
        "name": "Spring Boot Performance Optimization Strategist",
        "role": "Spring Boot / Performance Optimization"
      },
      {
        "name": "NestJS Performance Optimization Manager",
        "role": "NestJS / Performance Optimization"
      },
      {
        "name": "Laravel Performance Optimization Advisor",
        "role": "Laravel / Performance Optimization"
      },
      {
        "name": "Java Performance Optimization Strategist",
        "role": "Java / Performance Optimization"
      },
      {
        "name": "Kotlin Performance Optimization Manager",
        "role": "Kotlin / Performance Optimization"
      },
      {
        "name": "Swift Performance Optimization Advisor",
        "role": "Swift / Performance Optimization"
      },
      {
        "name": "DynamoDB Performance Optimization Strategist",
        "role": "DynamoDB / Performance Optimization"
      },
      {
        "name": "Elasticsearch Performance Optimization Manager",
        "role": "Elasticsearch / Performance Optimization"
      },
      {
        "name": "Pinecone Performance Optimization Advisor",
        "role": "Pinecone / Performance Optimization"
      },
      {
        "name": "GitHub Actions Performance Optimization Strategist",
        "role": "GitHub Actions / Performance Optimization"
      },
      {
        "name": "GitLab CI Performance Optimization Manager",
        "role": "GitLab CI / Performance Optimization"
      },
      {
        "name": "Jenkins Performance Optimization Advisor",
        "role": "Jenkins / Performance Optimization"
      },
      {
        "name": "Grafana Performance Optimization Strategist",
        "role": "Grafana / Performance Optimization"
      },
      {
        "name": "Datadog Performance Optimization Manager",
        "role": "Datadog / Performance Optimization"
      },
      {
        "name": "Sentry Performance Optimization Advisor",
        "role": "Sentry / Performance Optimization"
      },
      {
        "name": "Scikit-Learn Performance Optimization Strategist",
        "role": "Scikit-Learn / Performance Optimization"
      },
      {
        "name": "XGBoost Performance Optimization Manager",
        "role": "XGBoost / Performance Optimization"
      },
      {
        "name": "LangChain Performance Optimization Advisor",
        "role": "LangChain / Performance Optimization"
      },
      {
        "name": "ESLint Performance Optimization Strategist",
        "role": "ESLint / Performance Optimization"
      },
      {
        "name": "SonarQube Performance Optimization Manager",
        "role": "SonarQube / Performance Optimization"
      },
      {
        "name": "Prettier Performance Optimization Advisor",
        "role": "Prettier / Performance Optimization"
      },
      {
        "name": "Next.js Context Engineering Strategist",
        "role": "Next.js / Context Engineering"
      },
      {
        "name": "Nuxt.js Context Engineering Manager",
        "role": "Nuxt.js / Context Engineering"
      },
      {
        "name": "SolidJS Context Engineering Advisor",
        "role": "SolidJS / Context Engineering"
      },
      {
        "name": "Spring Boot Context Engineering Strategist",
        "role": "Spring Boot / Context Engineering"
      },
      {
        "name": "NestJS Context Engineering Manager",
        "role": "NestJS / Context Engineering"
      },
      {
        "name": "Laravel Context Engineering Advisor",
        "role": "Laravel / Context Engineering"
      },
      {
        "name": "Java Context Engineering Strategist",
        "role": "Java / Context Engineering"
      },
      {
        "name": "Kotlin Context Engineering Manager",
        "role": "Kotlin / Context Engineering"
      },
      {
        "name": "Swift Context Engineering Advisor",
        "role": "Swift / Context Engineering"
      },
      {
        "name": "DynamoDB Context Engineering Strategist",
        "role": "DynamoDB / Context Engineering"
      },
      {
        "name": "Elasticsearch Context Engineering Manager",
        "role": "Elasticsearch / Context Engineering"
      },
      {
        "name": "Pinecone Context Engineering Advisor",
        "role": "Pinecone / Context Engineering"
      },
      {
        "name": "GitHub Actions Context Engineering Strategist",
        "role": "GitHub Actions / Context Engineering"
      },
      {
        "name": "GitLab CI Context Engineering Manager",
        "role": "GitLab CI / Context Engineering"
      },
      {
        "name": "Jenkins Context Engineering Advisor",
        "role": "Jenkins / Context Engineering"
      },
      {
        "name": "Grafana Context Engineering Strategist",
        "role": "Grafana / Context Engineering"
      },
      {
        "name": "Datadog Context Engineering Manager",
        "role": "Datadog / Context Engineering"
      },
      {
        "name": "Sentry Context Engineering Advisor",
        "role": "Sentry / Context Engineering"
      },
      {
        "name": "Scikit-Learn Context Engineering Strategist",
        "role": "Scikit-Learn / Context Engineering"
      },
      {
        "name": "XGBoost Context Engineering Manager",
        "role": "XGBoost / Context Engineering"
      },
      {
        "name": "LangChain Context Engineering Advisor",
        "role": "LangChain / Context Engineering"
      },
      {
        "name": "ESLint Context Engineering Strategist",
        "role": "ESLint / Context Engineering"
      },
      {
        "name": "SonarQube Context Engineering Manager",
        "role": "SonarQube / Context Engineering"
      },
      {
        "name": "Prettier Context Engineering Advisor",
        "role": "Prettier / Context Engineering"
      },
      {
        "name": "Next.js API Design Strategist",
        "role": "Next.js / API Design"
      },
      {
        "name": "Nuxt.js API Design Manager",
        "role": "Nuxt.js / API Design"
      },
      {
        "name": "SolidJS API Design Advisor",
        "role": "SolidJS / API Design"
      },
      {
        "name": "Spring Boot API Design Strategist",
        "role": "Spring Boot / API Design"
      },
      {
        "name": "NestJS API Design Manager",
        "role": "NestJS / API Design"
      },
      {
        "name": "Laravel API Design Advisor",
        "role": "Laravel / API Design"
      },
      {
        "name": "Java API Design Strategist",
        "role": "Java / API Design"
      },
      {
        "name": "Kotlin API Design Manager",
        "role": "Kotlin / API Design"
      },
      {
        "name": "Swift API Design Advisor",
        "role": "Swift / API Design"
      },
      {
        "name": "DynamoDB API Design Strategist",
        "role": "DynamoDB / API Design"
      },
      {
        "name": "Elasticsearch API Design Manager",
        "role": "Elasticsearch / API Design"
      },
      {
        "name": "Pinecone API Design Advisor",
        "role": "Pinecone / API Design"
      },
      {
        "name": "GitHub Actions API Design Strategist",
        "role": "GitHub Actions / API Design"
      },
      {
        "name": "GitLab CI API Design Manager",
        "role": "GitLab CI / API Design"
      },
      {
        "name": "Jenkins API Design Advisor",
        "role": "Jenkins / API Design"
      },
      {
        "name": "Grafana API Design Strategist",
        "role": "Grafana / API Design"
      },
      {
        "name": "Datadog API Design Manager",
        "role": "Datadog / API Design"
      },
      {
        "name": "Sentry API Design Advisor",
        "role": "Sentry / API Design"
      },
      {
        "name": "Scikit-Learn API Design Strategist",
        "role": "Scikit-Learn / API Design"
      },
      {
        "name": "XGBoost API Design Manager",
        "role": "XGBoost / API Design"
      },
      {
        "name": "LangChain API Design Advisor",
        "role": "LangChain / API Design"
      },
      {
        "name": "ESLint API Design Strategist",
        "role": "ESLint / API Design"
      },
      {
        "name": "SonarQube API Design Manager",
        "role": "SonarQube / API Design"
      },
      {
        "name": "Prettier API Design Advisor",
        "role": "Prettier / API Design"
      },
      {
        "name": "Next.js Database Sharding Strategist",
        "role": "Next.js / Database Sharding"
      },
      {
        "name": "Nuxt.js Database Sharding Manager",
        "role": "Nuxt.js / Database Sharding"
      },
      {
        "name": "SolidJS Database Sharding Advisor",
        "role": "SolidJS / Database Sharding"
      },
      {
        "name": "Spring Boot Database Sharding Strategist",
        "role": "Spring Boot / Database Sharding"
      },
      {
        "name": "NestJS Database Sharding Manager",
        "role": "NestJS / Database Sharding"
      },
      {
        "name": "Laravel Database Sharding Advisor",
        "role": "Laravel / Database Sharding"
      },
      {
        "name": "Java Database Sharding Strategist",
        "role": "Java / Database Sharding"
      },
      {
        "name": "Kotlin Database Sharding Manager",
        "role": "Kotlin / Database Sharding"
      },
      {
        "name": "Swift Database Sharding Advisor",
        "role": "Swift / Database Sharding"
      },
      {
        "name": "DynamoDB Database Sharding Strategist",
        "role": "DynamoDB / Database Sharding"
      },
      {
        "name": "Elasticsearch Database Sharding Manager",
        "role": "Elasticsearch / Database Sharding"
      },
      {
        "name": "Pinecone Database Sharding Advisor",
        "role": "Pinecone / Database Sharding"
      },
      {
        "name": "GitHub Actions Database Sharding Strategist",
        "role": "GitHub Actions / Database Sharding"
      },
      {
        "name": "GitLab CI Database Sharding Manager",
        "role": "GitLab CI / Database Sharding"
      },
      {
        "name": "Jenkins Database Sharding Advisor",
        "role": "Jenkins / Database Sharding"
      },
      {
        "name": "Grafana Database Sharding Strategist",
        "role": "Grafana / Database Sharding"
      },
      {
        "name": "Datadog Database Sharding Manager",
        "role": "Datadog / Database Sharding"
      },
      {
        "name": "Sentry Database Sharding Advisor",
        "role": "Sentry / Database Sharding"
      },
      {
        "name": "Scikit-Learn Database Sharding Strategist",
        "role": "Scikit-Learn / Database Sharding"
      },
      {
        "name": "XGBoost Database Sharding Manager",
        "role": "XGBoost / Database Sharding"
      },
      {
        "name": "LangChain Database Sharding Advisor",
        "role": "LangChain / Database Sharding"
      },
      {
        "name": "ESLint Database Sharding Strategist",
        "role": "ESLint / Database Sharding"
      },
      {
        "name": "SonarQube Database Sharding Manager",
        "role": "SonarQube / Database Sharding"
      },
      {
        "name": "Prettier Database Sharding Advisor",
        "role": "Prettier / Database Sharding"
      },
      {
        "name": "Next.js Data Pipelines Strategist",
        "role": "Next.js / Data Pipelines"
      },
      {
        "name": "Nuxt.js Data Pipelines Manager",
        "role": "Nuxt.js / Data Pipelines"
      },
      {
        "name": "SolidJS Data Pipelines Advisor",
        "role": "SolidJS / Data Pipelines"
      },
      {
        "name": "Spring Boot Data Pipelines Strategist",
        "role": "Spring Boot / Data Pipelines"
      },
      {
        "name": "NestJS Data Pipelines Manager",
        "role": "NestJS / Data Pipelines"
      },
      {
        "name": "Laravel Data Pipelines Advisor",
        "role": "Laravel / Data Pipelines"
      },
      {
        "name": "Java Data Pipelines Strategist",
        "role": "Java / Data Pipelines"
      },
      {
        "name": "Kotlin Data Pipelines Manager",
        "role": "Kotlin / Data Pipelines"
      },
      {
        "name": "Swift Data Pipelines Advisor",
        "role": "Swift / Data Pipelines"
      }
    ]
  },
  {
    "name": "Specialist Agents",
    "icon": "\ud83d\udd2c",
    "desc": "Niche industry experts and specialized consultants.",
    "agents": [
      {
        "name": "Svelte Performance Optimization Auditor",
        "role": "Svelte / Performance Optimization"
      },
      {
        "name": "Flask Performance Optimization Auditor",
        "role": "Flask / Performance Optimization"
      },
      {
        "name": "C# .NET Performance Optimization Auditor",
        "role": "C# .NET / Performance Optimization"
      },
      {
        "name": "Cassandra Performance Optimization Auditor",
        "role": "Cassandra / Performance Optimization"
      },
      {
        "name": "Pulumi Performance Optimization Auditor",
        "role": "Pulumi / Performance Optimization"
      },
      {
        "name": "Prometheus Performance Optimization Auditor",
        "role": "Prometheus / Performance Optimization"
      },
      {
        "name": "TensorFlow Performance Optimization Auditor",
        "role": "TensorFlow / Performance Optimization"
      },
      {
        "name": "Pytest Performance Optimization Auditor",
        "role": "Pytest / Performance Optimization"
      },
      {
        "name": "TypeScript Security Auditing Engineer",
        "role": "TypeScript / Security Auditing"
      },
      {
        "name": "React Security Auditing Architect",
        "role": "React / Security Auditing"
      },
      {
        "name": "Vue Security Auditing Specialist",
        "role": "Vue / Security Auditing"
      },
      {
        "name": "Angular Security Auditing Consultant",
        "role": "Angular / Security Auditing"
      },
      {
        "name": "Svelte Security Auditing Auditor",
        "role": "Svelte / Security Auditing"
      },
      {
        "name": "Next.js Security Auditing Strategist",
        "role": "Next.js / Security Auditing"
      },
      {
        "name": "Nuxt.js Security Auditing Manager",
        "role": "Nuxt.js / Security Auditing"
      },
      {
        "name": "SolidJS Security Auditing Advisor",
        "role": "SolidJS / Security Auditing"
      },
      {
        "name": "Qwik Security Auditing Co-Pilot",
        "role": "Qwik / Security Auditing"
      },
      {
        "name": "Astro Security Auditing Developer",
        "role": "Astro / Security Auditing"
      },
      {
        "name": "Node.js Security Auditing Engineer",
        "role": "Node.js / Security Auditing"
      },
      {
        "name": "Express Security Auditing Architect",
        "role": "Express / Security Auditing"
      },
      {
        "name": "FastAPI Security Auditing Specialist",
        "role": "FastAPI / Security Auditing"
      },
      {
        "name": "Django Security Auditing Consultant",
        "role": "Django / Security Auditing"
      },
      {
        "name": "Flask Security Auditing Auditor",
        "role": "Flask / Security Auditing"
      },
      {
        "name": "Spring Boot Security Auditing Strategist",
        "role": "Spring Boot / Security Auditing"
      },
      {
        "name": "NestJS Security Auditing Manager",
        "role": "NestJS / Security Auditing"
      },
      {
        "name": "Laravel Security Auditing Advisor",
        "role": "Laravel / Security Auditing"
      },
      {
        "name": "Ruby on Rails Security Auditing Co-Pilot",
        "role": "Ruby on Rails / Security Auditing"
      },
      {
        "name": "Phoenix Security Auditing Developer",
        "role": "Phoenix / Security Auditing"
      },
      {
        "name": "Go Security Auditing Engineer",
        "role": "Go / Security Auditing"
      },
      {
        "name": "Rust Security Auditing Architect",
        "role": "Rust / Security Auditing"
      },
      {
        "name": "Python Security Auditing Specialist",
        "role": "Python / Security Auditing"
      },
      {
        "name": "C++ Security Auditing Consultant",
        "role": "C++ / Security Auditing"
      },
      {
        "name": "C# .NET Security Auditing Auditor",
        "role": "C# .NET / Security Auditing"
      },
      {
        "name": "Java Security Auditing Strategist",
        "role": "Java / Security Auditing"
      },
      {
        "name": "Kotlin Security Auditing Manager",
        "role": "Kotlin / Security Auditing"
      },
      {
        "name": "Swift Security Auditing Advisor",
        "role": "Swift / Security Auditing"
      },
      {
        "name": "Dart Flutter Security Auditing Co-Pilot",
        "role": "Dart Flutter / Security Auditing"
      },
      {
        "name": "React Native Security Auditing Developer",
        "role": "React Native / Security Auditing"
      },
      {
        "name": "PostgreSQL Security Auditing Engineer",
        "role": "PostgreSQL / Security Auditing"
      },
      {
        "name": "MongoDB Security Auditing Architect",
        "role": "MongoDB / Security Auditing"
      },
      {
        "name": "MySQL Security Auditing Specialist",
        "role": "MySQL / Security Auditing"
      },
      {
        "name": "Redis Security Auditing Consultant",
        "role": "Redis / Security Auditing"
      },
      {
        "name": "Cassandra Security Auditing Auditor",
        "role": "Cassandra / Security Auditing"
      },
      {
        "name": "DynamoDB Security Auditing Strategist",
        "role": "DynamoDB / Security Auditing"
      },
      {
        "name": "Elasticsearch Security Auditing Manager",
        "role": "Elasticsearch / Security Auditing"
      },
      {
        "name": "Pinecone Security Auditing Advisor",
        "role": "Pinecone / Security Auditing"
      },
      {
        "name": "ChromaDB Security Auditing Co-Pilot",
        "role": "ChromaDB / Security Auditing"
      },
      {
        "name": "Neo4j Security Auditing Developer",
        "role": "Neo4j / Security Auditing"
      },
      {
        "name": "Docker Security Auditing Engineer",
        "role": "Docker / Security Auditing"
      },
      {
        "name": "Kubernetes Security Auditing Architect",
        "role": "Kubernetes / Security Auditing"
      },
      {
        "name": "Terraform Security Auditing Specialist",
        "role": "Terraform / Security Auditing"
      },
      {
        "name": "Ansible Security Auditing Consultant",
        "role": "Ansible / Security Auditing"
      },
      {
        "name": "Pulumi Security Auditing Auditor",
        "role": "Pulumi / Security Auditing"
      },
      {
        "name": "GitHub Actions Security Auditing Strategist",
        "role": "GitHub Actions / Security Auditing"
      },
      {
        "name": "GitLab CI Security Auditing Manager",
        "role": "GitLab CI / Security Auditing"
      },
      {
        "name": "Jenkins Security Auditing Advisor",
        "role": "Jenkins / Security Auditing"
      },
      {
        "name": "AWS Security Auditing Co-Pilot",
        "role": "AWS / Security Auditing"
      },
      {
        "name": "GCP Security Auditing Developer",
        "role": "GCP / Security Auditing"
      },
      {
        "name": "Azure Security Auditing Engineer",
        "role": "Azure / Security Auditing"
      },
      {
        "name": "Cloudflare Workers Security Auditing Architect",
        "role": "Cloudflare Workers / Security Auditing"
      },
      {
        "name": "Vercel Edge Security Auditing Specialist",
        "role": "Vercel Edge / Security Auditing"
      },
      {
        "name": "Netlify Security Auditing Consultant",
        "role": "Netlify / Security Auditing"
      },
      {
        "name": "Prometheus Security Auditing Auditor",
        "role": "Prometheus / Security Auditing"
      },
      {
        "name": "Grafana Security Auditing Strategist",
        "role": "Grafana / Security Auditing"
      },
      {
        "name": "Datadog Security Auditing Manager",
        "role": "Datadog / Security Auditing"
      },
      {
        "name": "Sentry Security Auditing Advisor",
        "role": "Sentry / Security Auditing"
      },
      {
        "name": "OpenTelemetry Security Auditing Co-Pilot",
        "role": "OpenTelemetry / Security Auditing"
      },
      {
        "name": "Logstash Security Auditing Developer",
        "role": "Logstash / Security Auditing"
      },
      {
        "name": "Pandas Security Auditing Engineer",
        "role": "Pandas / Security Auditing"
      },
      {
        "name": "NumPy Security Auditing Architect",
        "role": "NumPy / Security Auditing"
      },
      {
        "name": "Apache Spark Security Auditing Specialist",
        "role": "Apache Spark / Security Auditing"
      },
      {
        "name": "PyTorch Security Auditing Consultant",
        "role": "PyTorch / Security Auditing"
      },
      {
        "name": "TensorFlow Security Auditing Auditor",
        "role": "TensorFlow / Security Auditing"
      },
      {
        "name": "Scikit-Learn Security Auditing Strategist",
        "role": "Scikit-Learn / Security Auditing"
      },
      {
        "name": "XGBoost Security Auditing Manager",
        "role": "XGBoost / Security Auditing"
      },
      {
        "name": "LangChain Security Auditing Advisor",
        "role": "LangChain / Security Auditing"
      },
      {
        "name": "LlamaIndex Security Auditing Co-Pilot",
        "role": "LlamaIndex / Security Auditing"
      },
      {
        "name": "LangGraph Security Auditing Developer",
        "role": "LangGraph / Security Auditing"
      },
      {
        "name": "Playwright Security Auditing Engineer",
        "role": "Playwright / Security Auditing"
      },
      {
        "name": "Cypress Security Auditing Architect",
        "role": "Cypress / Security Auditing"
      },
      {
        "name": "Jest Security Auditing Specialist",
        "role": "Jest / Security Auditing"
      },
      {
        "name": "Vitest Security Auditing Consultant",
        "role": "Vitest / Security Auditing"
      },
      {
        "name": "Pytest Security Auditing Auditor",
        "role": "Pytest / Security Auditing"
      },
      {
        "name": "ESLint Security Auditing Strategist",
        "role": "ESLint / Security Auditing"
      },
      {
        "name": "SonarQube Security Auditing Manager",
        "role": "SonarQube / Security Auditing"
      },
      {
        "name": "Prettier Security Auditing Advisor",
        "role": "Prettier / Security Auditing"
      },
      {
        "name": "Snyk Security Auditing Co-Pilot",
        "role": "Snyk / Security Auditing"
      },
      {
        "name": "TruffleHog Security Auditing Developer",
        "role": "TruffleHog / Security Auditing"
      },
      {
        "name": "Svelte Context Engineering Auditor",
        "role": "Svelte / Context Engineering"
      },
      {
        "name": "Flask Context Engineering Auditor",
        "role": "Flask / Context Engineering"
      },
      {
        "name": "C# .NET Context Engineering Auditor",
        "role": "C# .NET / Context Engineering"
      },
      {
        "name": "Cassandra Context Engineering Auditor",
        "role": "Cassandra / Context Engineering"
      },
      {
        "name": "Pulumi Context Engineering Auditor",
        "role": "Pulumi / Context Engineering"
      },
      {
        "name": "Prometheus Context Engineering Auditor",
        "role": "Prometheus / Context Engineering"
      },
      {
        "name": "TensorFlow Context Engineering Auditor",
        "role": "TensorFlow / Context Engineering"
      },
      {
        "name": "Pytest Context Engineering Auditor",
        "role": "Pytest / Context Engineering"
      },
      {
        "name": "TypeScript Compliance Engineer",
        "role": "TypeScript / Compliance"
      },
      {
        "name": "React Compliance Architect",
        "role": "React / Compliance"
      },
      {
        "name": "Vue Compliance Specialist",
        "role": "Vue / Compliance"
      },
      {
        "name": "Angular Compliance Consultant",
        "role": "Angular / Compliance"
      },
      {
        "name": "Svelte Compliance Auditor",
        "role": "Svelte / Compliance"
      },
      {
        "name": "Next.js Compliance Strategist",
        "role": "Next.js / Compliance"
      },
      {
        "name": "Nuxt.js Compliance Manager",
        "role": "Nuxt.js / Compliance"
      },
      {
        "name": "SolidJS Compliance Advisor",
        "role": "SolidJS / Compliance"
      },
      {
        "name": "Qwik Compliance Co-Pilot",
        "role": "Qwik / Compliance"
      },
      {
        "name": "Astro Compliance Developer",
        "role": "Astro / Compliance"
      },
      {
        "name": "Node.js Compliance Engineer",
        "role": "Node.js / Compliance"
      },
      {
        "name": "Express Compliance Architect",
        "role": "Express / Compliance"
      },
      {
        "name": "FastAPI Compliance Specialist",
        "role": "FastAPI / Compliance"
      },
      {
        "name": "Django Compliance Consultant",
        "role": "Django / Compliance"
      },
      {
        "name": "Flask Compliance Auditor",
        "role": "Flask / Compliance"
      },
      {
        "name": "Spring Boot Compliance Strategist",
        "role": "Spring Boot / Compliance"
      },
      {
        "name": "NestJS Compliance Manager",
        "role": "NestJS / Compliance"
      },
      {
        "name": "Laravel Compliance Advisor",
        "role": "Laravel / Compliance"
      },
      {
        "name": "Ruby on Rails Compliance Co-Pilot",
        "role": "Ruby on Rails / Compliance"
      },
      {
        "name": "Phoenix Compliance Developer",
        "role": "Phoenix / Compliance"
      },
      {
        "name": "Go Compliance Engineer",
        "role": "Go / Compliance"
      },
      {
        "name": "Rust Compliance Architect",
        "role": "Rust / Compliance"
      },
      {
        "name": "Python Compliance Specialist",
        "role": "Python / Compliance"
      },
      {
        "name": "C++ Compliance Consultant",
        "role": "C++ / Compliance"
      },
      {
        "name": "C# .NET Compliance Auditor",
        "role": "C# .NET / Compliance"
      },
      {
        "name": "Java Compliance Strategist",
        "role": "Java / Compliance"
      },
      {
        "name": "Kotlin Compliance Manager",
        "role": "Kotlin / Compliance"
      },
      {
        "name": "Swift Compliance Advisor",
        "role": "Swift / Compliance"
      },
      {
        "name": "Dart Flutter Compliance Co-Pilot",
        "role": "Dart Flutter / Compliance"
      },
      {
        "name": "React Native Compliance Developer",
        "role": "React Native / Compliance"
      },
      {
        "name": "PostgreSQL Compliance Engineer",
        "role": "PostgreSQL / Compliance"
      },
      {
        "name": "MongoDB Compliance Architect",
        "role": "MongoDB / Compliance"
      },
      {
        "name": "MySQL Compliance Specialist",
        "role": "MySQL / Compliance"
      },
      {
        "name": "Redis Compliance Consultant",
        "role": "Redis / Compliance"
      },
      {
        "name": "Cassandra Compliance Auditor",
        "role": "Cassandra / Compliance"
      },
      {
        "name": "DynamoDB Compliance Strategist",
        "role": "DynamoDB / Compliance"
      },
      {
        "name": "Elasticsearch Compliance Manager",
        "role": "Elasticsearch / Compliance"
      },
      {
        "name": "Pinecone Compliance Advisor",
        "role": "Pinecone / Compliance"
      },
      {
        "name": "ChromaDB Compliance Co-Pilot",
        "role": "ChromaDB / Compliance"
      },
      {
        "name": "Neo4j Compliance Developer",
        "role": "Neo4j / Compliance"
      },
      {
        "name": "Docker Compliance Engineer",
        "role": "Docker / Compliance"
      },
      {
        "name": "Kubernetes Compliance Architect",
        "role": "Kubernetes / Compliance"
      },
      {
        "name": "Terraform Compliance Specialist",
        "role": "Terraform / Compliance"
      },
      {
        "name": "Ansible Compliance Consultant",
        "role": "Ansible / Compliance"
      },
      {
        "name": "Pulumi Compliance Auditor",
        "role": "Pulumi / Compliance"
      },
      {
        "name": "GitHub Actions Compliance Strategist",
        "role": "GitHub Actions / Compliance"
      },
      {
        "name": "GitLab CI Compliance Manager",
        "role": "GitLab CI / Compliance"
      },
      {
        "name": "Jenkins Compliance Advisor",
        "role": "Jenkins / Compliance"
      },
      {
        "name": "AWS Compliance Co-Pilot",
        "role": "AWS / Compliance"
      },
      {
        "name": "GCP Compliance Developer",
        "role": "GCP / Compliance"
      },
      {
        "name": "Azure Compliance Engineer",
        "role": "Azure / Compliance"
      },
      {
        "name": "Cloudflare Workers Compliance Architect",
        "role": "Cloudflare Workers / Compliance"
      },
      {
        "name": "Vercel Edge Compliance Specialist",
        "role": "Vercel Edge / Compliance"
      },
      {
        "name": "Netlify Compliance Consultant",
        "role": "Netlify / Compliance"
      },
      {
        "name": "Prometheus Compliance Auditor",
        "role": "Prometheus / Compliance"
      },
      {
        "name": "Grafana Compliance Strategist",
        "role": "Grafana / Compliance"
      },
      {
        "name": "Datadog Compliance Manager",
        "role": "Datadog / Compliance"
      },
      {
        "name": "Sentry Compliance Advisor",
        "role": "Sentry / Compliance"
      },
      {
        "name": "OpenTelemetry Compliance Co-Pilot",
        "role": "OpenTelemetry / Compliance"
      },
      {
        "name": "Logstash Compliance Developer",
        "role": "Logstash / Compliance"
      },
      {
        "name": "Pandas Compliance Engineer",
        "role": "Pandas / Compliance"
      },
      {
        "name": "NumPy Compliance Architect",
        "role": "NumPy / Compliance"
      },
      {
        "name": "Apache Spark Compliance Specialist",
        "role": "Apache Spark / Compliance"
      },
      {
        "name": "PyTorch Compliance Consultant",
        "role": "PyTorch / Compliance"
      },
      {
        "name": "TensorFlow Compliance Auditor",
        "role": "TensorFlow / Compliance"
      },
      {
        "name": "Scikit-Learn Compliance Strategist",
        "role": "Scikit-Learn / Compliance"
      },
      {
        "name": "XGBoost Compliance Manager",
        "role": "XGBoost / Compliance"
      },
      {
        "name": "LangChain Compliance Advisor",
        "role": "LangChain / Compliance"
      },
      {
        "name": "LlamaIndex Compliance Co-Pilot",
        "role": "LlamaIndex / Compliance"
      },
      {
        "name": "LangGraph Compliance Developer",
        "role": "LangGraph / Compliance"
      },
      {
        "name": "Playwright Compliance Engineer",
        "role": "Playwright / Compliance"
      },
      {
        "name": "Cypress Compliance Architect",
        "role": "Cypress / Compliance"
      },
      {
        "name": "Jest Compliance Specialist",
        "role": "Jest / Compliance"
      },
      {
        "name": "Vitest Compliance Consultant",
        "role": "Vitest / Compliance"
      },
      {
        "name": "Pytest Compliance Auditor",
        "role": "Pytest / Compliance"
      },
      {
        "name": "ESLint Compliance Strategist",
        "role": "ESLint / Compliance"
      },
      {
        "name": "SonarQube Compliance Manager",
        "role": "SonarQube / Compliance"
      },
      {
        "name": "Prettier Compliance Advisor",
        "role": "Prettier / Compliance"
      },
      {
        "name": "Snyk Compliance Co-Pilot",
        "role": "Snyk / Compliance"
      },
      {
        "name": "TruffleHog Compliance Developer",
        "role": "TruffleHog / Compliance"
      },
      {
        "name": "Svelte API Design Auditor",
        "role": "Svelte / API Design"
      },
      {
        "name": "Flask API Design Auditor",
        "role": "Flask / API Design"
      },
      {
        "name": "C# .NET API Design Auditor",
        "role": "C# .NET / API Design"
      },
      {
        "name": "Cassandra API Design Auditor",
        "role": "Cassandra / API Design"
      },
      {
        "name": "Pulumi API Design Auditor",
        "role": "Pulumi / API Design"
      },
      {
        "name": "Prometheus API Design Auditor",
        "role": "Prometheus / API Design"
      },
      {
        "name": "TensorFlow API Design Auditor",
        "role": "TensorFlow / API Design"
      },
      {
        "name": "Pytest API Design Auditor",
        "role": "Pytest / API Design"
      },
      {
        "name": "Svelte Database Sharding Auditor",
        "role": "Svelte / Database Sharding"
      },
      {
        "name": "Flask Database Sharding Auditor",
        "role": "Flask / Database Sharding"
      },
      {
        "name": "C# .NET Database Sharding Auditor",
        "role": "C# .NET / Database Sharding"
      },
      {
        "name": "Cassandra Database Sharding Auditor",
        "role": "Cassandra / Database Sharding"
      },
      {
        "name": "Pulumi Database Sharding Auditor",
        "role": "Pulumi / Database Sharding"
      },
      {
        "name": "Prometheus Database Sharding Auditor",
        "role": "Prometheus / Database Sharding"
      },
      {
        "name": "TensorFlow Database Sharding Auditor",
        "role": "TensorFlow / Database Sharding"
      },
      {
        "name": "Pytest Database Sharding Auditor",
        "role": "Pytest / Database Sharding"
      },
      {
        "name": "Svelte Data Pipelines Auditor",
        "role": "Svelte / Data Pipelines"
      },
      {
        "name": "Flask Data Pipelines Auditor",
        "role": "Flask / Data Pipelines"
      },
      {
        "name": "C# .NET Data Pipelines Auditor",
        "role": "C# .NET / Data Pipelines"
      }
    ]
  },
  {
    "name": "Core Agents",
    "icon": "\ud83e\udde0",
    "desc": "Fundamental agents for code review, architecture, and planning.",
    "agents": [
      {
        "name": "Architect",
        "role": "System Design"
      },
      {
        "name": "Code Reviewer",
        "role": "Code Quality"
      },
      {
        "name": "Planner",
        "role": "Task Planning"
      },
      {
        "name": "Security Reviewer",
        "role": "Security"
      }
    ]
  },
  {
    "name": "SDR Agents",
    "icon": "\ud83d\udcde",
    "desc": "Sales development agents for prospecting, research, and outreach.",
    "agents": [
      {
        "name": "SDR Copywriter",
        "role": "Outreach Writing"
      },
      {
        "name": "SDR Prospector",
        "role": "Prospecting"
      },
      {
        "name": "SDR Qualifier",
        "role": "Qualification"
      },
      {
        "name": "SDR Researcher",
        "role": "Research"
      }
    ]
  },
  {
    "name": "Build Resolvers",
    "icon": "\ud83d\udd27",
    "desc": "Language-specific build and error resolution agents.",
    "agents": [
      {
        "name": "Python Resolver",
        "role": "Python"
      },
      {
        "name": "TypeScript Resolver",
        "role": "TypeScript"
      }
    ]
  }
];

export function AgentsApp() {
  const [active, setActive] = useState(0);
  const cat = agentCategories[active];

  return (
    <div className="h-full flex flex-col sm:flex-row">
      <aside className="sm:w-56 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3">
          <Eyebrow color="#b62ad9">Specialist Agents</Eyebrow>
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
          {agentCategories.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActive(i)}
              className={`w-full text-left flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition ${
                i === active ? "bg-white border border-hairline text-ink" : "text-body hover:bg-white/60"
              }`}
            >
              <span>{c.icon}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-[10px] text-mute">{c.agents.length}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-hairline text-[10px] text-mute">
          {agentCategories.reduce((sum, c) => sum + c.agents.length, 0)} agents total
        </div>
      </aside>

      <div className="flex-1 min-w-0 overflow-auto p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{cat.icon}</span>
          <h1 className="text-xl font-extrabold text-ink">{cat.name}</h1>
          <Tag color="#b62ad9">{cat.agents.length} agents</Tag>
        </div>
        <p className="mt-2 text-[13px] text-body max-w-lg">{cat.desc}</p>

        <div className="mt-4 grid sm:grid-cols-2 gap-2.5">
          {cat.agents.map((a) => (
            <div key={a.name} className="rounded-xl border border-hairline bg-white p-3.5 flex items-center gap-3 hover:border-brand-purple/40 transition">
              <div className="grid place-items-center size-9 rounded-lg text-lg bg-accent-purple/10 shrink-0">🤖</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-ink">{a.name}</div>
                <div className="text-[11px] text-mute">{a.role}</div>
              </div>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-brand-purple bg-brand-purple/10">Ready</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border-l-4 border-brand-purple bg-brand-purple/10 px-4 py-3 text-[12px] text-body">
          💡 <strong>Note:</strong> The repository contains {agentCategories.reduce((sum, c) => sum + c.agents.length, 0)}+ agents across {agentCategories.length} categories. These are the most-used ones.
        </div>
      </div>
    </div>
  );
}
