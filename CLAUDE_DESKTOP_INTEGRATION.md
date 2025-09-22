# Claude Desktop Integration Guide

## 🚀 Quick Setup

### Step 1: Find Your Claude Desktop Configuration

Claude Desktop stores its MCP server configuration in:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Step 2: Add HammerTech MCP Server

1. **Open the config file** (create if it doesn't exist):
   ```bash
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Add the HammerTech server configuration**:
   ```json
   {
     "mcpServers": {
       "hammertech": {
         "command": "node",
         "args": ["/Users/trefgare/Documents/HT API/hammertech-mcp-server/dist/index.js"],
         "env": {
           "HAMMERTECH_JWT_TOKEN": "YOUR_CURRENT_JWT_TOKEN_HERE",
           "HAMMERTECH_REGION": "au"
         }
       }
     }
   }
   ```

3. **Replace the JWT token** with your current token (expires 2025-09-25)

### Step 3: Restart Claude Desktop

1. **Quit Claude Desktop** completely
2. **Reopen Claude Desktop**
3. **Look for the 🔧 hammer icon** in the input area indicating MCP tools are available

## 🔐 Security Notes

### Token Management
- **Current token expires**: 2025-09-25T07:21:16.000Z (6 days from now)
- **Auto-refresh**: Server will automatically refresh the token when needed
- **Refresh token**: Valid for the session duration

### When Token Expires
When you need a new token (after the current one expires):

1. **Authenticate with HammerTech** to get a new JWT token
2. **Update the config file** with the new token
3. **Restart Claude Desktop**

## 🧪 Testing the Integration

Once configured, try these commands in Claude Desktop:

### Basic Tests
- "List the first 5 projects in HammerTech"
- "Show me worker profiles"
- "Get IoT vendors"

### Advanced Tests
- "Find all projects and show me details for the first one"
- "Create a new worker profile for John Smith born on 1990-01-01"
- "List workers modified since yesterday"

## 🛠 Available Tools (21 total)

### Projects (2 tools)
- `list_projects` - List projects with filtering/pagination
- `get_project` - Get specific project details

### Workers (2 tools)  
- `list_workers` - List workers
- `get_worker` - Get specific worker

### Worker Profiles (4 tools)
- `list_worker_profiles` - List worker profiles
- `get_worker_profile` - Get specific profile (with confidential data option)
- `create_worker_profile` - Create new worker profile
- `update_worker_profile` - Update existing profile

### Employers (3 tools)
- `list_employers` - List employers
- `get_employer` - Get specific employer
- `create_employer` - Create new employer

### Employer Profiles (4 tools)
- `list_employer_profiles` - List employer profiles
- `get_employer_profile` - Get specific profile
- `create_employer_profile` - Create new profile
- `update_employer_profile` - Update existing profile

### IoT Vendors (3 tools)
- `list_iot_vendors` - List IoT vendors
- `get_iot_vendor` - Get specific vendor
- `create_iot_vendor` - Create new vendor

### IoT Events (3 tools)
- `list_iot_events` - List IoT events
- `get_iot_event` - Get specific event
- `create_iot_event` - Create new event

## 🎯 Example Usage

### Query Projects
**You:** "Show me all projects in HammerTech"
**Claude:** Uses `list_projects` → Returns "Bob", "XYZ Project", etc.

### Get Worker Details
**You:** "Get details for worker profile Lake Arapakis"
**Claude:** Uses `list_worker_profiles` + `get_worker_profile` → Returns full profile

### Create New Data
**You:** "Create a new IoT vendor called 'Smart Sensors Inc'"
**Claude:** Uses `create_iot_vendor` → Creates new vendor

## 🔧 Troubleshooting

### No MCP Tools Showing
- ✅ Check config file path is correct
- ✅ Verify JSON syntax is valid
- ✅ Ensure Node.js is installed
- ✅ Restart Claude Desktop completely

### Authentication Errors
- ✅ Check JWT token is current (not expired)
- ✅ Verify HAMMERTECH_REGION is set correctly
- ✅ Ensure token has proper permissions

### Server Won't Start
- ✅ Check file path in `args` is correct
- ✅ Verify `dist/index.js` exists (run `npm run build`)
- ✅ Check Node.js version (requires 18+)

## 📝 Configuration Template

Save this as your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "hammertech": {
      "command": "node", 
      "args": ["/Users/trefgare/Documents/HT API/hammertech-mcp-server/dist/index.js"],
      "env": {
        "HAMMERTECH_JWT_TOKEN": "REPLACE_WITH_YOUR_TOKEN",
        "HAMMERTECH_REGION": "au"
      }
    }
  }
}
```

## 🎉 Success Indicators

When successfully integrated, you should see:
- 🔧 **Hammer icon** in Claude Desktop input area
- **Tool availability** when asking HammerTech questions
- **Real data responses** from your sarahtraining tenant

Happy integrating! 🚀