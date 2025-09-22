import axios, { AxiosInstance } from 'axios';
import { Config, getUrlsForRegion, JwtTokenResponse } from './types.js';

interface DecodedJWT {
  exp: number;
  iat?: number;
  nbf?: number;
  // HammerTech specific fields (capitalized)
  RefreshToken?: string;
  Tenant?: string;
  Email?: string;
  AuthSessionId?: string;
  // Standard JWT fields (lowercase)
  refresh_token?: string;
  tenant?: string;
  client_id?: string;
  sub?: string;
  [key: string]: any;
}

export class HammerTechAuthClient {
  private authClient: AxiosInstance;
  private authUrl: string;
  private currentToken: string;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;
  private tenant: string | null = null;

  constructor(private config: Config) {
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

  private decodeAndSetTokenInfo(token: string) {
    try {
      // Decode JWT payload (base64 decode the middle part)
      const payload = token.split('.')[1];
      const decoded: DecodedJWT = JSON.parse(
        Buffer.from(payload, 'base64').toString()
      );
      
      this.tokenExpiry = decoded.exp * 1000; // Convert to milliseconds
      this.refreshToken = decoded.RefreshToken || decoded.refresh_token || null;
      this.tenant = decoded.Tenant || decoded.tenant || decoded.client_id || null;
      
      if (!this.tenant) {
        console.error('Warning: No tenant found in JWT token. Token payload:', decoded);
      }
      
      console.error(`Token expires at: ${new Date(this.tokenExpiry).toISOString()}`);
      console.error(`Tenant: ${this.tenant}`);
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      throw new Error('Invalid JWT token provided');
    }
  }

  private isTokenExpired(): boolean {
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minute buffer before expiry
    return now >= (this.tokenExpiry - buffer);
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available. Please re-authenticate.');
    }
    
    if (!this.tenant) {
      throw new Error('No tenant information available. Cannot refresh token.');
    }

    try {
      const response = await this.authClient.post(
        '/api/login/refreshtoken',
        {},
        {
          params: {
            token: this.refreshToken,
            tenant: this.tenant
          }
        }
      );

      const tokenData: JwtTokenResponse = response.data;
      this.currentToken = tokenData.token;
      
      // Decode the new token to get updated expiry and refresh token
      this.decodeAndSetTokenInfo(this.currentToken);
      
      console.error('Token refreshed successfully');
      return this.currentToken;
      
    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      throw new Error('Failed to refresh token. Please re-authenticate.');
    }
  }

  async getValidToken(): Promise<string> {
    if (this.isTokenExpired()) {
      console.error('Token expired or expiring soon, refreshing...');
      return await this.refreshAccessToken();
    }
    
    return this.currentToken;
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.getValidToken();
      return true;
    } catch (error) {
      return false;
    }
  }

  getTokenExpiry(): Date {
    return new Date(this.tokenExpiry);
  }

  hasRefreshToken(): boolean {
    return !!this.refreshToken;
  }
}