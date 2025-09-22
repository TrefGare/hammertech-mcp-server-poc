import { HammerTechApiClient } from './dist/api-client.js';

const config = {
  jwtToken: process.env.HAMMERTECH_JWT_TOKEN,
  region: 'au'
};

const client = new HammerTechApiClient(config);

console.log('Testing API call to list projects...');
try {
  const result = await client.listProjects({ take: 5 });
  console.log('API Response:');
  console.log('Status:', result.status);
  if (result.data) {
    console.log('Projects found:', Array.isArray(result.data) ? result.data.length : 'N/A');
    console.log('First project:', result.data?.[0]?.name || 'No projects');
  } else if (result.error) {
    console.log('Error:', result.error);
  }
} catch (error) {
  console.log('Caught error:', error.message);
}