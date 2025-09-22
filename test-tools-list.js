// Simple test to show available MCP tools without running the server

console.log('🧪 HammerTech MCP Server - Available Tools\n');

const tools = [
  // Projects
  'list_projects - List projects with optional filtering and pagination',
  'get_project - Retrieve a specific project by ID',
  
  // Workers  
  'list_workers - List workers with optional filtering and pagination',
  'get_worker - Retrieve a specific worker by ID',
  
  // Worker Profiles
  'list_worker_profiles - List worker profiles',
  'get_worker_profile - Get worker profile (with optional confidential data)',
  'create_worker_profile - Create a new worker profile',
  'update_worker_profile - Update an existing worker profile',
  
  // Employers
  'list_employers - List employers',
  'get_employer - Retrieve a specific employer',
  'create_employer - Create a new employer',
  
  // Employer Profiles
  'list_employer_profiles - List employer profiles',
  'get_employer_profile - Get specific employer profile',
  'create_employer_profile - Create new employer profile',
  'update_employer_profile - Update existing employer profile',
  
  // IoT Vendors
  'list_iot_vendors - List IoT vendors',
  'get_iot_vendor - Get specific IoT vendor',
  'create_iot_vendor - Create new IoT vendor',
  
  // IoT Events
  'list_iot_events - List IoT events',
  'get_iot_event - Get specific IoT event',
  'create_iot_event - Create new IoT event'
];

const categories = {
  projects: tools.filter(t => t.includes('project')),
  workers: tools.filter(t => t.includes('worker') && !t.includes('profile')),
  worker_profiles: tools.filter(t => t.includes('worker_profile')),
  employers: tools.filter(t => t.includes('employer') && !t.includes('profile')),
  employer_profiles: tools.filter(t => t.includes('employer_profile')),
  iot_vendors: tools.filter(t => t.includes('iot_vendor')),
  iot_events: tools.filter(t => t.includes('iot_event'))
};

console.log(`📊 Total Tools Available: ${tools.length}\n`);

Object.entries(categories).forEach(([category, categoryTools]) => {
  const displayName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  console.log(`📂 ${displayName} (${categoryTools.length} tools):`);
  categoryTools.forEach(tool => {
    const [name, description] = tool.split(' - ');
    console.log(`   ✅ ${name} - ${description}`);
  });
  console.log('');
});

console.log('🎯 All tools support common parameters:');
console.log('   • skip: Number of records to skip (pagination)');
console.log('   • take: Number of records to return (max 100)');
console.log('   • sortBy: Sort order (id, iddesc, descr)');
console.log('   • modifiedSince: ISO datetime for filtering');
console.log('   • projectId: Filter by specific project');
console.log('');

console.log('🔐 Authentication: JWT Bearer token with auto-refresh');
console.log('🌍 Regions: US, AU, EU supported');
console.log('✨ Ready for Claude Desktop integration!');