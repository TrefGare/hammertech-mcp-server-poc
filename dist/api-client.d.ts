import { Config, HammerTechApiResponse, ListParams, ProjectDescriptor, WorkerDescriptor, WorkerProfileDescriptor, EmployerDescriptor, EmployerProfileDescriptor, IoTVendorDescriptor, IoTEventDescriptor, CreateWorkerRequest, CreateWorkerProfileRequest, CreateEmployerRequest, CreateIoTEventRequest } from './types.js';
export declare class HammerTechApiClient {
    private config;
    private client;
    private authClient;
    constructor(config: Config);
    private makeRequest;
    listProjects(params?: ListParams): Promise<HammerTechApiResponse<ProjectDescriptor[]>>;
    getProject(id: string): Promise<HammerTechApiResponse<ProjectDescriptor>>;
    listWorkers(params?: ListParams): Promise<HammerTechApiResponse<WorkerDescriptor[]>>;
    getWorker(id: string): Promise<HammerTechApiResponse<WorkerDescriptor>>;
    createWorker(workerData: CreateWorkerRequest): Promise<HammerTechApiResponse<any>>;
    listWorkerProfiles(params?: ListParams): Promise<HammerTechApiResponse<WorkerProfileDescriptor[]>>;
    getWorkerProfile(id: string, includeConfidentialData?: boolean): Promise<HammerTechApiResponse<WorkerProfileDescriptor>>;
    createWorkerProfile(data: CreateWorkerProfileRequest): Promise<HammerTechApiResponse<WorkerProfileDescriptor>>;
    updateWorkerProfile(id: string, data: Partial<CreateWorkerProfileRequest>): Promise<HammerTechApiResponse<WorkerProfileDescriptor>>;
    listEmployers(params?: ListParams): Promise<HammerTechApiResponse<EmployerDescriptor[]>>;
    getEmployer(id: string): Promise<HammerTechApiResponse<EmployerDescriptor>>;
    createEmployer(data: CreateEmployerRequest): Promise<HammerTechApiResponse<EmployerDescriptor>>;
    listEmployerProfiles(params?: ListParams): Promise<HammerTechApiResponse<EmployerProfileDescriptor[]>>;
    getEmployerProfile(id: string): Promise<HammerTechApiResponse<EmployerProfileDescriptor>>;
    createEmployerProfile(data: any): Promise<HammerTechApiResponse<EmployerProfileDescriptor>>;
    updateEmployerProfile(id: string, data: any): Promise<HammerTechApiResponse<EmployerProfileDescriptor>>;
    listIoTVendors(params?: ListParams): Promise<HammerTechApiResponse<IoTVendorDescriptor[]>>;
    getIoTVendor(id: string): Promise<HammerTechApiResponse<IoTVendorDescriptor>>;
    createIoTVendor(data: any): Promise<HammerTechApiResponse<IoTVendorDescriptor>>;
    listIoTEvents(params?: ListParams): Promise<HammerTechApiResponse<IoTEventDescriptor[]>>;
    getIoTEvent(id: string): Promise<HammerTechApiResponse<IoTEventDescriptor>>;
    createIoTEvent(data: CreateIoTEventRequest): Promise<HammerTechApiResponse<IoTEventDescriptor>>;
    listJobTitles(params?: ListParams): Promise<HammerTechApiResponse<any[]>>;
}
//# sourceMappingURL=api-client.d.ts.map