#!/usr/bin/env node
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare class HammerTechMCPServer {
    private server;
    private apiClient;
    constructor();
    private setupToolHandlers;
    getAvailableTools(): Tool[];
    private handleListProjects;
    private handleGetProject;
    private handleListWorkers;
    private handleGetWorker;
    private handleListWorkerProfiles;
    private handleGetWorkerProfile;
    private handleCreateWorkerProfile;
    private handleUpdateWorkerProfile;
    private handleListEmployers;
    private handleGetEmployer;
    private handleCreateEmployer;
    private handleListEmployerProfiles;
    private handleGetEmployerProfile;
    private handleCreateEmployerProfile;
    private handleUpdateEmployerProfile;
    private handleListIoTVendors;
    private handleGetIoTVendor;
    private handleCreateIoTVendor;
    private handleListIoTEvents;
    private handleGetIoTEvent;
    private handleCreateIoTEvent;
    private handleCreateIoTEventWithImage;
    private initializeApiClient;
    run(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map