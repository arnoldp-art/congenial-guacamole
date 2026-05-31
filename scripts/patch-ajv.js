#!/usr/bin/env node
// Patches old ajv-keywords _formatLimit.js files that use ajv._formats,
// an internal API removed in ajv@8. Runs as a postinstall hook.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OLD = 'var formats = ajv._formats;';
const NEW = 'var formats = (ajv._formats || ajv.formats) || {};';

let output;
try {
  output = execSync("find node_modules -path '*/ajv-keywords/keywords/_formatLimit.js'", { encoding: 'utf8' });
} catch (e) {
  process.exit(0);
}

const files = output.trim().split('\n').filter(Boolean);
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes(OLD)) continue;
  fs.writeFileSync(file, content.replace(OLD, NEW));
  console.log('patched:', file);
}
