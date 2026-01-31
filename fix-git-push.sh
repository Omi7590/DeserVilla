#!/bin/bash

echo "🔧 Fixing Git repository..."

# Remove sensitive files from git cache
git rm --cached import-database.js 2>/dev/null || true
git rm --cached cafe_ordering.sql 2>/dev/null || true
git rm --cached cafe_ordering_clean.sql 2>/dev/null || true
git rm --cached backend/.env 2>/dev/null || true
git rm --cached frontend/.env 2>/dev/null || true

# Add .gitignore
git add .gitignore

# Commit changes
git add .
git commit -m "Remove sensitive files and add .gitignore"

echo "✅ Done! Now you can push:"
echo "   git push -u origin main"
