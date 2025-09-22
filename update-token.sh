#!/bin/bash

echo "🔑 HammerTech MCP Server - Token Update Utility"
echo ""

CONFIG_FILE="/Users/trefgare/Library/Application Support/Claude/claude_desktop_config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Claude Desktop config file not found at: $CONFIG_FILE"
    exit 1
fi

echo "📄 Current configuration found"
echo ""

# Show current token info (last 20 characters for security)
CURRENT_TOKEN=$(grep "HAMMERTECH_JWT_TOKEN" "$CONFIG_FILE" | cut -d'"' -f4)
CURRENT_REGION=$(grep "HAMMERTECH_REGION" "$CONFIG_FILE" | cut -d'"' -f4)

echo "🔍 Current settings:"
echo "   Region: $CURRENT_REGION"
echo "   Token (last 20 chars): ...${CURRENT_TOKEN: -20}"
echo ""

# Get new token
echo "🔑 Enter new JWT token:"
read -r NEW_TOKEN

if [ -z "$NEW_TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

# Get new region
echo ""
echo "🌍 Enter region (us/au/eu) [current: $CURRENT_REGION]:"
read -r NEW_REGION

if [ -z "$NEW_REGION" ]; then
    NEW_REGION="$CURRENT_REGION"
    echo "   Using current region: $NEW_REGION"
fi

# Validate region
if [[ ! "$NEW_REGION" =~ ^(us|au|eu)$ ]]; then
    echo "❌ Invalid region. Must be us, au, or eu"
    exit 1
fi

# Backup current config
cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
echo "💾 Backup created: $CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"

# Update the configuration
sed -i '' "s|\"HAMMERTECH_JWT_TOKEN\": \".*\"|\"HAMMERTECH_JWT_TOKEN\": \"$NEW_TOKEN\"|" "$CONFIG_FILE"
sed -i '' "s|\"HAMMERTECH_REGION\": \".*\"|\"HAMMERTECH_REGION\": \"$NEW_REGION\"|" "$CONFIG_FILE"

echo ""
echo "✅ Configuration updated successfully!"
echo ""
echo "🔍 New settings:"
echo "   Region: $NEW_REGION"
echo "   Token (last 20 chars): ...${NEW_TOKEN: -20}"
echo ""
echo "📝 Next steps:"
echo "   1. Quit Claude Desktop (Cmd+Q)"
echo "   2. Reopen Claude Desktop"
echo "   3. Look for the 🔧 hammer icon"
echo "   4. Test with: 'List HammerTech projects'"
echo ""

# Optional: decode and show token info
echo "🔍 Decoding token info (optional):"
echo "   Would you like to see tenant/expiry info from the token? (y/N)"
read -r DECODE_TOKEN

if [[ "$DECODE_TOKEN" =~ ^[Yy]$ ]]; then
    echo ""
    node -e "
    try {
        const token = '$NEW_TOKEN';
        const payload = token.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        console.log('📊 Token Information:');
        console.log('   Tenant:', decoded.Tenant || decoded.tenant || 'Not found');
        console.log('   Email:', decoded.Email || decoded.email || 'Not found');
        console.log('   Expires:', new Date(decoded.exp * 1000).toISOString());
        console.log('   Auth Session:', decoded.AuthSessionId || 'Not found');
    } catch (error) {
        console.log('❌ Could not decode token:', error.message);
    }
    "
fi

echo ""
echo "🎉 Token update complete!"