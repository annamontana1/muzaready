#!/bin/bash

# Vercel Deployment Verification Script
# Run this after merging PR to main

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================="
echo "Vercel Deployment Verification"
echo "======================================="
echo ""

# Check if domain is provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage: ./verify-deployment.sh https://your-domain.vercel.app${NC}"
  echo ""
  echo "Example:"
  echo "  ./verify-deployment.sh https://muzaready.vercel.app"
  exit 1
fi

DOMAIN=$1

echo "Testing domain: $DOMAIN"
echo ""

# Test /api/ok
echo "1. Testing /api/ok (smoke test)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/ok")
if [ "$STATUS" -eq 200 ]; then
  RESPONSE=$(curl -s "$DOMAIN/api/ok")
  if [ "$RESPONSE" = '{"ok":true}' ]; then
    echo -e "${GREEN}✓ PASS${NC} - /api/ok returned 200 with correct response"
  else
    echo -e "${RED}✗ FAIL${NC} - /api/ok returned 200 but incorrect response: $RESPONSE"
    exit 1
  fi
else
  echo -e "${RED}✗ FAIL${NC} - /api/ok returned $STATUS (expected 200)"
  exit 1
fi

echo ""

# Test /api/health
echo "2. Testing /api/health (database check)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/health")
if [ "$STATUS" -eq 200 ]; then
  RESPONSE=$(curl -s "$DOMAIN/api/health")
  echo -e "${GREEN}✓ PASS${NC} - /api/health returned 200"
  echo "   Response: $RESPONSE"
elif [ "$STATUS" -eq 500 ]; then
  RESPONSE=$(curl -s "$DOMAIN/api/health")
  echo -e "${YELLOW}⚠ WARN${NC} - /api/health returned 500 (database connection issue)"
  echo "   Response: $RESPONSE"
  echo "   This is expected if DATABASE_URL is not configured in Vercel"
else
  echo -e "${RED}✗ FAIL${NC} - /api/health returned $STATUS (expected 200 or 500, NOT 404)"
  exit 1
fi

echo ""

# Test existing API route
echo "3. Testing /api/ping (existing route)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/ping")
if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 500 ]; then
  echo -e "${GREEN}✓ PASS${NC} - /api/ping is accessible (status: $STATUS)"
else
  echo -e "${RED}✗ FAIL${NC} - /api/ping returned $STATUS (expected 200/500, NOT 404)"
  exit 1
fi

echo ""
echo "======================================="
echo -e "${GREEN}All tests passed!${NC}"
echo "======================================="
echo ""
echo "Next steps:"
echo "1. Check Vercel Runtime Logs for any 404 errors"
echo "2. Test other critical API endpoints:"
echo "   - $DOMAIN/api/catalog"
echo "   - $DOMAIN/api/sku/public/[id]"
echo "   - $DOMAIN/api/orders"
echo ""
echo "If you see 500 on /api/health, add DATABASE_URL:"
echo "  Vercel Dashboard → Settings → Environment Variables"
echo ""
