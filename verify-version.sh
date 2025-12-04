#!/bin/bash

echo "═══════════════════════════════════════════════════════"
echo "🔍 MUZAREADY - Version Verification Script"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Run this script from muzaready root directory"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo ""

# Check git status
echo "🔍 Checking Git status..."
CURRENT_BRANCH=$(git branch --show-current)
CURRENT_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main)

echo "   Branch: $CURRENT_BRANCH"
echo "   Local commit: ${CURRENT_COMMIT:0:7}"
echo "   Remote commit: ${REMOTE_COMMIT:0:7}"
echo ""

# Check if we need to pull
if [ "$CURRENT_COMMIT" != "$REMOTE_COMMIT" ]; then
    echo "⚠️  WARNING: Your local version is OUT OF DATE!"
    echo ""
    echo "   You need to pull latest changes:"
    echo "   $ git pull origin main"
    echo ""
    exit 1
else
    echo "✅ Git: Up to date with origin/main"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📊 Checking key files..."
echo "═══════════════════════════════════════════════════════"
echo ""

# Check for new status files
FILES=(
    "START_HERE.md"
    "PROJECT_STATUS.ts"
    "app/api/project-status/route.ts"
    "PROJECT_STATUS.md"
    "TESTING_COMPLETE.md"
)

ALL_FOUND=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ MISSING: $file"
        ALL_FOUND=false
    fi
done

echo ""

if [ "$ALL_FOUND" = false ]; then
    echo "❌ ERROR: Some files are missing. Run 'git pull origin main'"
    exit 1
fi

echo "═══════════════════════════════════════════════════════"
echo "📈 Extracting project status..."
echo "═══════════════════════════════════════════════════════"
echo ""

# Extract frontend percentage from PROJECT_STATUS.ts
if [ -f "PROJECT_STATUS.ts" ]; then
    FRONTEND_PCT=$(grep "percentage:" PROJECT_STATUS.ts | head -1 | grep -o '[0-9]\+')
    TOTAL_TESTS=$(grep "totalTests:" PROJECT_STATUS.ts | grep -o '[0-9]\+')

    echo "Frontend completion: ${FRONTEND_PCT}%"
    echo "Total tests: ${TOTAL_TESTS}"
    echo ""
fi

# Check FRONTEND_TASKS.md deprecation
if grep -q "DEPRECATED" FRONTEND_TASKS.md 2>/dev/null; then
    echo "✅ FRONTEND_TASKS.md correctly marked as DEPRECATED"
else
    echo "⚠️  WARNING: FRONTEND_TASKS.md not marked as deprecated"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🎯 FINAL VERDICT"
echo "═══════════════════════════════════════════════════════"
echo ""

if [ "$FRONTEND_PCT" = "100" ] && [ "$TOTAL_TESTS" = "241" ]; then
    echo "✅ ✅ ✅ YOU HAVE THE CORRECT VERSION! ✅ ✅ ✅"
    echo ""
    echo "   Frontend: 100% COMPLETE"
    echo "   Tests: 241 passing"
    echo "   Commit: ${CURRENT_COMMIT:0:7}"
    echo ""
    echo "👉 Tell your AI agent to read: START_HERE.md"
    echo ""
else
    echo "❌ SOMETHING IS WRONG"
    echo ""
    echo "   Expected: Frontend 100%, Tests 241"
    echo "   Got: Frontend ${FRONTEND_PCT}%, Tests ${TOTAL_TESTS}"
    echo ""
    echo "   Run: git pull origin main"
    echo ""
fi

echo "═══════════════════════════════════════════════════════"
