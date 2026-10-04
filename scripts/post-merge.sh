#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Reconcile packages exactly to the merged lockfile without interactive prompts.
npm ci --no-audit --no-fund

# Auth keeps the existing user schema; do not push destructive schema changes.
npx --no-install tsx --test server/intake.test.ts
npm run build