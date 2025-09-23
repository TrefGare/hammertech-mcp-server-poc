#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { HammerTechApiClient } from "./api-client.js";
export declare class HammerTechMCPServer {
    server: McpServer;
    apiClient: HammerTechApiClient | null;
    constructor();
    /** --------------------- RESOURCES --------------------- */
    registerResources(): void;
    /** --------------------- PROMPTS --------------------- */
    registerPrompts(): void;
    /** --------------------- TOOLS --------------------- */
    registerTools(): void;
    /** --------------------- HELP SITE HELPERS --------------------- */
    fetchHelpArticle(idOrSlug: string, locale?: string): Promise<{
        url: string;
        status: number;
        markdown: null;
        html: null;
        title?: undefined;
        error?: undefined;
    } | {
        url: string;
        title: string;
        html: string;
        markdown: string;
        status?: undefined;
        error?: undefined;
    } | {
        url: string;
        error: string;
        markdown: null;
        html: null;
        status?: undefined;
        title?: undefined;
    }>;
    searchHelp(q: string, locale?: string, limit?: number): Promise<{
        url: string;
        items: never[];
        status: number;
        error?: undefined;
    } | {
        url: string;
        items: {
            idOrSlug: string;
            title: string;
            url: string;
        }[];
        status?: undefined;
        error?: undefined;
    } | {
        url: null;
        items: never[];
        error: string;
        status?: undefined;
    }>;
    /** --------------------- API CLIENT --------------------- */
    initializeApiClient(): void;
    run(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map