#!/usr/bin/env node

/**
 * Publish script that automatically increments version and publishes to npm
 * Usage:
 *   npm run publish          - Bumps patch version (0.1.0 -> 0.1.1)
 *   npm run publish patch    - Bumps patch version (0.1.0 -> 0.1.1)
 *   npm run publish minor    - Bumps minor version (0.1.0 -> 0.2.0)
 *   npm run publish major    - Bumps major version (0.1.0 -> 1.0.0)
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Get version type from command line args (default to 'patch')
const versionType = process.argv[2] || 'patch';

// Validate version type
if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error(`❌ Invalid version type: ${versionType}`);
  console.error('Usage: npm run publish [patch|minor|major]');
  process.exit(1);
}

try {
  // Read current package.json
  const packageJsonPath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const currentVersion = packageJson.version;

  console.log(`📦 Current version: ${currentVersion}`);
  console.log(`🚀 Bumping ${versionType} version...`);

  // Run tests first
  console.log('\n🧪 Running tests...');
  execSync('npm test', { stdio: 'inherit', cwd: rootDir });

  // Build the package
  console.log('\n🔨 Building package...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  // Bump version (this also creates a git commit and tag)
  console.log(`\n📝 Bumping version (${versionType})...`);
  execSync(`npm version ${versionType} --no-git-tag-version`, {
    stdio: 'inherit',
    cwd: rootDir,
  });

  // Read new version
  const updatedPackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const newVersion = updatedPackageJson.version;

  console.log(`\n✅ Version bumped: ${currentVersion} -> ${newVersion}`);

  // Publish to npm
  console.log(`\n📤 Publishing ${newVersion} to npm...`);
  execSync('npm publish', { stdio: 'inherit', cwd: rootDir });

  console.log(`\n🎉 Successfully published dry-types@${newVersion} to npm!`);

} catch (error) {
  console.error('\n❌ Error during publish:', error.message);
  process.exit(1);
}

