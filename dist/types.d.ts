import { z } from 'zod';
export declare const ConfigSchema: z.ZodObject<{
    jwtToken: z.ZodString;
    region: z.ZodDefault<z.ZodEnum<["us", "au", "eu"]>>;
}, "strip", z.ZodTypeAny, {
    jwtToken: string;
    region: "us" | "au" | "eu";
}, {
    jwtToken: string;
    region?: "us" | "au" | "eu" | undefined;
}>;
export declare function getUrlsForRegion(region: 'us' | 'au' | 'eu'): {
    apiUrl: string;
    authUrl: string;
} | {
    apiUrl: string;
    authUrl: string;
} | {
    apiUrl: string;
    authUrl: string;
};
export type Config = z.infer<typeof ConfigSchema>;
export interface HammerTechApiResponse<T = any> {
    data?: T;
    error?: string;
    status: number;
}
export interface ListParams {
    skip?: number;
    take?: number;
    sortBy?: string;
    modifiedSince?: string;
    projectId?: string;
}
export interface ProjectDescriptor {
    id: string;
    name?: string;
    description?: string;
    status?: string;
}
export interface WorkerDescriptor {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    status?: string;
}
export interface WorkerProfileDescriptor {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: string;
    preferredCommunicationLanguage?: string;
}
export interface EmployerDescriptor {
    id: string;
    name?: string;
    description?: string;
    status?: string;
}
export interface EmployerProfileDescriptor {
    id: string;
    name?: string;
    description?: string;
    employerId?: string;
}
export interface IoTVendorDescriptor {
    id: string;
    name?: string;
    description?: string;
    status?: string;
}
export interface IoTEventDescriptor {
    id: string;
    eventType?: string;
    timestamp?: string;
    vendorId?: string;
    deviceId?: string;
}
export interface CreateWorkerRequest {
    projectId: string;
    employerId: string;
    workerProfileId: string;
    inductionChecklistSignatureFileId?: string;
}
export interface CreateWorkerProfileRequest {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    jobTitle: string;
    preferredCommunicationLanguage: string;
    email?: string;
    customFieldValues?: any[];
}
export interface CreateEmployerRequest {
    businessName: string;
    description?: string;
    customFieldValues?: any[];
}
export interface CreateIoTEventRequest {
    projectId?: string;
    eventDate?: string;
    iotVendorId?: string;
    iotEventTypeId?: string;
    locationId?: string;
    description?: string;
    contentType?: string;
    content?: string;
    attachments?: Array<{
        fileName?: string;
        base64FileContent?: string;
        annotation?: string;
    }>;
}
export interface JwtTokenResponse {
    token: string;
    status: boolean;
    statusCode: number;
    email?: string;
    userId?: string;
    message?: string;
    sessionId?: string;
    isEmailValidForTenant?: boolean;
}
export interface OAuth2TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
}
export interface AuthConfig {
    authUrl: string;
    credentials: {
        username?: string;
        password?: string;
        client_id?: string;
        client_secret?: string;
        [key: string]: any;
    };
}
//# sourceMappingURL=types.d.ts.map