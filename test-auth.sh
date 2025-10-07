#!/bin/bash

# Script de test de l'authentification
# Usage: ./test-auth.sh

set -e

API_URL="http://localhost:8080"
USERNAME="admin"
PASSWORD="password"

echo "=========================================="
echo "Test de l'authentification - Application de gestion des fraudes"
echo "=========================================="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Login avec credentials valides
echo -e "${YELLOW}Test 1: Login avec credentials valides${NC}"
RESPONSE=$(curl -s -X POST ${API_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}")

if echo "$RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ Login réussi${NC}"
    TOKEN=$(echo $RESPONSE | jq -r '.data.token')
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}✗ Login échoué${NC}"
    echo "Response: $RESPONSE"
    exit 1
fi
echo ""

# Test 2: Login avec credentials invalides
echo -e "${YELLOW}Test 2: Login avec credentials invalides${NC}"
RESPONSE=$(curl -s -X POST ${API_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrongpassword"}')

if echo "$RESPONSE" | grep -q "success.*false"; then
    echo -e "${GREEN}✓ Rejet des credentials invalides${NC}"
else
    echo -e "${RED}✗ Les credentials invalides ont été acceptés${NC}"
fi
echo ""

# Test 3: Accès à un endpoint protégé avec token
echo -e "${YELLOW}Test 3: Accès à /api/users avec token${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${API_URL}/api/users \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Accès autorisé (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Accès refusé (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 4: Accès à un endpoint protégé sans token
echo -e "${YELLOW}Test 4: Accès à /api/users sans token${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${API_URL}/api/users)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✓ Accès refusé comme attendu (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Accès autorisé alors qu'il devrait être refusé (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 5: Accès à un endpoint protégé avec token invalide
echo -e "${YELLOW}Test 5: Accès à /api/users avec token invalide${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${API_URL}/api/users \
  -H "Authorization: Bearer invalid-token-here")

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✓ Token invalide rejeté (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Token invalide accepté (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 6: Accès aux rôles
echo -e "${YELLOW}Test 6: Accès à /api/roles avec token${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${API_URL}/api/roles \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Accès aux rôles autorisé (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Accès aux rôles refusé (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 7: Accès aux alertes
echo -e "${YELLOW}Test 7: Accès à /api/alerts avec token${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${API_URL}/api/alerts \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Accès aux alertes autorisé (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠ Accès aux alertes refusé (HTTP $HTTP_CODE) - Service peut-être non démarré${NC}"
fi
echo ""

# Test 8: Endpoint public /api/auth/login accessible sans token
echo -e "${YELLOW}Test 8: Endpoint public /api/auth/login accessible${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST ${API_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}')

if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Endpoint public accessible (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Endpoint public non accessible (HTTP $HTTP_CODE)${NC}"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Tests terminés !${NC}"
echo "=========================================="
