#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { HammerTechApiClient } from './api-client.js';
import { CreateWorkerRequest } from './types.js';
export declare class HammerTechMCPServer {
    server: Server;
    apiClient: HammerTechApiClient | null;
    constructor();
    setupToolHandlers(): void;
    getAvailableTools(): ({
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required?: undefined;
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                skip: {
                    type: string;
                    description: string;
                };
                take: {
                    type: string;
                    description: string;
                };
                modifiedSince: {
                    type: string;
                    description: string;
                };
                projectId: {
                    type: string;
                    description: string;
                    format?: undefined;
                };
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required?: undefined;
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                skip: {
                    type: string;
                    description?: undefined;
                };
                take: {
                    type: string;
                    description?: undefined;
                };
                sortBy: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                modifiedSince: {
                    type: string;
                    description?: undefined;
                };
                projectId: {
                    type: string;
                    description?: undefined;
                    format?: undefined;
                };
                id?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required?: undefined;
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                projectId: {
                    type: string;
                    description: string;
                    format: string;
                };
                employerId: {
                    type: string;
                    description: string;
                    format: string;
                };
                workerProfileId: {
                    type: string;
                    description: string;
                    format: string;
                };
                inductionChecklistSignatureFileId: {
                    type: string;
                    description: string;
                    format: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                id?: undefined;
                sortBy?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                includeConfidentialData: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                firstName: {
                    type: string;
                    description: string;
                };
                lastName: {
                    type: string;
                    description: string;
                };
                dateOfBirth: {
                    type: string;
                    description: string;
                };
                jobTitle: {
                    type: string;
                    description: string;
                };
                preferredCommunicationLanguage: {
                    type: string;
                    description: string;
                };
                email: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                firstName: {
                    type: string;
                    description?: undefined;
                };
                lastName: {
                    type: string;
                    description?: undefined;
                };
                dateOfBirth: {
                    type: string;
                    description: string;
                };
                jobTitle: {
                    type: string;
                    description: string;
                };
                preferredCommunicationLanguage: {
                    type: string;
                    description?: undefined;
                };
                email: {
                    type: string;
                    description?: undefined;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                businessName: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                businessName: {
                    type: string;
                    description: string;
                };
                abn: {
                    type: string;
                    description: string;
                };
                internalIdentifier: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                description?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                businessName: {
                    type: string;
                    description: string;
                };
                abn: {
                    type: string;
                    description: string;
                };
                internalIdentifier: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                description?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                skip: {
                    type: string;
                    description?: undefined;
                };
                take: {
                    type: string;
                    description?: undefined;
                };
                sortBy: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                modifiedSince: {
                    type: string;
                    description?: undefined;
                };
                projectId: {
                    type: string;
                    description?: undefined;
                    format?: undefined;
                };
                includeDeleted: {
                    type: string;
                };
                id?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required?: undefined;
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                name: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                skip: {
                    type: string;
                    description?: undefined;
                };
                take: {
                    type: string;
                    description?: undefined;
                };
                sortBy: {
                    type: string;
                    enum?: undefined;
                    description?: undefined;
                };
                modifiedSince: {
                    type: string;
                    description?: undefined;
                };
                projectId: {
                    type: string;
                    description?: undefined;
                    format?: undefined;
                };
                id?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required?: undefined;
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                projectId: {
                    type: string;
                    description: string;
                    format: string;
                };
                eventDate: {
                    type: string;
                    description: string;
                    format: string;
                };
                iotVendorId: {
                    type: string;
                    description: string;
                    format: string;
                };
                iotEventTypeId: {
                    type: string;
                    description: string;
                    format: string;
                };
                locationId: {
                    type: string;
                    description: string;
                    format: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                contentType: {
                    type: string;
                    description: string;
                };
                content: {
                    type: string;
                    description: string;
                };
                attachments: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                        properties: {
                            fileName: {
                                type: string;
                                description: string;
                            };
                            base64FileContent: {
                                type: string;
                                description: string;
                            };
                            annotation: {
                                type: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                projectId: {
                    type: string;
                    description: string;
                    format: string;
                };
                eventDate: {
                    type: string;
                    description: string;
                    format: string;
                };
                iotVendorId: {
                    type: string;
                    description: string;
                    format: string;
                };
                iotEventTypeId: {
                    type: string;
                    description: string;
                    format: string;
                };
                locationId: {
                    type: string;
                    description: string;
                    format: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                contentType: {
                    type: string;
                    description: string;
                };
                content: {
                    type: string;
                    description: string;
                };
                imageBase64: {
                    type: string;
                    description: string;
                };
                imageFileName: {
                    type: string;
                    description: string;
                };
                imageAnnotation: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                attachments?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                q: {
                    type: string;
                    description: string;
                };
                locale: {
                    type: string;
                    description: string;
                };
                limit: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                idOrSlug: {
                    type: string;
                    description: string;
                };
                locale: {
                    type: string;
                    description: string;
                };
                format: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                limit?: undefined;
                maxBullets?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                idOrSlug: {
                    type: string;
                    description: string;
                };
                locale: {
                    type: string;
                    description: string;
                };
                maxBullets: {
                    type: string;
                    description: string;
                };
                skip?: undefined;
                take?: undefined;
                modifiedSince?: undefined;
                projectId?: undefined;
                id?: undefined;
                sortBy?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                limit?: undefined;
                format?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                skip: {
                    type: string;
                    description: string;
                };
                take: {
                    type: string;
                    description: string;
                };
                sortBy: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                modifiedSince: {
                    type: string;
                    description: string;
                };
                projectId: {
                    type: string;
                    description: string;
                    format?: undefined;
                };
                id?: undefined;
                employerId?: undefined;
                workerProfileId?: undefined;
                inductionChecklistSignatureFileId?: undefined;
                includeConfidentialData?: undefined;
                firstName?: undefined;
                lastName?: undefined;
                dateOfBirth?: undefined;
                jobTitle?: undefined;
                preferredCommunicationLanguage?: undefined;
                email?: undefined;
                businessName?: undefined;
                description?: undefined;
                abn?: undefined;
                internalIdentifier?: undefined;
                includeDeleted?: undefined;
                name?: undefined;
                eventDate?: undefined;
                iotVendorId?: undefined;
                iotEventTypeId?: undefined;
                locationId?: undefined;
                contentType?: undefined;
                content?: undefined;
                attachments?: undefined;
                imageBase64?: undefined;
                imageFileName?: undefined;
                imageAnnotation?: undefined;
                q?: undefined;
                locale?: undefined;
                limit?: undefined;
                idOrSlug?: undefined;
                format?: undefined;
                maxBullets?: undefined;
            };
            required?: undefined;
        };
    })[];
    handleStatusPing(): {
        content: {
            type: string;
            text: string;
        }[];
    };
    handleListProjects(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleGetProject(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleListWorkers(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleGetWorker(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleCreateWorker(args: CreateWorkerRequest): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleListWorkerProfiles(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleGetWorkerProfile(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleCreateWorkerProfile(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleUpdateWorkerProfile(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleListEmployers(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleGetEmployer(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleCreateEmployer(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleListEmployerProfiles(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleGetEmployerProfile(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleCreateEmployerProfile(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleUpdateEmployerProfile(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleListEquipmentInductions(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleListIoTVendors(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleGetIoTVendor(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleCreateIoTVendor(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleListIoTEvents(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleGetIoTEvent(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleCreateIoTEvent(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleCreateIoTEventWithImage(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    handleHelpSearch(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
    handleHelpGet(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
    handleHelpSummarize(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
    fetchHelpArticle(idOrSlug: string, locale?: string): Promise<any>;
    searchHelp(q: string, locale?: string, limit?: number): Promise<any>;
    handleListJobTitles(args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    initializeApiClient(): void;
    run(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map