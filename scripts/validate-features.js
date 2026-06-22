#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Feature Validation Script
 * Validates feature-presence.txt and associated file references
 */

const PRESENCE_FILE = 'feature-presence.txt';
const INVENTORY_FILE = 'feature-inventory.txt';

class FeatureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      total: 0,
      present: 0,
      missing: 0,
      deprecated: 0,
      byCategory: {}
    };
  }

  validate() {
    console.log('🔍 Starting feature validation...\n');

    this.validatePresenceFile();
    this.validateInventoryFile();
    this.validateFileReferences();
    this.validateConsistency();
    this.validateCompleteness();

    this.printResults();
    return this.errors.length === 0;
  }

  validatePresenceFile() {
    console.log('📋 Validating feature-presence.txt...');

    if (!fs.existsSync(PRESENCE_FILE)) {
      this.errors.push(`${PRESENCE_FILE} not found`);
      return;
    }

    const content = fs.readFileSync(PRESENCE_FILE, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    if (lines.length === 0) {
      this.errors.push(`${PRESENCE_FILE} is empty`);
      return;
    }

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const parts = line.split('|').map(p => p.trim());

      if (parts.length < 5) {
        this.errors.push(`Line ${lineNum}: Expected 5+ fields, got ${parts.length}`);
        return;
      }

      const [id, category, name, status, files] = parts;

      // Validate status
      if (!['PRESENT', 'MISSING', 'DEPRECATED'].includes(status)) {
        this.errors.push(`Line ${lineNum}: Invalid status "${status}"`);
      }

      // Validate non-empty fields
      if (!id || !category || !name) {
        this.errors.push(`Line ${lineNum}: Missing required fields (id, category, name)`);
      }

      // Track stats
      this.stats.total++;
      this.stats[status.toLowerCase()]++;
      if (!this.stats.byCategory[category]) {
        this.stats.byCategory[category] = { present: 0, missing: 0, deprecated: 0 };
      }
      this.stats.byCategory[category][status.toLowerCase()]++;
    });

    console.log(`  ✓ ${lines.length} features found\n`);
  }

  validateInventoryFile() {
    console.log('📊 Validating feature-inventory.txt...');

    if (!fs.existsSync(INVENTORY_FILE)) {
      this.warnings.push(`${INVENTORY_FILE} not found`);
      return;
    }

    const content = fs.readFileSync(INVENTORY_FILE, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    lines.forEach((line, idx) => {
      const parts = line.split('|');
      if (parts.length < 4) {
        this.errors.push(`inventory.txt Line ${idx + 1}: Expected 4+ fields, got ${parts.length}`);
      }
    });

    console.log(`  ✓ ${lines.length} inventory entries found\n`);
  }

  validateFileReferences() {
    console.log('🔗 Validating file references...');

    const content = fs.readFileSync(PRESENCE_FILE, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    let missingFiles = [];

    lines.forEach((line, idx) => {
      const parts = line.split('|');
      if (parts[4]) {
        const files = parts[4].split(',').map(f => f.trim());
        files.forEach(file => {
          if (file && !fs.existsSync(file)) {
            missingFiles.push(`Line ${idx + 1}: ${file}`);
          }
        });
      }
    });

    if (missingFiles.length > 0) {
      missingFiles.forEach(f => this.errors.push(`Missing file: ${f}`));
    } else {
      console.log('  ✓ All file references valid\n');
    }
  }

  validateConsistency() {
    console.log('🔄 Validating consistency...');

    const presenceLines = fs.readFileSync(PRESENCE_FILE, 'utf-8').split('\n').filter(l => l.trim()).length;
    const inventoryLines = fs.existsSync(INVENTORY_FILE)
      ? fs.readFileSync(INVENTORY_FILE, 'utf-8').split('\n').filter(l => l.trim()).length
      : 0;

    if (presenceLines !== inventoryLines && inventoryLines > 0) {
      this.warnings.push(`Presence (${presenceLines}) and inventory (${inventoryLines}) have different line counts`);
    } else {
      console.log(`  ✓ Presence and inventory consistent (${presenceLines} entries)\n`);
    }
  }

  validateCompleteness() {
    console.log('✅ Validating completeness...');

    if (this.stats.missing > 0) {
      this.warnings.push(`${this.stats.missing} features marked MISSING`);
    }

    if (this.stats.deprecated > 0) {
      this.warnings.push(`${this.stats.deprecated} features marked DEPRECATED`);
    }

    console.log(`  ✓ Total: ${this.stats.total} | Present: ${this.stats.present} | Missing: ${this.stats.missing} | Deprecated: ${this.stats.deprecated}\n`);
  }

  printResults() {
    console.log('\n📈 Feature Audit Summary\n');
    console.log('By Category:');
    Object.entries(this.stats.byCategory).forEach(([cat, stats]) => {
      const total = stats.present + stats.missing + stats.deprecated;
      console.log(`  ${cat.padEnd(20)} ${stats.present}P/${stats.missing}M/${stats.deprecated}D (${total})`);
    });

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(w => console.log(`  - ${w}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(e => console.log(`  - ${e}`));
    } else {
      console.log('\n✨ All validations passed!');
    }
  }
}

const validator = new FeatureValidator();
const success = validator.validate();
process.exit(success ? 0 : 1);
