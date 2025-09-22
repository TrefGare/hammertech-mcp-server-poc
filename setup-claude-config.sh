#!/bin/bash

echo "🔧 Setting up Claude Desktop MCP Configuration..."
echo ""

# Create Claude configuration directory
CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

echo "Creating configuration directory: $CONFIG_DIR"
mkdir -p "$CONFIG_DIR"

echo "Creating configuration file: $CONFIG_FILE"

# Write the configuration
cat > "$CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "hammertech": {
      "command": "node",
      "args": ["/Users/trefgare/Documents/HT API/hammertech-mcp-server/dist/index.js"],
      "env": {
        "HAMMERTECH_JWT_TOKEN": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2IiwidHlwIjoiSldUIn0.eyJFbWFpbCI6InRyZWYuZ2FyZUBoYW1tZXJ0ZWNoLmNvbSIsIlRlbmFudCI6InNhcmFodHJhaW5pbmciLCJBdXRoU2Vzc2lvbklkIjoiZTA2YzA5Y2EtMzViMS00MWI4LThiZjgtNjc4Mzc3YzllNmFiIiwiQXV0aGVudGljYXRlZE9uIjoiMDkvMTkvMjAyNSAwNzoyMToxNiIsIlJlZnJlc2hUb2tlbiI6Im5TUHNUVlcyUDZWa25VNU14aml4VGNURTNaQU5rSEtHQ3VYRjJwelJ6Q2c9IiwibmJmIjoxNzU4MjY2NDc2LCJleHAiOjE3NTg3ODQ4NzYsImlzcyI6Imh0dHBzOi8vaHQtbG9naW4tYXBpLmhhbW1lcnRlY2hvbmxpbmUuY29tLyIsImF1ZCI6Imh0dHBzOi8vaHQtYXBpLmhhbW1lcnRlY2hvbmxpbmUuY29tLyJ9.k0B8rNIdB7yog9rrzi4BGwZkZIEGTI2j9Hifmj3aH7cuyGb3o3eMNt3edVyvOlVhGR7zRdTtRMPGN5fh-4C7UXi3jsPDWRR9fqtI-JQYG6eKbwonLmLx9HuaKybyzEgAg4-RVw8kbuEawZg9mtYnZqN9NULzOEmw5uWKXXiADLvRcjWPGlNlts0IH3REyyshsxYS7kKeBV8zjctSOZbAXVapWOSTqmEAgv2OOES3LxziOxTgr5BIwv6R0uDVjd0MiD_ykF9qxD9tQ0DNRV79hJK-_ygzXE8ry9UUwdFwmQxUz6LevR9W-Nvd9bmhtr7Y0Xqb22i55YYQRWgJVu1Hxg",
        "HAMMERTECH_REGION": "au"
      }
    }
  }
}
EOF

echo ""
echo "✅ Configuration created successfully!"
echo ""
echo "📁 Configuration file location:"
echo "   $CONFIG_FILE"
echo ""
echo "📝 Next steps:"
echo "   1. Quit Claude Desktop completely (Cmd+Q)"
echo "   2. Reopen Claude Desktop"
echo "   3. Look for the 🔧 hammer icon in the input area"
echo "   4. Test with: 'List HammerTech projects'"
echo ""
echo "🔍 To view the configuration:"
echo "   open '$CONFIG_FILE'"
echo ""
echo "🎉 Ready for Claude Desktop integration!"