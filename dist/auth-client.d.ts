import { Config } from './types.js';
export declare class HammerTechAuthClient {
    private config;
    private authClient;
    private authUrl;
    private currentToken;
    private refreshToken;
    private tokenExpiry;
    private tenant;
    constructor(config: Config);
    private decodeAndSetTokenInfo;
    private isTokenExpired;
    private refreshAccessToken;
    getValidToken(): Promise<string>;
    validateToken(): Promise<boolean>;
    getTokenExpiry(): Date;
    hasRefreshToken(): boolean;
}
//# sourceMappingURL=auth-client.d.ts.map