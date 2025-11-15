#!/usr/bin/env node

/**
 * Publish script that automatically increments version and publishes to npm
 * Usage:
 *   npm run release          - Bumps patch version (0.1.0 -> 0.1.1)
 *   npm run release patch    - Bumps patch version (0.1.0 -> 0.1.1)
 *   npm run release minor    - Bumps minor version (0.1.0 -> 0.2.0)
 *   npm run release major    - Bumps major version (0.1.0 -> 1.0.0)
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
  console.error('Usage: npm run release [patch|minor|major]');
  process.exit(1);
}

const packageJsonPath = join(rootDir, 'package.json');
let packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
let currentVersion = packageJson.version;
let versionBumped = false;
let newVersion = currentVersion;

// Check if version already exists on npm
function checkVersionExists(version) {
  try {
    execSync(`npm view @jasonbyrne/dry-types@${version} version`, {
      stdio: 'pipe',
      cwd: rootDir,
    });
    return true;
  } catch {
    return false;
  }
}

// Get the latest published version from npm
function getLatestPublishedVersion() {
  try {
    const result = execSync('npm view @jasonbyrne/dry-types version', {
      stdio: 'pipe',
      cwd: rootDir,
      encoding: 'utf8',
    });
    return result.trim();
  } catch {
    return null;
  }
}

try {
  console.log(`📦 Current version: ${currentVersion}`);
  
  // Check what's already published
  const latestPublished = getLatestPublishedVersion();
  if (latestPublished) {
    console.log(`📡 Latest published version on npm: ${latestPublished}`);
    
    // If current version is older than published, we need to bump from published version
    if (latestPublished !== currentVersion) {
      const [pubMajor, pubMinor, pubPatch] = latestPublished.split('.').map(Number);
      const [currMajor, currMinor, currPatch] = currentVersion.split('.').map(Number);
      
      // Compare versions
      const publishedIsNewer = 
        pubMajor > currMajor ||
        (pubMajor === currMajor && pubMinor > currMinor) ||
        (pubMajor === currMajor && pubMinor === currMinor && pubPatch > currPatch);
      
      if (publishedIsNewer) {
        console.log(`⚠️  Published version (${latestPublished}) is newer than current (${currentVersion})`);
        console.log(`   Updating package.json to match published version...`);
        packageJson.version = latestPublished;
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
        // Re-read with updated version
        packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        currentVersion = latestPublished;
      }
    }
  }

  console.log(`🚀 Bumping ${versionType} version...`);

  // Run tests first
  console.log('\n🧪 Running tests...');
  execSync('npm test', { stdio: 'inherit', cwd: rootDir });

  // Build the package
  console.log('\n🔨 Building package...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  // Calculate what the new version will be
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  let nextVersion;
  if (versionType === 'major') {
    nextVersion = `${major + 1}.0.0`;
  } else if (versionType === 'minor') {
    nextVersion = `${major}.${minor + 1}.0`;
  } else {
    nextVersion = `${major}.${minor}.${patch + 1}`;
  }

  // Check if the next version already exists
  if (checkVersionExists(nextVersion)) {
    console.error(`\n❌ Version ${nextVersion} already exists on npm!`);
    console.error('   Please manually set a different version in package.json');
    process.exit(1);
  }

  // Bump version
  console.log(`\n📝 Bumping version (${versionType})...`);
  execSync(`npm version ${versionType} --no-git-tag-version`, {
    stdio: 'inherit',
    cwd: rootDir,
  });

  // Read new version
  packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  newVersion = packageJson.version;
  versionBumped = true;

  console.log(`\n✅ Version bumped: ${currentVersion} -> ${newVersion}`);

  // Publish to npm (use --access=public for scoped packages)
  console.log(`\n📤 Publishing ${newVersion} to npm...`);
  execSync('npm publish --access=public', { stdio: 'inherit', cwd: rootDir });

  console.log(`\n🎉 Successfully published @jasonbyrne/dry-types@${newVersion} to npm!`);

} catch (error) {
  console.error('\n❌ Error during publish:', error.message);
  
  // Revert version bump if publish failed
  if (versionBumped) {
    console.log(`\n🔄 Reverting version back to ${currentVersion}...`);
    packageJson.version = currentVersion;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    console.log(`✅ Version reverted to ${currentVersion}`);
  }
  
  process.exit(1);
}

