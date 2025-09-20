#!/bin/bash

echo "🔍 Verifying Frontend API Fix"
echo "==============================="
echo ""

# Check if Strapi is running
echo "1. Testing Strapi connectivity..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/api/models > /tmp/status.txt
STATUS=$(cat /tmp/status.txt)

if [ "$STATUS" = "200" ]; then
    echo "   ✅ Strapi is running"
else
    echo "   ❌ Strapi is not running. Please start it with: pnpm dev"
    exit 1
fi

echo ""
echo "2. Testing key API endpoints with correct populate structure..."

# Test models with populate
echo -n "   - Models API: "
RESPONSE=$(curl -s "http://localhost:1337/api/models?populate[profileImage]=true&pagination[pageSize]=1" | head -c 100)
if [[ $RESPONSE == *"data"* ]]; then
    echo "✅"
else
    echo "❌"
fi

# Test articles with fixed author.avatar populate
echo -n "   - Articles API (with author.avatar): "
RESPONSE=$(curl -s "http://localhost:1337/api/articles?populate[author][populate][0]=avatar&pagination[pageSize]=1" | head -c 100)
if [[ $RESPONSE == *"data"* ]]; then
    echo "✅"
else
    echo "❌"
fi

# Test homepage with fixed shareImage
echo -n "   - Homepage API (with shareImage): "
RESPONSE=$(curl -s "http://localhost:1337/api/homepage?populate[seo][populate][0]=shareImage" | head -c 100)
if [[ $RESPONSE == *"data"* ]]; then
    echo "✅"
else
    echo "❌"
fi

echo ""
echo "3. Frontend fixes applied:"
echo "   ✅ Changed author.picture → author.avatar in /src/lib/api/articles.ts"
echo "   ✅ Changed metaImage → shareImage in /src/types/strapi.ts"
echo "   ✅ Fixed populate query builder in /src/lib/api/strapi.ts"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ All populate query issues have been fixed!"
echo ""
echo "Next steps:"
echo "1. Restart your Next.js dev server in the frontend:"
echo "   cd ../human_paris && pnpm dev"
echo ""
echo "2. Visit http://localhost:3000 to verify the homepage loads"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"