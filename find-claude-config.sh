#!/bin/bash

echo "🔍 Searching for Claude Desktop configuration locations..."
echo ""

# Check if Claude Desktop is installed
echo "1. Checking if Claude Desktop is installed:"
if [ -d "/Applications/Claude.app" ]; then
    echo "   ✅ Found Claude.app in /Applications/"
elif ls /Applications/ | grep -i claude >/dev/null 2>&1; then
    echo "   ✅ Found Claude app in /Applications/:"
    ls /Applications/ | grep -i claude | sed 's/^/      /'
else
    echo "   ❓ Claude Desktop not found in /Applications/"
    echo "      Check if it's installed elsewhere or via different method"
fi

echo ""
echo "2. Checking standard configuration locations:"

# Standard macOS location
CONFIG_PATHS=(
    "$HOME/Library/Application Support/Claude"
    "$HOME/Library/Application Support/claude"
    "$HOME/Library/Application Support/com.anthropic.claude"
    "$HOME/.config/claude"
    "$HOME/.claude"
    "$HOME/Library/Preferences/Claude"
    "$HOME/Library/Preferences/com.anthropic.claude"
)

for path in "${CONFIG_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "   ✅ Found: $path"
        if [ -f "$path/claude_desktop_config.json" ]; then
            echo "      📄 Config file exists!"
        else
            echo "      📝 Directory exists, but no config file"
        fi
    else
        echo "   ❌ Not found: $path"
    fi
done

echo ""
echo "3. Searching for any claude-related config files:"
find "$HOME/Library" -name "*claude*" -type f 2>/dev/null | head -10 | sed 's/^/   📄 /'
find "$HOME/Library" -name "*claude*" -type d 2>/dev/null | head -10 | sed 's/^/   📁 /'

echo ""
echo "4. Checking Claude Desktop documentation path:"
echo "   Standard path should be: ~/Library/Application Support/Claude/"
echo ""
echo "5. Manual creation command:"
echo "   mkdir -p \"$HOME/Library/Application Support/Claude\""
echo "   touch \"$HOME/Library/Application Support/Claude/claude_desktop_config.json\""