#!/bin/bash

# Performance Test Script for SKU Filters
# Measures API response times under various loads

BASE_URL="http://localhost:3001"
API_URL="$BASE_URL/api/admin/skus"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get admin session cookie
curl -s -c /tmp/muzaready_cookies.txt \
    -X POST "$BASE_URL/api/admin/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@muzahair.cz","password":"admin123"}' > /dev/null

# Function to measure response time
measure_time() {
    local endpoint="$1"
    local description="$2"

    # Use Python for millisecond timing (macOS date doesn't support %3N)
    local start=$(python3 -c 'import time; print(int(time.time() * 1000))')
    local response=$(curl -s -b /tmp/muzaready_cookies.txt "$API_URL$endpoint")
    local end=$(python3 -c 'import time; print(int(time.time() * 1000))')
    local duration=$((end - start))

    # Extract count
    local count=$(echo "$response" | grep -o '"total":[0-9]*' | cut -d: -f2)

    echo -e "$description"
    echo "  Response time: ${YELLOW}${duration}ms${NC}"
    echo "  Results: $count SKUs"
    echo ""
}

echo "=================================================="
echo "SKU FILTER PERFORMANCE TEST"
echo "=================================================="
echo ""

measure_time "" "Baseline (no filters)"
measure_time "?search=VLASY" "Search filter"
measure_time "?shades=4,5,6&lengths=60,70" "Multiple filters"
measure_time "?stockStatus=IN_STOCK" "Stock status filter"
measure_time "?search=VLASY&shades=4&lengths=60&stockStatus=IN_STOCK&saleModes=PIECE_BY_WEIGHT&categories=PLATINUM_EDITION" "All filters combined"

echo "=================================================="
echo "Average response time should be < 500ms"
echo "=================================================="
