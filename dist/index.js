#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { HammerTechApiClient } from './api-client.js';
import { ConfigSchema } from './types.js';
export class HammerTechMCPServer {
    server;
    apiClient = null;
    constructor() {
        this.server = new Server({
            name: 'hammertech-api-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: this.getAvailableTools(),
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (!this.apiClient) {
                throw new Error('HammerTech API client not configured. Please set HAMMERTECH_JWT_TOKEN and HAMMERTECH_REGION environment variables.');
            }
            try {
                switch (name) {
                    // Projects
                    case 'list_projects':
                        return await this.handleListProjects(args);
                    case 'get_project':
                        return await this.handleGetProject(args);
                    // Workers
                    case 'list_workers':
                        return await this.handleListWorkers(args);
                    case 'get_worker':
                        return await this.handleGetWorker(args);
                    // Worker Profiles
                    case 'list_worker_profiles':
                        return await this.handleListWorkerProfiles(args);
                    case 'get_worker_profile':
                        return await this.handleGetWorkerProfile(args);
                    case 'create_worker_profile':
                        return await this.handleCreateWorkerProfile(args);
                    case 'update_worker_profile':
                        return await this.handleUpdateWorkerProfile(args);
                    // Employers
                    case 'list_employers':
                        return await this.handleListEmployers(args);
                    case 'get_employer':
                        return await this.handleGetEmployer(args);
                    case 'create_employer':
                        return await this.handleCreateEmployer(args);
                    // Employer Profiles
                    case 'list_employer_profiles':
                        return await this.handleListEmployerProfiles(args);
                    case 'get_employer_profile':
                        return await this.handleGetEmployerProfile(args);
                    case 'create_employer_profile':
                        return await this.handleCreateEmployerProfile(args);
                    case 'update_employer_profile':
                        return await this.handleUpdateEmployerProfile(args);
                    // IoT Vendors
                    case 'list_iot_vendors':
                        return await this.handleListIoTVendors(args);
                    case 'get_iot_vendor':
                        return await this.handleGetIoTVendor(args);
                    case 'create_iot_vendor':
                        return await this.handleCreateIoTVendor(args);
                    // IoT Events
                    case 'list_iot_events':
                        return await this.handleListIoTEvents(args);
                    case 'get_iot_event':
                        return await this.handleGetIoTEvent(args);
                    case 'create_iot_event':
                        return await this.handleCreateIoTEvent(args);
                    case 'create_iot_event_with_image':
                        return await this.handleCreateIoTEventWithImage(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    getAvailableTools() {
        return [
            // Projects
            {
                name: 'list_projects',
                description: 'List construction projects with optional filtering and pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skip: { type: 'number', description: 'Number of records to skip for pagination' },
                        take: { type: 'number', description: 'Number of records to take (max 100)' },
                        sortBy: { type: 'string', description: 'Sort order (id, iddesc, descr)' },
                        modifiedSince: { type: 'string', description: 'ISO datetime to filter modified records' },
                        projectId: { type: 'string', description: 'Filter by project ID' },
                    },
                },
            },
            {
                name: 'get_project',
                description: 'Retrieve a specific construction project by ID',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Project ID', },
                    },
                    required: ['id'],
                },
            },
            // Workers
            {
                name: 'list_workers',
                description: 'List workers (per-project records linking Worker Profiles to specific Projects) with optional filtering and pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skip: { type: 'number' },
                        take: { type: 'number' },
                        sortBy: { type: 'string' },
                        modifiedSince: { type: 'string' },
                        projectId: { type: 'string' },
                    },
                },
            },
            {
                name: 'get_worker',
                description: 'Retrieve a specific worker by ID (per-project record connecting a Worker Profile to a Project)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Worker ID' },
                    },
                    required: ['id'],
                },
            },
            // Worker Profiles
            {
                name: 'list_worker_profiles',
                description: 'List worker profiles (unique individuals/people within the company) with optional filtering and pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skip: { type: 'number' },
                        take: { type: 'number' },
                        sortBy: { type: 'string' },
                        modifiedSince: { type: 'string' },
                        projectId: { type: 'string' },
                    },
                },
            },
            {
                name: 'get_worker_profile',
                description: 'Retrieve a specific worker profile by ID (unique individual/person within the company)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Worker Profile ID' },
                        includeConfidentialData: { type: 'boolean', description: 'Include confidential data in response' },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'create_worker_profile',
                description: 'Create a new worker profile (unique individual/person within the company)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string', description: 'Worker first name' },
                        lastName: { type: 'string', description: 'Worker last name' },
                        dateOfBirth: { type: 'string', description: 'Date of birth in extended ISO 8601 format (YYYY-MM-DDThh:mm:ss), e.g. 1970-01-01T00:00:00' },
                        preferredCommunicationLanguage: { type: 'string', description: 'BCP 47 language tag' },
                        email: { type: 'string', description: 'Email address' },
                    },
                    required: ['firstName', 'lastName', 'dateOfBirth', 'preferredCommunicationLanguage'],
                },
            },
            {
                name: 'update_worker_profile',
                description: 'Update an existing worker profile (unique individual/person within the company)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Worker Profile ID' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        dateOfBirth: { type: 'string', description: 'Date of birth in extended ISO 8601 format (YYYY-MM-DDThh:mm:ss), e.g. 1970-01-01T00:00:00' },
                        preferredCommunicationLanguage: { type: 'string' },
                        email: { type: 'string' },
                    },
                    required: ['id'],
                },
            },
            // Employers
            {
                name: 'list_employers',
                description: 'List employers (companies/organizations associated with specific projects) with optional filtering and pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skip: { type: 'number' },
                        take: { type: 'number' },
                        sortBy: { type: 'string' },
                        modifiedSince: { type: 'string' },
                        projectId: { type: 'string' },
                    },
                },
            },
            {
                name: 'get_employer',
                description: 'Retrieve a specific employer by ID (company/organization associated with a project)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Employer ID' },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'create_employer',
                description: 'Create a new employer (associate a company/organization with a project)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Employer name' },
                        description: { type: 'string', description: 'Employer description' },
                    },
                    required: ['name'],
                },
            },
            // Employer Profiles
            {
                name: 'list_employer_profiles',
                description: 'List employer profiles (master records for companies/organizations) with optional filtering and pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skip: { type: 'number' },
                        take: { type: 'number' },
                        sortBy: { type: 'string' },
                        modifiedSince: { type: 'string' },
                        projectId: { type: 'string' },
                    },
                },
            },
            {
                name: 'get_employer_profile',
                description: 'Retrieve a specific employer profile by ID (master company/organization record)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Employer Profile ID' },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'create_employer_profile',
                description: 'Create a new employer profile (master company/organization record)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Profile name' },
                        description: { type: 'string', description: 'Profile description' },
                        employerId: { type: 'string', description: 'Associated employer ID' },
                    },
                    required: ['name'],
                },
            },
            {
                name: 'update_employer_profile',
                description: 'Update an existing employer profile (master company/organization record)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Employer Profile ID' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        employerId: { type: 'string' },
                    },
                    required: ['id'],
                },
            },
            // IoT Vendors
            {
                name: 'list_iot_vendors',
                description: 'List IoT vendors (manufacturers/providers of IoT devices) with optional filtering and pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skip: { type: 'number' },
                        take: { type: 'number' },
                        sortBy: { type: 'string' },
                        modifiedSince: { type: 'string' },
                        projectId: { type: 'string' },
                    },
                },
            },
            {
                name: 'get_iot_vendor',
                description: 'Retrieve a specific IoT vendor by ID (manufacturer/provider of IoT devices)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'IoT Vendor ID' },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'create_iot_vendor',
                description: 'Create a new IoT vendor (manufacturer/provider of IoT devices)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Vendor name' },
                        description: { type: 'string', description: 'Vendor description' },
                    },
                    required: ['name'],
                },
            },
            // IoT Events
            {
                name: 'list_iot_events',
                description: 'List IoT events with optional filtering and pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skip: { type: 'number' },
                        take: { type: 'number' },
                        sortBy: { type: 'string' },
                        modifiedSince: { type: 'string' },
                        projectId: { type: 'string' },
                    },
                },
            },
            {
                name: 'get_iot_event',
                description: 'Retrieve a specific IoT event by ID',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'IoT Event ID' },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'create_iot_event',
                description: 'Create a new IoT event record capturing data points from connected IoT devices with associated metadata, optional structured content, and file attachments',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'Project UUID associated with the IoT Event', format: 'uuid' },
                        eventDate: { type: 'string', description: 'Event date/time in ISO 8601 format (YYYY-MM-DDThh:mm:ss), e.g. 2024-01-15T14:30:00. If not provided, current date/time will be used.', format: 'date-time' },
                        iotVendorId: { type: 'string', description: 'IoT Vendor UUID', format: 'uuid' },
                        iotEventTypeId: { type: 'string', description: 'IoT Event Type UUID', format: 'uuid' },
                        locationId: { type: 'string', description: 'Location Hierarchy UUID (optional)', format: 'uuid' },
                        description: { type: 'string', description: 'Text description of the event (optional)' },
                        contentType: { type: 'string', description: 'Content type: application/json, application/xml, or text/plain (optional)' },
                        content: { type: 'string', description: 'Content text of the event (optional)' },
                        attachments: {
                            type: 'array',
                            description: 'File attachments as base64-encoded content (optional). Supported file types: PNG, JPEG, PDF, DOC, DOCX, XLS, XLSX',
                            items: {
                                type: 'object',
                                properties: {
                                    fileName: { type: 'string', description: 'Original filename (must have extension: .png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx)' },
                                    base64FileContent: { type: 'string', description: 'File content encoded as base64 string' },
                                    annotation: { type: 'string', description: 'File annotation/notes (optional)' }
                                },
                                required: ['fileName', 'base64FileContent']
                            }
                        }
                    },
                    required: ['projectId', 'iotVendorId', 'iotEventTypeId'],
                },
            },
            {
                name: 'create_iot_event_with_image',
                description: 'Create a new IoT event record with an uploaded image attachment. Use when an image has been uploaded in the conversation.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'Project UUID associated with the IoT Event', format: 'uuid' },
                        eventDate: { type: 'string', description: 'Event date/time in ISO 8601 format (YYYY-MM-DDThh:mm:ss), e.g. 2024-01-15T14:30:00. If not provided, current date/time will be used.', format: 'date-time' },
                        iotVendorId: { type: 'string', description: 'IoT Vendor UUID', format: 'uuid' },
                        iotEventTypeId: { type: 'string', description: 'IoT Event Type UUID', format: 'uuid' },
                        locationId: { type: 'string', description: 'Location Hierarchy UUID (optional)', format: 'uuid' },
                        description: { type: 'string', description: 'Text description of the event (optional)' },
                        contentType: { type: 'string', description: 'Content type: application/json, application/xml, or text/plain (optional)' },
                        content: { type: 'string', description: 'Content text of the event (optional)' },
                        imageBase64: { type: 'string', description: 'Base64-encoded image data from uploaded conversation image' },
                        imageFileName: { type: 'string', description: 'Filename for the image (e.g., "security_camera.jpg", "incident_photo.png")' },
                        imageAnnotation: { type: 'string', description: 'Optional annotation/description for the image attachment' }
                    },
                    required: ['projectId', 'iotVendorId', 'iotEventTypeId', 'imageBase64', 'imageFileName'],
                },
            },
        ];
    }
    // Tool handlers
    async handleListProjects(args) {
        const result = await this.apiClient.listProjects(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleGetProject(args) {
        const result = await this.apiClient.getProject(args.id);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleListWorkers(args) {
        const result = await this.apiClient.listWorkers(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleGetWorker(args) {
        const result = await this.apiClient.getWorker(args.id);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleListWorkerProfiles(args) {
        const result = await this.apiClient.listWorkerProfiles(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleGetWorkerProfile(args) {
        const result = await this.apiClient.getWorkerProfile(args.id, args.includeConfidentialData);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleCreateWorkerProfile(args) {
        const result = await this.apiClient.createWorkerProfile(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleUpdateWorkerProfile(args) {
        const { id, ...updateData } = args;
        const result = await this.apiClient.updateWorkerProfile(id, updateData);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleListEmployers(args) {
        const result = await this.apiClient.listEmployers(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleGetEmployer(args) {
        const result = await this.apiClient.getEmployer(args.id);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleCreateEmployer(args) {
        const result = await this.apiClient.createEmployer(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleListEmployerProfiles(args) {
        const result = await this.apiClient.listEmployerProfiles(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleGetEmployerProfile(args) {
        const result = await this.apiClient.getEmployerProfile(args.id);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleCreateEmployerProfile(args) {
        const result = await this.apiClient.createEmployerProfile(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleUpdateEmployerProfile(args) {
        const { id, ...updateData } = args;
        const result = await this.apiClient.updateEmployerProfile(id, updateData);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleListIoTVendors(args) {
        const result = await this.apiClient.listIoTVendors(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleGetIoTVendor(args) {
        const result = await this.apiClient.getIoTVendor(args.id);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleCreateIoTVendor(args) {
        const result = await this.apiClient.createIoTVendor(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleListIoTEvents(args) {
        const result = await this.apiClient.listIoTEvents(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleGetIoTEvent(args) {
        const result = await this.apiClient.getIoTEvent(args.id);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleCreateIoTEvent(args) {
        // Set current date/time if eventDate is not provided
        if (!args.eventDate) {
            args.eventDate = new Date().toISOString();
        }
        // Validate file types for attachments
        if (args.attachments && Array.isArray(args.attachments)) {
            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx', '.xls', '.xlsx'];
            for (const attachment of args.attachments) {
                if (attachment.fileName) {
                    const fileExtension = attachment.fileName.toLowerCase().substring(attachment.fileName.lastIndexOf('.'));
                    if (!allowedExtensions.includes(fileExtension)) {
                        return {
                            content: [{
                                    type: 'text',
                                    text: `Error: File type not supported. File "${attachment.fileName}" has extension "${fileExtension}". Allowed types: PNG, JPEG, PDF, DOC, DOCX, XLS, XLSX`
                                }],
                        };
                    }
                }
            }
        }
        const result = await this.apiClient.createIoTEvent(args);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    async handleCreateIoTEventWithImage(args) {
        // Set current date/time if eventDate is not provided
        if (!args.eventDate) {
            args.eventDate = new Date().toISOString();
        }
        // Validate image file extension
        const allowedImageExtensions = ['.png', '.jpg', '.jpeg'];
        const fileExtension = args.imageFileName.toLowerCase().substring(args.imageFileName.lastIndexOf('.'));
        if (!allowedImageExtensions.includes(fileExtension)) {
            return {
                content: [{
                        type: 'text',
                        text: `Error: Image file type not supported. File "${args.imageFileName}" has extension "${fileExtension}". Allowed image types: PNG, JPEG`
                    }],
            };
        }
        // Create attachment from image data
        const attachment = {
            fileName: args.imageFileName,
            base64FileContent: args.imageBase64,
            annotation: args.imageAnnotation || undefined
        };
        // Build IoT event data
        const iotEventData = {
            projectId: args.projectId,
            eventDate: args.eventDate,
            iotVendorId: args.iotVendorId,
            iotEventTypeId: args.iotEventTypeId,
            locationId: args.locationId,
            description: args.description,
            contentType: args.contentType,
            content: args.content,
            attachments: [attachment]
        };
        const result = await this.apiClient.createIoTEvent(iotEventData);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    }
    initializeApiClient() {
        const jwtToken = process.env.HAMMERTECH_JWT_TOKEN;
        const region = process.env.HAMMERTECH_REGION || 'us';
        if (!jwtToken) {
            throw new Error('HAMMERTECH_JWT_TOKEN environment variable is required');
        }
        try {
            const config = ConfigSchema.parse({
                jwtToken,
                region,
            });
            this.apiClient = new HammerTechApiClient(config);
        }
        catch (error) {
            throw new Error(`Invalid configuration: ${error}`);
        }
    }
    async run() {
        try {
            this.initializeApiClient();
            const transport = new StdioServerTransport();
            await this.server.connect(transport);
            console.error('HammerTech MCP server running on stdio');
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}
const server = new HammerTechMCPServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map