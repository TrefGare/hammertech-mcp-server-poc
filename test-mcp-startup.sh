#!/bin/bash

echo "🧪 Testing HammerTech MCP Server Startup..."
echo ""

# Set environment variables
export HAMMERTECH_JWT_TOKEN="eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2IiwidHlwIjoiSldUIn0.eyJFbWFpbCI6InRyZWYuZ2FyZUBoYW1tZXJ0ZWNoLmNvbSIsIlRlbmFudCI6InNhcmFodHJhaW5pbmciLCJBdXRoU2Vzc2lvbklkIjoiZTA2YzA5Y2EtMzViMS00MWI4LThiZjgtNjc4Mzc3YzllNmFiIiwiQXV0aGVudGljYXRlZE9uIjoiMDkvMTkvMjAyNSAwNzoyMToxNiIsIlJlZnJlc2hUb2tlbiI6Im5TUHNUVlcyUDZWa25VNU14aml4VGNURTNaQU5rSEtHQ3VYRjJwelJ6Q2c9IiwibmJmIjoxNzU4MjY2NDc2LCJleHAiOjE3NTg3ODQ4NzYsImlzcyI6Imh0dHBzOi8vaHQtbG9naW4tYXBpLmhhbW1lcnRlY2hvbmxpbmUuY29tLyIsImF1ZCI6Imh0dHBzOi8vaHQtYXBpLmhhbW1lcnRlY2hvbmxpbmUuY29tLyJ9.k0B8rNIdB7yog9rrzi4BGwZkZIEGTI2j9Hifmj3aH7cuyGb3o3eMNt3edVyvOlVhGR7zRdTtRMPGN5fh-4C7UXi3jsPDWRR9fqtI-JQYG6eKbwonLmLx9HuaKybyzEgAg4-RVw8kbuEawZg9mtYnZqN9NULzOEmw5uWKXXiADLvRcjWPGlNlts0IH3REyyshsxYS7kKeBV8zjctSOZbAXVapWOSTqmEAgv2OOES3LxziOxTgr5BIwv6R0uDVjd0MiD_ykF9qxD9tQ0DNRV79hJK-_ygzXE8ry9UUwdFwmQxUz6LevR9W-Nvd9bmhtr7Y0Xqb22i55YYQRWgJVu1Hxg"
export HAMMERTECH_REGION="au"

echo "✅ Environment configured:"
echo "   Region: $HAMMERTECH_REGION"
echo "   Token expires: 2025-09-25T07:21:16.000Z"
echo ""

# Check if built files exist
if [ ! -f "dist/index.js" ]; then
    echo "❌ Built files not found. Running build..."
    npm run build
    echo ""
fi

echo "🚀 Starting MCP server for 3 seconds..."
echo "   (This simulates Claude Desktop connecting)"
echo ""

# Start server in background and kill after 3 seconds
timeout 3s node dist/index.js 2>&1 &
SERVER_PID=$!

sleep 3

# Check if server is still running (it should be waiting for stdio)
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ SUCCESS: MCP server started and is running"
    echo "✅ Ready for Claude Desktop integration!"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Server exited unexpectedly"
    exit 1
fi

echo ""
echo "🎉 Startup test complete!"
echo ""
echo "Next steps:"
echo "1. Copy the configuration to Claude Desktop"
echo "2. Restart Claude Desktop"
echo "3. Look for the 🔧 hammer icon"