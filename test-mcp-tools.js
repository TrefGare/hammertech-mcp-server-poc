import { HammerTechMCPServer } from './dist/index.js';

// Mock MCP transport for testing
class MockTransport {
  async start() {
    console.log('Mock transport started');
  }
  
  async close() {
    console.log('Mock transport closed');
  }
}

async function testMCPTools() {
  console.log('🧪 Testing MCP Server Tools Interface...\n');
  
  // Set environment
  process.env.HAMMERTECH_JWT_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2IiwidHlwIjoiSldUIn0.eyJFbWFpbCI6InRyZWYuZ2FyZUBoYW1tZXJ0ZWNoLmNvbSIsIlRlbmFudCI6InNhcmFodHJhaW5pbmciLCJBdXRoU2Vzc2lvbklkIjoiZTA2YzA5Y2EtMzViMS00MWI4LThiZjgtNjc4Mzc3YzllNmFiIiwiQXV0aGVudGljYXRlZE9uIjoiMDkvMTkvMjAyNSAwNzoyMToxNiIsIlJlZnJlc2hUb2tlbiI6Im5TUHNUVlcyUDZWa25VNU14aml4VGNURTNaQU5rSEtHQ3VYRjJwelJ6Q2c9IiwibmJmIjoxNzU4MjY2NDc2LCJleHAiOjE3NTg3ODQ4NzYsImlzcyI6Imh0dHBzOi8vaHQtbG9naW4tYXBpLmhhbW1lcnRlY2hvbmxpbmUuY29tLyIsImF1ZCI6Imh0dHBzOi8vaHQtYXBpLmhhbW1lcnRlY2hvbmxpbmUuY29tLyJ9.k0B8rNIdB7yog9rrzi4BGwZkZIEGTI2j9Hifmj3aH7cuyGb3o3eMNt3edVyvOlVhGR7zRdTtRMPGN5fh-4C7UXi3jsPDWRR9fqtI-JQYG6eKbwonLmLx9HuaKybyzEgAg4-RVw8kbuEawZg9mtYnZqN9NULzOEmw5uWKXXiADLvRcjWPGlNlts0IH3REyyshsxYS7kKeBV8zjctSOZbAXVapWOSTqmEAgv2OOES3LxziOxTgr5BIwv6R0uDVjd0MiD_ykF9qxD9tQ0DNRV79hJK-_ygzXE8ry9UUwdFwmQxUz6LevR9W-Nvd9bmhtr7Y0Xqb22i55YYQRWgJVu1Hxg";
  process.env.HAMMERTECH_REGION = "au";
  
  try {
    const server = new HammerTechMCPServer();
    
    // Test tool listing
    console.log('🔧 Testing tool listing...');
    const tools = server.getAvailableTools();
    console.log(`✅ Found ${tools.length} available tools:`);
    
    const categories = {};
    tools.forEach(tool => {
      const category = tool.name.split('_')[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(tool.name);
    });
    
    Object.entries(categories).forEach(([category, toolNames]) => {
      console.log(`   📂 ${category}: ${toolNames.length} tools`);
      toolNames.forEach(name => console.log(`      - ${name}`));
    });
    
  } catch (error) {
    console.log(`❌ Error testing MCP server: ${error.message}`);
  }
  
  console.log('\n🎯 MCP Tools Test Complete!');
}

testMCPTools().catch(console.error);