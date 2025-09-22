# HammerTech MCP Server POC

A secure Model Context Protocol (MCP) server for HammerTech API integration with automatic JWT token refresh.

## 🔐 Security Features

- **JWT Bearer Authentication** with automatic refresh
- **Tenant extracted from token** - no separate credentials needed
- **Auto token refresh** with 5-minute expiry buffer
- **Region-aware** auth and API endpoints
- **No credential storage** - only requires initial JWT token

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Valid HammerTech JWT token
- HammerTech tenant access

### Setup

1. **Install dependencies:**
   ```bash
   npm install && npm run build
   ```

2. **Configure environment:**
   ```bash
   # Required: Your JWT token from HammerTech auth
   export HAMMERTECH_JWT_TOKEN="eyJ0eXAiOiJKV1Q..."
   
   # Optional: Region (defaults to 'us')
   export HAMMERTECH_REGION="us"  # or "au" or "eu"
   ```

3. **Test the server:**
   ```bash
   npm run dev
   ```

## 📋 Available Endpoints

### Focused POC Scope:
- **Projects**: List and retrieve projects
- **Workers**: Worker data management  
- **WorkerProfiles**: Detailed worker profiles with CRUD
- **Employers**: Employer information
- **EmployerProfiles**: Employer profile management
- **IoTVendors**: IoT device vendor management
- **IoTEvents**: IoT event data handling

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HAMMERTECH_JWT_TOKEN` | ✅ Yes | JWT token from HammerTech auth service |
| `HAMMERTECH_REGION` | ❌ No | Region: `us`, `au`, or `eu` (default: `us`) |

### Region Endpoints

The server automatically configures URLs based on region:

| Region | API URL | Auth URL |
|--------|---------|----------|
| `us` | `us-api.hammertechonline.com` | `us-auth.hammertechonline.com` |
| `au` | `au-api.hammertechonline.com` | `au-auth.hammertechonline.com` |
| `eu` | `eu-api.hammertechonline.com` | `eu-auth.hammertechonline.com` |

## 🛠 Claude Desktop Integration

Add to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "hammertech": {
      "command": "node",
      "args": ["/path/to/hammertech-mcp-server/dist/index.js"],
      "env": {
        "HAMMERTECH_JWT_TOKEN": "your-jwt-token-here",
        "HAMMERTECH_REGION": "us"
      }
    }
  }
}
```

## 🔄 Token Management

- **Automatic refresh**: Tokens refresh 5 minutes before expiry
- **Tenant extraction**: Tenant info extracted from JWT payload
- **Error handling**: Graceful handling of auth failures
- **No credential storage**: Only the JWT token is stored

## 📖 Example Usage

Once configured, ask Claude:

- "List the first 10 projects in HammerTech"
- "Create a worker profile for John Smith"
- "Show me recent IoT events"
- "Get all workers modified since yesterday"

## 🏗 Architecture

```
JWT Token → Auth Client → API Client → MCP Tools → Claude
     ↓           ↓            ↓           ↓         ↓
  Decode     Auto-refresh   API calls   Results   User
```

## 🔐 Security Notes

- JWT tokens expire after ~60 minutes
- Automatic refresh using embedded refresh token
- No username/password storage required
- Tenant information extracted from token claims
- All requests use HTTPS

## 📝 Development

```bash
# Development mode
npm run dev

# Watch mode
npm run watch

# Build only
npm run build
```