#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_ROOT = path.resolve(__dirname, '..');
const LANGUAGES = ['fr', 'de', 'es', 'nl'];

const TARGETS = [
  'commands',
  'agents/roles',
  'agents/specialists',
  'personas',
  'rules/common',
  'rules/language-specific'
];

function printUsage() {
  console.log(`
Claudient Translation Engine (Gemini Powered)

Usage:
  node scripts/translate-assets.js [options]

Options:
  --limit <number>   Stop after translating <number> files (default: 5)
  --lang <lang>      Only translate into a specific language (fr, de, es, nl)
  --dry-run          Only scan and show what needs to be translated (no API calls)
  --force            Translate even if the target file already exists
  --help             Show help
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    limit: 5,
    lang: null,
    dryRun: false,
    force: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[++i], 10);
    } else if (args[i] === '--lang' && args[i + 1]) {
      options.lang = args[++i];
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--force') {
      options.force = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      printUsage();
      process.exit(0);
    }
  }

  if (options.lang && !LANGUAGES.includes(options.lang)) {
    console.error(`Error: Unsupported language "${options.lang}". Supported: ${LANGUAGES.join(', ')}`);
    process.exit(1);
  }

  return options;
}

function scanForTranslations(dir, relativeDir = '') {
  const absoluteDir = path.join(dir, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];

  let results = [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = path.join(relativeDir, entry.name);
    const segments = relPath.split(path.sep);
    const containsLang = segments.some(seg => LANGUAGES.includes(seg));
    if (containsLang) continue;

    if (entry.isDirectory()) {
      results = results.concat(scanForTranslations(dir, relPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push({
        baseDir: dir,
        relativeFilePath: relPath,
        absolutePath: path.join(absoluteDir, entry.name)
      });
    }
  }
  return results;
}

function callGemini(apiKey, systemInstruction, promptText) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{
        parts: [{ text: promptText }]
      }],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.1
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`Gemini API error (${res.statusCode}): ${body}`));
          return;
        }
        try {
          const json = JSON.parse(body);
          if (
            json.candidates &&
            json.candidates[0] &&
            json.candidates[0].content &&
            json.candidates[0].content.parts &&
            json.candidates[0].content.parts[0]
          ) {
            resolve(json.candidates[0].content.parts[0].text);
          } else {
            reject(new Error(`Unexpected Gemini response structure: ${body}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function main() {
  const options = parseArgs();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey && !options.dryRun) {
    console.error(`Error: GEMINI_API_KEY or GOOGLE_API_KEY environment variable is not set.
Please set it to run translations, or use --dry-run.

Example:
  export GEMINI_API_KEY="AIzaSy..."
  node scripts/translate-assets.js`);
    process.exit(1);
  }

  console.log('Scanning files for missing translations...');
  let sourceFiles = [];
  for (const t of TARGETS) {
    const srcDir = path.join(REPO_ROOT, t);
    const files = scanForTranslations(srcDir);
    sourceFiles = sourceFiles.concat(files);
  }

  console.log(`Found ${sourceFiles.length} source markdown documents.`);

  const queue = [];
  const activeLangs = options.lang ? [options.lang] : LANGUAGES;

  for (const f of sourceFiles) {
    for (const lang of activeLangs) {
      const relDir = path.dirname(f.relativeFilePath);
      const baseName = path.basename(f.relativeFilePath);
      const destRelPath = path.join(relDir, lang, baseName);
      const destAbsPath = path.join(f.baseDir, destRelPath);

      const exists = fs.existsSync(destAbsPath);
      if (!exists || options.force) {
        queue.push({
          sourcePath: f.absolutePath,
          destPath: destAbsPath,
          lang,
          relPath: path.join(path.basename(f.baseDir), destRelPath)
        });
      }
    }
  }

  console.log(`Pending translations count: ${queue.length}`);

  if (queue.length === 0) {
    console.log('Everything is up to date!');
    return;
  }

  if (options.dryRun) {
    console.log('\n--- DRY RUN ---');
    console.log(`Queue limit set to: ${options.limit}`);
    const preview = queue.slice(0, options.limit);
    for (const item of preview) {
      console.log(`[DRY] Would translate: ${path.basename(item.sourcePath)} -> ${item.relPath}`);
    }
    if (queue.length > options.limit) {
      console.log(`... and ${queue.length - options.limit} more items.`);
    }
    return;
  }

  console.log(`\nBeginning translation process (Limit: ${options.limit} files)...`);
  const activeQueue = queue.slice(0, options.limit);
  let successCount = 0;

  for (let i = 0; i < activeQueue.length; i++) {
    const item = activeQueue[i];
    console.log(`[${i + 1}/${activeQueue.length}] Translating (${item.lang}): ${path.basename(item.sourcePath)} -> ${item.relPath}`);

    try {
      const content = fs.readFileSync(item.sourcePath, 'utf-8');
      
      const systemInstruction = `You are a professional software documentation translator.
Translate the provided markdown file into the target language code: "${item.lang}".

Follow these strict rules:
1. Translate all text sections, descriptions, and lists accurately into the target language.
2. Keep YAML frontmatter structure intact. Translate only the values, NOT the keys (e.g. translate the description text, but keep the key as "description:").
3. Do NOT translate code inside markdown code blocks (e.g. \`\`\`bash ... \`\`\`), shell command strings, filenames, URL links, or variable names.
4. Return ONLY the translated markdown file. Do NOT include any introductory or concluding remarks.`;

      const result = await callGemini(apiKey, systemInstruction, content);

      // Clean up markdown wrapper blocks from model output if returned
      let cleanedResult = result.trim();
      if (cleanedResult.startsWith('```markdown')) {
        cleanedResult = cleanedResult.substring(11);
        if (cleanedResult.endsWith('```')) {
          cleanedResult = cleanedResult.substring(0, cleanedResult.length - 3);
        }
      } else if (cleanedResult.startsWith('```') && cleanedResult.endsWith('```')) {
        cleanedResult = cleanedResult.substring(3, cleanedResult.length - 3);
      }
      cleanedResult = cleanedResult.trim();

      // Ensure destination directory exists
      fs.mkdirSync(path.dirname(item.destPath), { recursive: true });
      fs.writeFileSync(item.destPath, cleanedResult, 'utf-8');
      console.log(`  ✓ Saved.`);
      successCount++;
      
      if (i < activeQueue.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    } catch (error) {
      console.error(`  ✗ Error translating file: ${error.message}`);
    }
  }

  console.log(`\nFinished. Translated ${successCount}/${activeQueue.length} files successfully.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
