#!/bin/bash

# SKU Filter Integration Test Script
# Tests all filter combinations against the live API

BASE_URL="http://localhost:3001"
API_URL="$BASE_URL/api/admin/skus"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Function to print test result
print_result() {
    local test_name="$1"
    local status="$2"
    local details="$3"

    TESTS_TOTAL=$((TESTS_TOTAL + 1))

    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✓${NC} $test_name"
        [ -n "$details" ] && echo "  $details"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗${NC} $test_name"
        [ -n "$details" ] && echo "  $details"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Function to get admin session cookie
get_admin_session() {
    # Login to get session cookie
    local response=$(curl -s -c /tmp/muzaready_cookies.txt \
        -X POST "$BASE_URL/api/admin/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@muzahair.cz","password":"admin123"}')

    if echo "$response" | grep -q "success"; then
        echo "✓ Admin login successful"
        return 0
    else
        echo "✗ Admin login failed: $response"
        return 1
    fi
}

# Function to make authenticated API call
api_call() {
    local endpoint="$1"
    curl -s -b /tmp/muzaready_cookies.txt "$API_URL$endpoint"
}

# Function to test filter response
test_filter() {
    local test_name="$1"
    local query="$2"
    local expected_check="$3"

    local response=$(api_call "$query")

    if echo "$response" | grep -q "$expected_check"; then
        print_result "$test_name" "PASS" "Query: $query"
        echo "$response" | head -c 200
        echo ""
        return 0
    else
        print_result "$test_name" "FAIL" "Expected: $expected_check, Got: $(echo $response | head -c 200)"
        return 1
    fi
}

echo "=================================================="
echo "SKU FILTER INTEGRATION TEST"
echo "=================================================="
echo ""

# Step 1: Login
echo "Step 1: Authentication"
echo "-----------------------------------"
if ! get_admin_session; then
    echo "FATAL: Cannot proceed without admin session"
    exit 1
fi
echo ""

# Step 2: Test basic API call
echo "Step 2: Basic API Call (No Filters)"
echo "-----------------------------------"
response=$(api_call "")
if echo "$response" | grep -q '"skus"'; then
    print_result "Basic API call" "PASS" "Response contains 'skus' array"
else
    print_result "Basic API call" "FAIL" "Response: $(echo $response | head -c 200)"
fi
echo ""

# Step 3: Test pagination
echo "Step 3: Pagination Tests"
echo "-----------------------------------"
test_filter "Pagination - Page 1" "?page=1&limit=25" '"page":1'
test_filter "Pagination - Page 2" "?page=2&limit=25" '"page":2'
test_filter "Pagination - Limit 50" "?page=1&limit=50" '"limit":50'
echo ""

# Step 4: Test individual filters
echo "Step 4: Individual Filter Tests"
echo "-----------------------------------"
test_filter "Search filter" "?search=VLASY" '"skus"'
test_filter "Shade filter" "?shades=4" '"skus"'
test_filter "Length filter" "?lengths=60" '"skus"'
test_filter "Stock status IN_STOCK" "?stockStatus=IN_STOCK" '"skus"'
test_filter "Stock status SOLD_OUT" "?stockStatus=SOLD_OUT" '"skus"'
test_filter "Stock status LOW_STOCK" "?stockStatus=LOW_STOCK" '"skus"'
test_filter "Sale mode PIECE" "?saleModes=PIECE_BY_WEIGHT" '"skus"'
test_filter "Sale mode BULK" "?saleModes=BULK_G" '"skus"'
test_filter "Category STANDARD" "?categories=STANDARD" '"skus"'
test_filter "Category LUXE" "?categories=LUXE" '"skus"'
test_filter "Category PLATINUM" "?categories=PLATINUM_EDITION" '"skus"'
echo ""

# Step 5: Test filter combinations
echo "Step 5: Filter Combination Tests"
echo "-----------------------------------"
test_filter "Search + Shade" "?search=VLASY&shades=4" '"skus"'
test_filter "Shade + Length" "?shades=4&lengths=60" '"skus"'
test_filter "Length + Stock" "?lengths=60&stockStatus=IN_STOCK" '"skus"'
test_filter "Multiple shades" "?shades=4,5,6" '"skus"'
test_filter "Multiple lengths" "?lengths=60,70" '"skus"'
test_filter "All filters combined" "?search=VLASY&shades=4&lengths=60&stockStatus=IN_STOCK&saleModes=PIECE_BY_WEIGHT&categories=PLATINUM_EDITION" '"skus"'
echo ""

# Step 6: Test edge cases
echo "Step 6: Edge Case Tests"
echo "-----------------------------------"
test_filter "Invalid shade (filtered out)" "?shades=99" '"skus"'
test_filter "Invalid length (filtered out)" "?lengths=999" '"skus"'
test_filter "Invalid stock status (ignored)" "?stockStatus=INVALID" '"skus"'
test_filter "Empty result scenario" "?search=NONEXISTENT12345" '"skus":\[\]'
test_filter "Special characters in search" "?search=test%40%23" '"skus"'
echo ""

# Step 7: Test URL state persistence
echo "Step 7: URL State Tests"
echo "-----------------------------------"
response=$(api_call "?search=test&shades=4&page=2")
if echo "$response" | grep -q '"appliedFilters"'; then
    print_result "Applied filters returned" "PASS" "Response contains appliedFilters"
else
    print_result "Applied filters returned" "FAIL"
fi
echo ""

# Final Summary
echo "=================================================="
echo "TEST SUMMARY"
echo "=================================================="
echo -e "Total Tests: $TESTS_TOTAL"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    exit 1
fi
