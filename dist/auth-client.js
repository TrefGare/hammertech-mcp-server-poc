import axios from 'axios';
import { getUrlsForRegion } from './types.js';
export class HammerTechAuthClient {
    config;
    authClient;
    authUrl;
    currentToken;
    refreshToken = null;
    tokenExpiry = 0;
    tenant = null;
    constructor(config) {
        this.config = config;
        const urls = getUrlsForRegion(config.region);
        this.authUrl = urls.authUrl;
        this.currentToken = config.jwtToken;
        this.authClient = axios.create({
            baseURL: this.authUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        // Decode the initial token to extract refresh token and expiry
        this.decodeAndSetTokenInfo(config.jwtToken);
    }
    decodeAndSetTokenInfo(token) {
        try {
            // Decode JWT payload (base64 decode the middle part)
            const payload = token.split('.')[1];
            const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
            this.tokenExpiry = decoded.exp * 1000; // Convert to milliseconds
            this.refreshToken = decoded.RefreshToken || decoded.refresh_token || null;
            this.tenant = decoded.Tenant || decoded.tenant || decoded.client_id || null;
            if (!this.tenant) {
                console.error('Warning: No tenant found in JWT token. Token payload:', decoded);
            }
            console.error(`Token expires at: ${new Date(this.tokenExpiry).toISOString()}`);
            console.error(`Tenant: ${this.tenant}`);
        }
        catch (error) {
            console.error('Failed to decode JWT token:', error);
            throw new Error('Invalid JWT token provided');
        }
    }
    isTokenExpired() {
        const now = Date.now();
        const buffer = 5 * 60 * 1000; // 5 minute buffer before expiry
        return now >= (this.tokenExpiry - buffer);
    }
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available. Please re-authenticate.');
        }
        if (!this.tenant) {
            throw new Error('No tenant information available. Cannot refresh token.');
        }
        try {
            const response = await this.authClient.post('/api/login/refreshtoken', {}, {
                params: {
                    token: this.refreshToken,
                    tenant: this.tenant
                }
            });
            const tokenData = response.data;
            this.currentToken = tokenData.token;
            // Decode the new token to get updated expiry and refresh token
            this.decodeAndSetTokenInfo(this.currentToken);
            console.error('Token refreshed successfully');
            return this.currentToken;
        }
        catch (error) {
            console.error('Token refresh failed:', error.response?.data || error.message);
            throw new Error('Failed to refresh token. Please re-authenticate.');
        }
    }
    async getValidToken() {
        if (this.isTokenExpired()) {
            console.error('Token expired or expiring soon, refreshing...');
            return await this.refreshAccessToken();
        }
        return this.currentToken;
    }
    async validateToken() {
        try {
            await this.getValidToken();
            return true;
        }
        catch (error) {
            return false;
        }
    }
    getTokenExpiry() {
        return new Date(this.tokenExpiry);
    }
    hasRefreshToken() {
        return !!this.refreshToken;
    }
}
//# sourceMappingURL=auth-client.js.map