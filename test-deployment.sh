#!/bin/bash

# Test Deployment Health Checks
# Usage: ./test-deployment.sh <bypass-token>

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Bypass token required"
  echo ""
  echo "Usage: ./test-deployment.sh <bypass-token>"
  echo ""
  echo "Get your token from:"
  echo "https://vercel.com/annamontana1s-projects/muzaready-bahy/settings/deployment-protection"
  exit 1
fi

BYPASS_TOKEN="$1"
PROD_URL="https://muzaready-bahy.vercel.app"

echo "========================================"
echo "Testing muzaready-bahy Deployment"
echo "========================================"
echo ""

# Test /api/ok
echo "1️⃣  Testing /api/ok"
echo "---"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -H "x-vercel-protection-bypass: $BYPASS_TOKEN" \
  "$PROD_URL/api/ok")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Response: $BODY"
echo "Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: /api/ok returned 200"
else
  echo "❌ FAIL: /api/ok returned $HTTP_STATUS (expected 200)"
fi
echo ""

# Test /api/health
echo "2️⃣  Testing /api/health"
echo "---"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -H "x-vercel-protection-bypass: $BYPASS_TOKEN" \
  "$PROD_URL/api/health")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Response: $BODY"
echo "Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: /api/health returned 200 (Database UP)"
elif [ "$HTTP_STATUS" = "500" ]; then
  echo "⚠️  WARNING: /api/health returned 500 (Database DOWN or connection issue)"
  echo "Check response above for error details"
else
  echo "❌ FAIL: /api/health returned $HTTP_STATUS (expected 200 or 500)"
fi
echo ""

# Test /api/ping
echo "3️⃣  Testing /api/ping"
echo "---"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -H "x-vercel-protection-bypass: $BYPASS_TOKEN" \
  "$PROD_URL/api/ping")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Response: $BODY"
echo "Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: /api/ping returned 200"
else
  echo "❌ FAIL: /api/ping returned $HTTP_STATUS (expected 200)"
fi
echo ""

echo "========================================"
echo "Test Complete"
echo "========================================"
