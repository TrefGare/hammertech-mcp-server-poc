import { HammerTechApiClient } from './dist/api-client.js';

const config = {
  jwtToken: process.env.HAMMERTECH_JWT_TOKEN,
  region: 'au'
};

const client = new HammerTechApiClient(config);

async function testDetailed() {
  console.log('🔍 Detailed API Tests\n');

  // Test getting a specific worker profile with full details
  console.log('👤 Testing Worker Profile Details:');
  try {
    const profiles = await client.listWorkerProfiles({ take: 1 });
    if (profiles.data && profiles.data.length > 0) {
      const profileId = profiles.data[0].id;
      console.log(`📋 Getting details for profile: ${profiles.data[0].firstName} ${profiles.data[0].lastName}`);
      
      const detailed = await client.getWorkerProfile(profileId, false);
      console.log(`✅ Status: ${detailed.status}`);
      if (detailed.data) {
        console.log('📊 Profile data:');
        console.log(`   - Name: ${detailed.data.firstName} ${detailed.data.lastName}`);
        console.log(`   - Email: ${detailed.data.email || 'Not provided'}`);
        console.log(`   - DOB: ${detailed.data.dateOfBirth || 'Not provided'}`);
        console.log(`   - Language: ${detailed.data.preferredCommunicationLanguage || 'Not provided'}`);
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test employers with metadata
  console.log('🏢 Testing Employer Profiles:');
  try {
    const profiles = await client.listEmployerProfiles({ take: 2 });
    console.log(`✅ Status: ${profiles.status}`);
    if (profiles.data && Array.isArray(profiles.data)) {
      console.log(`📋 Found ${profiles.data.length} employer profiles:`);
      profiles.data.forEach((profile, i) => {
        console.log(`   ${i + 1}. ${profile.name || 'Unnamed'} (ID: ${profile.id})`);
        console.log(`      Description: ${profile.description || 'No description'}`);
        console.log(`      Employer ID: ${profile.employerId || 'N/A'}`);
      });
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test pagination
  console.log('📄 Testing Pagination:');
  try {
    console.log('   Getting first 2 projects...');
    const page1 = await client.listProjects({ take: 2, skip: 0 });
    console.log(`   ✅ Page 1: ${page1.data ? page1.data.length : 0} projects`);
    
    console.log('   Getting next 2 projects...');
    const page2 = await client.listProjects({ take: 2, skip: 2 });
    console.log(`   ✅ Page 2: ${page2.data ? page2.data.length : 0} projects`);
    
    if (page1.data && page2.data) {
      const totalShown = page1.data.length + page2.data.length;
      console.log(`   📊 Total shown across pages: ${totalShown}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  console.log('');

  // Test sorting
  console.log('🔤 Testing Sorting:');
  try {
    const sorted = await client.listProjects({ take: 3, sortBy: 'id' });
    console.log(`✅ Status: ${sorted.status}`);
    if (sorted.data) {
      console.log('📋 Projects sorted by ID:');
      sorted.data.forEach((project, i) => {
        console.log(`   ${i + 1}. ${project.name || 'Unnamed'}`);
      });
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('\n✨ Detailed testing complete!');
}

testDetailed().catch(console.error);