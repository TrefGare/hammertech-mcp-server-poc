import { z } from 'zod';
// Configuration schema - secure token-based approach
export const ConfigSchema = z.object({
    // JWT token (required) - tenant will be extracted from this
    jwtToken: z.string(),
    // Region determines both API and auth URLs
    region: z.enum(['us', 'au', 'eu']).default('us')
});
// Helper function to get URLs based on region
export function getUrlsForRegion(region) {
    const urlMap = {
        us: {
            apiUrl: 'https://us-api.hammertechonline.com',
            authUrl: 'https://us-auth.hammertechonline.com',
        },
        au: {
            apiUrl: 'https://au-api.hammertechonline.com',
            authUrl: 'https://au-auth.hammertechonline.com',
        },
        eu: {
            apiUrl: 'https://eu-api.hammertechonline.com',
            authUrl: 'https://eu-auth.hammertechonline.com',
        }
    };
    return urlMap[region];
}
//# sourceMappingURL=types.js.map