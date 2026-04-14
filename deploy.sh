#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# PRODUCTION
git reset --hard
git checkout master
git pull origin master

npm i
rm -rf dist
npm run build
if pm2 describe CAMERA_UZ >/dev/null 2>&1; then
  pm2 restart CAMERA_UZ --update-env
else
  pm2 start process.config.js --env production
fi

# DEVELOPMENT
# git reset --hard
# git checkout develop
# git pull origin develop
# npm i
# pm2 start "npm run start:dev" --name=CAMERA_UZ
