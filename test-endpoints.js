import { HammerTechApiClient } from './dist/api-client.js';

const config = {
  jwtToken: process.env.HAMMERTECH_JWT_TOKEN,
  region: 'au'
};

const client = new HammerTechApiClient(config);

async function runTests() {
  console.log('🚀 Starting HammerTech API Tests...\n');

  // Test 1: List Projects
  console.log('📋 Test 1: List Projects');
  try {
    const result = await client.listProjects({ take: 3 });
    console.log(`✅ Status: ${result.status}`);
    if (result.data && Array.isArray(result.data)) {
      console.log(`📊 Found ${result.data.length} projects`);
      result.data.forEach((project, i) => {
        console.log(`   ${i + 1}. ${project.name || project.id} (ID: ${project.id})`);
      });
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 2: List Workers
  console.log('👷 Test 2: List Workers');
  try {
    const result = await client.listWorkers({ take: 3 });
    console.log(`✅ Status: ${result.status}`);
    if (result.data && Array.isArray(result.data)) {
      console.log(`👥 Found ${result.data.length} workers`);
      result.data.forEach((worker, i) => {
        console.log(`   ${i + 1}. ${worker.firstName || 'N/A'} ${worker.lastName || 'N/A'} (ID: ${worker.id})`);
      });
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 3: List Worker Profiles
  console.log('📝 Test 3: List Worker Profiles');
  try {
    const result = await client.listWorkerProfiles({ take: 3 });
    console.log(`✅ Status: ${result.status}`);
    if (result.data && Array.isArray(result.data)) {
      console.log(`📋 Found ${result.data.length} worker profiles`);
      result.data.forEach((profile, i) => {
        console.log(`   ${i + 1}. ${profile.firstName || 'N/A'} ${profile.lastName || 'N/A'} (ID: ${profile.id})`);
      });
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 4: List Employers
  console.log('🏢 Test 4: List Employers');
  try {
    const result = await client.listEmployers({ take: 3 });
    console.log(`✅ Status: ${result.status}`);
    if (result.data && Array.isArray(result.data)) {
      console.log(`🏭 Found ${result.data.length} employers`);
      result.data.forEach((employer, i) => {
        console.log(`   ${i + 1}. ${employer.name || 'N/A'} (ID: ${employer.id})`);
      });
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 5: List IoT Vendors
  console.log('🔧 Test 5: List IoT Vendors');
  try {
    const result = await client.listIoTVendors({ take: 3 });
    console.log(`✅ Status: ${result.status}`);
    if (result.data && Array.isArray(result.data)) {
      console.log(`📡 Found ${result.data.length} IoT vendors`);
      result.data.forEach((vendor, i) => {
        console.log(`   ${i + 1}. ${vendor.name || 'N/A'} (ID: ${vendor.id})`);
      });
    } else if (result.error) {
      console.log(`ℹ️  Error: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 6: List IoT Events
  console.log('📊 Test 6: List IoT Events');
  try {
    const result = await client.listIoTEvents({ take: 3 });
    console.log(`✅ Status: ${result.status}`);
    if (result.data && Array.isArray(result.data)) {
      console.log(`🔔 Found ${result.data.length} IoT events`);
      result.data.forEach((event, i) => {
        console.log(`   ${i + 1}. ${event.eventType || 'N/A'} at ${event.timestamp || 'N/A'} (ID: ${event.id})`);
      });
    } else if (result.error) {
      console.log(`ℹ️  Error: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 7: Get specific project (if we have one)
  console.log('🔍 Test 7: Get Specific Project');
  try {
    const projectsResult = await client.listProjects({ take: 1 });
    if (projectsResult.data && projectsResult.data.length > 0) {
      const projectId = projectsResult.data[0].id;
      const result = await client.getProject(projectId);
      console.log(`✅ Status: ${result.status}`);
      if (result.data) {
        console.log(`📋 Project: ${result.data.name || 'N/A'}`);
        console.log(`   Description: ${result.data.description || 'No description'}`);
        console.log(`   Status: ${result.data.status || 'N/A'}`);
      }
    } else {
      console.log('ℹ️  No projects available to test individual retrieval');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  console.log('🎉 Test suite completed!\n');
}

runTests().catch(console.error);