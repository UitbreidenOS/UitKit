#!/usr/bin/env node

/**
 * Agent Cloning System
 *
 * Clone agents with custom configurations, save as reusable templates,
 * and share agent setups across team members. Manage agent versions
 * and track configuration lineage independently.
 *
 * Features:
 * - Clone agents from templates with custom configs
 * - Save cloned agents as reusable templates
 * - Team sharing with access control
 * - Version tracking and lineage
 * - Configuration validation
 * - Batch operations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const AGENT_CLONES_DIR = path.join(CLAUDE_DIR, 'agent-clones');
const TEMPLATES_DIR = path.join(AGENT_CLONES_DIR, 'templates');
const INSTANCES_DIR = path.join(AGENT_CLONES_DIR, 'instances');
const SHARING_DIR = path.join(AGENT_CLONES_DIR, 'sharing');
const LINEAGE_DIR = path.join(AGENT_CLONES_DIR, 'lineage');

// Ensure directories exist
[AGENT_CLONES_DIR, TEMPLATES_DIR, INSTANCES_DIR, SHARING_DIR, LINEAGE_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  DIM: '\x1b[2m',
};

/**
 * Agent Configuration Schema
 */
const DEFAULT_AGENT_CONFIG = {
  name: '',
  description: '',
  purpose: '',
  model: 'claude-opus-4-1',
  tools: [],
  maxTokens: 100000,
  temperature: 0.7,
  systemPrompt: '',
  environment: {},
  permissions: [],
  timeout: 300000,
  retryPolicy: {
    maxAttempts: 3,
    backoffMs: 1000,
  },
  monitoring: {
    enabled: true,
    logLevel: 'info',
  },
  customFields: {},
};

/**
 * Agent Clone Manager
 */
class AgentCloneManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = {
      validateSchema: options.validateSchema !== false,
      preserveHistory: options.preserveHistory !== false,
      autoBackup: options.autoBackup !== false,
      ...options,
    };
    this.cloneRegistry = this.loadRegistry();
  }

  /**
   * Load clone registry from disk
   */
  loadRegistry() {
    const registryPath = path.join(AGENT_CLONES_DIR, 'registry.json');
    if (fs.existsSync(registryPath)) {
      return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    }
    return {
      templates: {},
      instances: {},
      sharing: {},
      lineage: {},
    };
  }

  /**
   * Save registry to disk
   */
  saveRegistry() {
    const registryPath = path.join(AGENT_CLONES_DIR, 'registry.json');
    fs.writeFileSync(registryPath, JSON.stringify(this.cloneRegistry, null, 2));
    this.emit('registry-saved', { timestamp: Date.now() });
  }

  /**
   * Validate and merge config with defaults
   */
  validateAndMergeConfig(config) {
    const merged = this.deepMerge(JSON.parse(JSON.stringify(DEFAULT_AGENT_CONFIG)), config);
    if (this.options.validateSchema) {
      this.validateConfig(merged);
    }
    return merged;
  }

  /**
   * Create agent template from base config
   */
  createTemplate(baseConfig, templateName, metadata = {}) {
    if (!templateName || typeof templateName !== 'string') {
      throw new Error('Template name must be a non-empty string');
    }

    if (this.cloneRegistry.templates[templateName]) {
      throw new Error(`Template "${templateName}" already exists`);
    }

    const config = this.validateAndMergeConfig(baseConfig);
    const templateId = this.generateId('tpl');
    const timestamp = Date.now();

    const template = {
      id: templateId,
      name: templateName,
      config,
      metadata: {
        created: timestamp,
        updated: timestamp,
        author: metadata.author || 'unknown',
        description: metadata.description || '',
        tags: metadata.tags || [],
        version: '1.0.0',
      },
      variants: [],
    };

    // Save template
    const templatePath = path.join(TEMPLATES_DIR, `${templateId}.json`);
    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));

    this.cloneRegistry.templates[templateId] = {
      name: templateName,
      path: templatePath,
      created: timestamp,
      instances: [],
    };

    this.saveRegistry();
    this.emit('template-created', { templateId, templateName });

    return template;
  }

  /**
   * Clone agent from template with custom overrides
   */
  cloneAgent(templateId, cloneName, overrides = {}, metadata = {}) {
    if (!this.cloneRegistry.templates[templateId]) {
      throw new Error(`Template "${templateId}" not found`);
    }

    if (!cloneName || typeof cloneName !== 'string') {
      throw new Error('Clone name must be a non-empty string');
    }

    const templatePath = this.cloneRegistry.templates[templateId].path;
    const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

    // Merge template config with overrides
    const cloneConfig = this.deepMerge(
      JSON.parse(JSON.stringify(template.config)),
      overrides
    );

    if (this.options.validateSchema) {
      this.validateConfig(cloneConfig);
    }

    const cloneId = this.generateId('clone');
    const timestamp = Date.now();
    const parentId = templateId;

    const clone = {
      id: cloneId,
      name: cloneName,
      config: cloneConfig,
      metadata: {
        created: timestamp,
        updated: timestamp,
        author: metadata.author || 'unknown',
        description: metadata.description || '',
        tags: metadata.tags || [],
        version: '1.0.0',
        parentTemplate: templateId,
      },
      lineage: {
        parent: parentId,
        baseTemplate: template.metadata?.version || '1.0.0',
        branch: metadata.branch || 'main',
      },
      overrides: Object.keys(overrides),
    };

    // Save clone
    const clonePath = path.join(INSTANCES_DIR, `${cloneId}.json`);
    fs.writeFileSync(clonePath, JSON.stringify(clone, null, 2));

    this.cloneRegistry.instances[cloneId] = {
      name: cloneName,
      path: clonePath,
      created: timestamp,
      templateId,
      shared: false,
    };

    // Track lineage
    this.recordLineage(cloneId, parentId, 'clone', metadata);

    // Update template's instance list
    if (!this.cloneRegistry.templates[templateId].instances) {
      this.cloneRegistry.templates[templateId].instances = [];
    }
    this.cloneRegistry.templates[templateId].instances.push(cloneId);

    this.saveRegistry();
    this.emit('clone-created', { cloneId, cloneName, templateId });

    return clone;
  }

  /**
   * Create variant from existing clone
   */
  createVariant(sourceCloneId, variantName, customization = {}, metadata = {}) {
    const sourcePath = this.cloneRegistry.instances[sourceCloneId]?.path;
    if (!sourcePath || !fs.existsSync(sourcePath)) {
      throw new Error(`Clone "${sourceCloneId}" not found`);
    }

    const sourceClone = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

    const variantConfig = this.deepMerge(
      JSON.parse(JSON.stringify(sourceClone.config)),
      customization
    );

    const variantId = this.generateId('var');
    const timestamp = Date.now();

    const variant = {
      id: variantId,
      name: variantName,
      config: variantConfig,
      metadata: {
        created: timestamp,
        updated: timestamp,
        author: metadata.author || 'unknown',
        description: metadata.description || '',
        tags: metadata.tags || [],
        version: '1.0.0',
        sourceClone: sourceCloneId,
      },
      lineage: {
        parent: sourceCloneId,
        grandparent: sourceClone.lineage?.parent,
        branch: metadata.branch || sourceClone.lineage?.branch || 'main',
      },
    };

    const variantPath = path.join(INSTANCES_DIR, `${variantId}.json`);
    fs.writeFileSync(variantPath, JSON.stringify(variant, null, 2));

    this.cloneRegistry.instances[variantId] = {
      name: variantName,
      path: variantPath,
      created: timestamp,
      isVariant: true,
      sourceClone: sourceCloneId,
    };

    this.recordLineage(variantId, sourceCloneId, 'variant', metadata);

    this.saveRegistry();
    this.emit('variant-created', { variantId, variantName, sourceCloneId });

    return variant;
  }

  /**
   * Share agent with team members
   */
  shareAgent(cloneId, shareConfig = {}) {
    const clonePath = this.cloneRegistry.instances[cloneId]?.path;
    if (!clonePath || !fs.existsSync(clonePath)) {
      throw new Error(`Clone "${cloneId}" not found`);
    }

    const clone = JSON.parse(fs.readFileSync(clonePath, 'utf8'));
    const shareId = this.generateId('share');
    const timestamp = Date.now();

    const sharing = {
      id: shareId,
      cloneId,
      cloneName: clone.name,
      shared: {
        at: timestamp,
        by: shareConfig.author || 'unknown',
        with: shareConfig.recipients || [],
        accessLevel: shareConfig.accessLevel || 'read', // 'read', 'edit', 'admin'
        expiry: shareConfig.expiry || null,
      },
      description: shareConfig.description || '',
      terms: {
        canModify: shareConfig.canModify !== false,
        canShare: shareConfig.canShare === true,
        canDelete: false,
        canVersion: shareConfig.canVersion !== false,
      },
    };

    const sharingPath = path.join(SHARING_DIR, `${shareId}.json`);
    fs.writeFileSync(sharingPath, JSON.stringify(sharing, null, 2));

    this.cloneRegistry.sharing[shareId] = {
      cloneId,
      path: sharingPath,
      recipients: shareConfig.recipients || [],
      created: timestamp,
    };

    this.cloneRegistry.instances[cloneId].shared = true;
    this.saveRegistry();
    this.emit('agent-shared', { shareId, cloneId, recipients: sharing.shared.with });

    return sharing;
  }

  /**
   * Get sharing details for an agent
   */
  getSharingInfo(cloneId) {
    const shares = [];
    for (const [shareId, share] of Object.entries(this.cloneRegistry.sharing)) {
      if (share.cloneId === cloneId) {
        const sharePath = share.path;
        if (fs.existsSync(sharePath)) {
          shares.push(JSON.parse(fs.readFileSync(sharePath, 'utf8')));
        }
      }
    }
    return shares;
  }

  /**
   * Record lineage for clone/variant
   */
  recordLineage(cloneId, parentId, operation, metadata = {}) {
    const lineageEntry = {
      cloneId,
      parentId,
      operation,
      timestamp: Date.now(),
      author: metadata.author || 'unknown',
      reason: metadata.reason || '',
      branch: metadata.branch || 'main',
    };

    if (!this.cloneRegistry.lineage[cloneId]) {
      this.cloneRegistry.lineage[cloneId] = [];
    }

    this.cloneRegistry.lineage[cloneId].push(lineageEntry);
  }

  /**
   * Get full lineage tree for clone
   */
  getLineageTree(cloneId) {
    const tree = {
      id: cloneId,
      history: this.cloneRegistry.lineage[cloneId] || [],
      descendants: this.findDescendants(cloneId),
    };
    return tree;
  }

  /**
   * Find all descendants of a clone
   */
  findDescendants(parentId) {
    const descendants = [];
    for (const [cloneId, lineage] of Object.entries(this.cloneRegistry.lineage)) {
      const directParent = lineage.find((entry) => entry.parentId === parentId);
      if (directParent) {
        descendants.push(cloneId);
        descendants.push(...this.findDescendants(cloneId));
      }
    }
    return [...new Set(descendants)];
  }

  /**
   * Save clone as new template
   */
  saveAsTemplate(cloneId, templateName, metadata = {}) {
    const clonePath = this.cloneRegistry.instances[cloneId]?.path;
    if (!clonePath || !fs.existsSync(clonePath)) {
      throw new Error(`Clone "${cloneId}" not found`);
    }

    const clone = JSON.parse(fs.readFileSync(clonePath, 'utf8'));

    const template = {
      id: this.generateId('tpl'),
      name: templateName,
      config: clone.config,
      metadata: {
        created: Date.now(),
        updated: Date.now(),
        author: metadata.author || clone.metadata.author,
        description: metadata.description || clone.metadata.description,
        tags: metadata.tags || clone.metadata.tags,
        version: '1.0.0',
        basedOnClone: cloneId,
        originalTemplate: clone.metadata.parentTemplate,
      },
      variants: [],
    };

    const templatePath = path.join(TEMPLATES_DIR, `${template.id}.json`);
    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));

    this.cloneRegistry.templates[template.id] = {
      name: templateName,
      path: templatePath,
      created: template.metadata.created,
      instances: [],
    };

    this.saveRegistry();
    this.emit('template-created-from-clone', { templateId: template.id, cloneId });

    return template;
  }

  /**
   * List all templates
   */
  listTemplates(filter = {}) {
    const templates = [];
    for (const [templateId, meta] of Object.entries(this.cloneRegistry.templates)) {
      if (!fs.existsSync(meta.path)) continue;

      const template = JSON.parse(fs.readFileSync(meta.path, 'utf8'));

      if (filter.tag && !template.metadata.tags.includes(filter.tag)) continue;
      if (filter.author && template.metadata.author !== filter.author) continue;

      templates.push({
        id: templateId,
        name: template.name,
        description: template.metadata.description,
        author: template.metadata.author,
        created: template.metadata.created,
        instances: meta.instances.length,
        tags: template.metadata.tags,
      });
    }
    return templates.sort((a, b) => b.created - a.created);
  }

  /**
   * List all clones/instances
   */
  listInstances(filter = {}) {
    const instances = [];
    for (const [instanceId, meta] of Object.entries(this.cloneRegistry.instances)) {
      if (!fs.existsSync(meta.path)) continue;

      const instance = JSON.parse(fs.readFileSync(meta.path, 'utf8'));

      if (filter.shared !== undefined && meta.shared !== filter.shared) continue;
      if (filter.tag && !instance.metadata.tags.includes(filter.tag)) continue;

      instances.push({
        id: instanceId,
        name: instance.name,
        description: instance.metadata.description,
        author: instance.metadata.author,
        created: instance.metadata.created,
        templateId: meta.templateId,
        isVariant: meta.isVariant || false,
        shared: meta.shared,
        tags: instance.metadata.tags,
      });
    }
    return instances.sort((a, b) => b.created - a.created);
  }

  /**
   * Get clone details
   */
  getClone(cloneId) {
    const meta = this.cloneRegistry.instances[cloneId];
    if (!meta || !fs.existsSync(meta.path)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(meta.path, 'utf8'));
  }

  /**
   * Get template details
   */
  getTemplate(templateId) {
    const meta = this.cloneRegistry.templates[templateId];
    if (!meta || !fs.existsSync(meta.path)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(meta.path, 'utf8'));
  }

  /**
   * Update clone configuration
   */
  updateClone(cloneId, updates, metadata = {}) {
    const clone = this.getClone(cloneId);
    if (!clone) {
      throw new Error(`Clone "${cloneId}" not found`);
    }

    const mergedConfig = this.deepMerge(clone.config, updates);
    if (this.options.validateSchema) {
      this.validateConfig(mergedConfig);
    }

    clone.config = mergedConfig;
    clone.metadata.updated = Date.now();
    if (metadata.reason) {
      clone.metadata.updateReason = metadata.reason;
    }

    const clonePath = this.cloneRegistry.instances[cloneId].path;
    fs.writeFileSync(clonePath, JSON.stringify(clone, null, 2));

    this.recordLineage(cloneId, clone.lineage?.parent, 'update', metadata);
    this.saveRegistry();
    this.emit('clone-updated', { cloneId, updates });

    return clone;
  }

  /**
   * Delete clone
   */
  deleteClone(cloneId, purge = false) {
    const meta = this.cloneRegistry.instances[cloneId];
    if (!meta) {
      throw new Error(`Clone "${cloneId}" not found`);
    }

    if (!purge && this.findDescendants(cloneId).length > 0) {
      throw new Error(
        `Cannot delete clone "${cloneId}" - it has ${this.findDescendants(cloneId).length} descendant(s). Use purge=true to force.`
      );
    }

    // Backup before deletion
    if (this.options.autoBackup) {
      const backupPath = path.join(AGENT_CLONES_DIR, 'backups', `${cloneId}-backup.json`);
      const backupDir = path.dirname(backupPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const clone = JSON.parse(fs.readFileSync(meta.path, 'utf8'));
      fs.writeFileSync(
        backupPath,
        JSON.stringify({ ...clone, deletedAt: Date.now() }, null, 2)
      );
    }

    // Remove from filesystem
    if (fs.existsSync(meta.path)) {
      fs.unlinkSync(meta.path);
    }

    // Remove from registry
    delete this.cloneRegistry.instances[cloneId];
    this.saveRegistry();
    this.emit('clone-deleted', { cloneId });
  }

  /**
   * Version clone
   */
  versionClone(cloneId, versionLabel, notes = '') {
    const clone = this.getClone(cloneId);
    if (!clone) {
      throw new Error(`Clone "${cloneId}" not found`);
    }

    const version = {
      id: this.generateId('ver'),
      cloneId,
      label: versionLabel,
      timestamp: Date.now(),
      config: JSON.parse(JSON.stringify(clone.config)),
      notes,
    };

    const versionsDir = path.join(AGENT_CLONES_DIR, 'versions');
    if (!fs.existsSync(versionsDir)) {
      fs.mkdirSync(versionsDir, { recursive: true });
    }

    const versionPath = path.join(versionsDir, `${version.id}.json`);
    fs.writeFileSync(versionPath, JSON.stringify(version, null, 2));

    if (!this.cloneRegistry.versions) {
      this.cloneRegistry.versions = {};
    }
    this.cloneRegistry.versions[version.id] = {
      cloneId,
      path: versionPath,
      label: versionLabel,
      created: version.timestamp,
    };

    this.saveRegistry();
    this.emit('clone-versioned', { versionId: version.id, cloneId, label: versionLabel });

    return version;
  }

  /**
   * Restore clone to specific version
   */
  restoreVersion(versionId) {
    if (!this.cloneRegistry.versions || !this.cloneRegistry.versions[versionId]) {
      throw new Error(`Version "${versionId}" not found`);
    }

    const versionPath = this.cloneRegistry.versions[versionId].path;
    const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

    const clone = this.getClone(version.cloneId);
    if (!clone) {
      throw new Error(`Clone "${version.cloneId}" not found`);
    }

    clone.config = version.config;
    clone.metadata.updated = Date.now();
    clone.metadata.restoredFrom = versionId;

    const clonePath = this.cloneRegistry.instances[version.cloneId].path;
    fs.writeFileSync(clonePath, JSON.stringify(clone, null, 2));

    this.saveRegistry();
    this.emit('clone-restored', { cloneId: version.cloneId, versionId });

    return clone;
  }

  /**
   * Export clone for sharing
   */
  exportClone(cloneId, format = 'json') {
    const clone = this.getClone(cloneId);
    if (!clone) {
      throw new Error(`Clone "${cloneId}" not found`);
    }

    const export_ = {
      metadata: {
        exportedAt: Date.now(),
        format,
        version: '1.0',
      },
      clone,
      lineage: this.getLineageTree(cloneId),
      sharing: this.getSharingInfo(cloneId),
    };

    if (format === 'json') {
      return JSON.stringify(export_, null, 2);
    } else if (format === 'yaml') {
      const yaml = this.toYaml(export_);
      return yaml;
    }
    throw new Error(`Unsupported format: ${format}`);
  }

  /**
   * Import clone from export
   */
  importClone(exportData, metadata = {}) {
    const parsed =
      typeof exportData === 'string' ? JSON.parse(exportData) : exportData;

    const clone = parsed.clone;
    const cloneId = this.generateId('clone');

    clone.id = cloneId;
    clone.metadata.created = Date.now();
    clone.metadata.imported = true;
    clone.metadata.importedBy = metadata.author || 'unknown';
    clone.metadata.importReason = metadata.reason || '';

    const clonePath = path.join(INSTANCES_DIR, `${cloneId}.json`);
    fs.writeFileSync(clonePath, JSON.stringify(clone, null, 2));

    this.cloneRegistry.instances[cloneId] = {
      name: clone.name,
      path: clonePath,
      created: clone.metadata.created,
      imported: true,
    };

    this.saveRegistry();
    this.emit('clone-imported', { cloneId, originalId: clone.id });

    return clone;
  }

  /**
   * Validate agent configuration
   */
  validateConfig(config) {
    const errors = [];

    if (!config.name || typeof config.name !== 'string') {
      errors.push('name must be a non-empty string');
    }

    if (!config.model) {
      errors.push('model must be specified');
    }

    if (typeof config.maxTokens !== 'number' || config.maxTokens < 0) {
      errors.push('maxTokens must be a positive number');
    }

    if (typeof config.temperature !== 'number' || config.temperature < 0 || config.temperature > 2) {
      errors.push('temperature must be between 0 and 2');
    }

    if (!Array.isArray(config.tools)) {
      errors.push('tools must be an array');
    }

    if (config.retryPolicy) {
      if (typeof config.retryPolicy.maxAttempts !== 'number') {
        errors.push('retryPolicy.maxAttempts must be a number');
      }
      if (typeof config.retryPolicy.backoffMs !== 'number') {
        errors.push('retryPolicy.backoffMs must be a number');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n  ${errors.join('\n  ')}`);
    }

    return true;
  }

  /**
   * Deep merge utility
   */
  deepMerge(target, source) {
    const result = JSON.parse(JSON.stringify(target));

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          source[key] !== null &&
          typeof source[key] === 'object' &&
          !Array.isArray(source[key]) &&
          result[key] &&
          typeof result[key] === 'object' &&
          !Array.isArray(result[key])
        ) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * Generate unique ID
   */
  generateId(prefix = 'agent') {
    return `${prefix}-${crypto.randomBytes(6).toString('hex')}`;
  }

  /**
   * Convert to YAML (simple implementation)
   */
  toYaml(obj, indent = 0) {
    const lines = [];
    const prefix = '  '.repeat(indent);

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        lines.push(`${prefix}${key}:`);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        lines.push(`${prefix}${key}:`);
        lines.push(this.toYaml(value, indent + 1));
      } else if (Array.isArray(value)) {
        lines.push(`${prefix}${key}:`);
        value.forEach((item) => {
          if (typeof item === 'object') {
            lines.push(`${prefix}  -`);
            lines.push(this.toYaml(item, indent + 2));
          } else {
            lines.push(`${prefix}  - ${item}`);
          }
        });
      } else {
        lines.push(`${prefix}${key}: ${value}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Get statistics
   */
  getStats() {
    const stats = {
      templates: Object.keys(this.cloneRegistry.templates).length,
      instances: Object.keys(this.cloneRegistry.instances).length,
      shared: Object.keys(this.cloneRegistry.sharing).length,
      versions: Object.keys(this.cloneRegistry.versions || {}).length,
      lineageEntries: Object.keys(this.cloneRegistry.lineage).length,
    };

    let sharedInstances = 0;
    for (const instance of Object.values(this.cloneRegistry.instances)) {
      if (instance.shared) sharedInstances++;
    }

    stats.sharedInstances = sharedInstances;

    return stats;
  }
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const manager = new AgentCloneManager();

  try {
    switch (command) {
      case 'create-template': {
        const name = args[1];
        const author = args[2] || 'CLI';
        const config = JSON.parse(args[3] || '{}');

        if (!name) {
          console.error(`${COLORS.RED}Error: template name required${COLORS.RESET}`);
          process.exit(1);
        }

        const template = manager.createTemplate(config, name, { author });
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Template created: ${COLORS.CYAN}${template.id}${COLORS.RESET}`
        );
        console.log(`  Name: ${template.name}`);
        console.log(`  Author: ${template.metadata.author}`);
        break;
      }

      case 'clone': {
        const templateId = args[1];
        const cloneName = args[2];
        const author = args[3] || 'CLI';
        const overrides = JSON.parse(args[4] || '{}');

        if (!templateId || !cloneName) {
          console.error(`${COLORS.RED}Error: template ID and clone name required${COLORS.RESET}`);
          process.exit(1);
        }

        const clone = manager.cloneAgent(templateId, cloneName, overrides, { author });
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Clone created: ${COLORS.CYAN}${clone.id}${COLORS.RESET}`
        );
        console.log(`  Name: ${clone.name}`);
        console.log(`  From template: ${clone.metadata.parentTemplate}`);
        console.log(`  Overrides: ${clone.overrides.length} properties`);
        break;
      }

      case 'variant': {
        const sourceId = args[1];
        const variantName = args[2];
        const author = args[3] || 'CLI';
        const custom = JSON.parse(args[4] || '{}');

        const variant = manager.createVariant(sourceId, variantName, custom, { author });
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Variant created: ${COLORS.CYAN}${variant.id}${COLORS.RESET}`
        );
        console.log(`  Name: ${variant.name}`);
        console.log(`  From source: ${variant.metadata.sourceClone}`);
        break;
      }

      case 'share': {
        const cloneId = args[1];
        const recipients = (args[2] || '').split(',').filter(Boolean);

        const sharing = manager.shareAgent(cloneId, {
          recipients,
          author: 'CLI',
        });
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Clone shared: ${COLORS.CYAN}${sharing.id}${COLORS.RESET}`
        );
        console.log(`  Clone: ${sharing.cloneName}`);
        console.log(`  With: ${sharing.shared.with.join(', ')}`);
        break;
      }

      case 'save-template': {
        const cloneId = args[1];
        const templateName = args[2];

        const template = manager.saveAsTemplate(cloneId, templateName, {
          author: 'CLI',
        });
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Template created from clone: ${COLORS.CYAN}${template.id}${COLORS.RESET}`
        );
        console.log(`  Name: ${template.name}`);
        break;
      }

      case 'list-templates': {
        const templates = manager.listTemplates();
        console.log(
          `${COLORS.CYAN}Templates (${templates.length})${COLORS.RESET}\n`
        );
        templates.forEach((tpl) => {
          console.log(`  ${COLORS.BOLD}${tpl.name}${COLORS.RESET}`);
          console.log(`    ID: ${tpl.id}`);
          console.log(`    Author: ${tpl.author}`);
          console.log(`    Instances: ${tpl.instances}`);
          console.log(`    Created: ${new Date(tpl.created).toLocaleString()}`);
        });
        break;
      }

      case 'list-instances': {
        const instances = manager.listInstances();
        console.log(
          `${COLORS.CYAN}Instances (${instances.length})${COLORS.RESET}\n`
        );
        instances.forEach((inst) => {
          const badge = inst.shared ? `${COLORS.GREEN}[SHARED]${COLORS.RESET} ` : '';
          console.log(`  ${badge}${COLORS.BOLD}${inst.name}${COLORS.RESET}`);
          console.log(`    ID: ${inst.id}`);
          console.log(`    Author: ${inst.author}`);
          console.log(`    Created: ${new Date(inst.created).toLocaleString()}`);
          console.log(`    Template: ${inst.templateId}`);
        });
        break;
      }

      case 'lineage': {
        const cloneId = args[1];
        const tree = manager.getLineageTree(cloneId);
        console.log(
          `${COLORS.CYAN}Lineage for ${cloneId}${COLORS.RESET}\n`
        );
        console.log('History:');
        tree.history.forEach((entry) => {
          console.log(
            `  ${entry.operation.padEnd(10)} | ${new Date(entry.timestamp).toLocaleString()}`
          );
        });
        if (tree.descendants.length > 0) {
          console.log('\nDescendants:');
          tree.descendants.forEach((desc) => {
            console.log(`  - ${desc}`);
          });
        }
        break;
      }

      case 'version': {
        const cloneId = args[1];
        const label = args[2];

        const version = manager.versionClone(cloneId, label);
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Version created: ${COLORS.CYAN}${version.id}${COLORS.RESET}`
        );
        console.log(`  Clone: ${cloneId}`);
        console.log(`  Label: ${version.label}`);
        break;
      }

      case 'export': {
        const cloneId = args[1];
        const format = args[2] || 'json';

        const exported = manager.exportClone(cloneId, format);
        console.log(exported);
        break;
      }

      case 'import': {
        const filePath = args[1];
        if (!fs.existsSync(filePath)) {
          console.error(
            `${COLORS.RED}Error: file not found: ${filePath}${COLORS.RESET}`
          );
          process.exit(1);
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const clone = manager.importClone(data, { author: 'CLI' });
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Clone imported: ${COLORS.CYAN}${clone.id}${COLORS.RESET}`
        );
        break;
      }

      case 'stats': {
        const stats = manager.getStats();
        console.log(`${COLORS.CYAN}Agent Clone Statistics${COLORS.RESET}\n`);
        console.log(`  Templates: ${stats.templates}`);
        console.log(`  Instances: ${stats.instances}`);
        console.log(`  Shared: ${stats.shared}`);
        console.log(`  Shared instances: ${stats.sharedInstances}`);
        console.log(`  Versions: ${stats.versions}`);
        console.log(`  Lineage entries: ${stats.lineageEntries}`);
        break;
      }

      default:
        console.log(`
${COLORS.BOLD}Agent Cloning System${COLORS.RESET}

${COLORS.BOLD}Commands:${COLORS.RESET}

  create-template <name> [author] [config]
    Create a template from a config

  clone <templateId> <cloneName> [author] [overrides]
    Clone agent from template with custom overrides

  variant <sourceCloneId> <variantName> [author] [customization]
    Create variant from existing clone

  share <cloneId> <recipients>
    Share clone with team members (comma-separated)

  save-template <cloneId> <templateName>
    Save clone as new reusable template

  list-templates
    List all available templates

  list-instances
    List all clones/instances

  lineage <cloneId>
    Show lineage tree and descendants

  version <cloneId> <label>
    Create versioned snapshot of clone

  export <cloneId> [format]
    Export clone (json, yaml)

  import <filePath>
    Import clone from export file

  stats
    Show clone statistics

${COLORS.BOLD}Example:${COLORS.RESET}

  node agent-cloning.js create-template "DataAnalyzer" "tushar" '{"name":"DataAnalyzer","model":"opus"}'
  node agent-cloning.js clone tpl-abc123 "MyAnalyzer" tushar '{"temperature":0.5}'
  node agent-cloning.js variant clone-def456 "HighCreative" tushar '{"temperature":1.5}'
  node agent-cloning.js share clone-def456 "team@example.com,dev@example.com"
  node agent-cloning.js lineage clone-def456
  node agent-cloning.js version clone-def456 "v1.0-production"
  node agent-cloning.js export clone-def456 json
        `);
        break;
    }
  } catch (error) {
    console.error(
      `${COLORS.RED}Error: ${error.message}${COLORS.RESET}`
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  AgentCloneManager,
  DEFAULT_AGENT_CONFIG,
};
