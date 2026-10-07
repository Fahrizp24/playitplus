#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Extensions to check
const VALID_EXTENSIONS = new Set(['.tsx', '.jsx', '.ts', '.js', '.html', '.vue', '.svelte']);

// Directories to ignore
const IGNORED_DIRS = new Set([
  'node_modules',
  '.next',
  '.agents',
  'dist',
  'build',
  'public',
  'scripts',
  '.git',
  '.husky',
]);

// Regex to detect built-in Tailwind numeric scale at desktop breakpoints (lg, xl, 2xl)
// Desktop layer MUST use arbitrary px (e.g. lg:p-[20px], lg:gap-[32px])
const DESKTOP_NUMERIC_SCALE_REGEX =
  /(?<![\w-])(?:(?:\w+:)*(?:lg|xl|2xl)(?::\w+)*):(?:(?:gap|gap-x|gap-y|space-x|space-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|w|min-w|min-h|max-w|h|size|basis|top|right|bottom|left|inset|leading|tracking)-(?![0-9]+\/)[0-9]+|text-(?:xs|sm|base|lg|xl|[0-9]+xl))/g;

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of list) {
    if (IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (VALID_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function validateFiles() {
  console.log('\n🔍 [Validation] Memeriksa kepatuhan arbitrary px pada breakpoint desktop (lg, xl, 2xl)...');

  const files = getFiles(projectRoot);
  let totalViolations = 0;
  const violationReports = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
      // Skip commented lines
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        return;
      }

      DESKTOP_NUMERIC_SCALE_REGEX.lastIndex = 0;
      const matches = [...line.matchAll(DESKTOP_NUMERIC_SCALE_REGEX)];

      if (matches.length > 0) {
        const relativeFilePath = path.relative(projectRoot, filePath);
        const invalidClasses = matches.map((m) => m[0]);
        totalViolations += invalidClasses.length;

        violationReports.push({
          file: relativeFilePath,
          line: lineIndex + 1,
          classes: invalidClasses,
          codeSnippet: trimmed,
        });
      }
    });
  }

  if (totalViolations > 0) {
    console.error('\n❌ [ERROR] Ditemukan kelas Tailwind desktop (lg, xl, 2xl) yang TIDAK menggunakan arbitrary px!\n');
    console.error('Sesuai aturan postcss-px-viewport (Rule A):');
    console.error(
      'Nilai spacing, sizing, dan typography pada desktop (lg, xl, 2xl) HARUS menggunakan arbitrary px (misal: lg:p-[40px], lg:gap-[32px], lg:text-[24px]).'
    );
    console.error(
      'Penggunaan numeric scale (seperti lg:p-4, lg:gap-6, lg:text-base) menggunakan unit rem bawaan yang tidak terkonversi ke vw, sehingga merusak proporsi tampilan desktop.\n'
    );

    for (const report of violationReports) {
      console.error(`  📄 ${report.file}:${report.line}`);
      console.error(`     Kelas bermasalah: ${report.classes.join(', ')}`);
      console.error(`     Kode            : ${report.codeSnippet}`);
      console.error('');
    }

    console.error(`Total pelanggaran: ${totalViolations}`);
    console.error('Silakan perbaiki kelas-kelas di atas sebelum melakukan push ke remote.\n');
    process.exit(1);
  }

  console.log('✅ [SUCCESS] Semua kelas Tailwind pada desktop breakpoint (lg, xl, 2xl) valid & sesuai aturan viewport scaling.\n');
  process.exit(0);
}

validateFiles();
