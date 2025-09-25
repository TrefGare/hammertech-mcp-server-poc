#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { HammerTechApiClient } from './api-client.js';
import { ConfigSchema, CreateWorkerRequest } from './types.js';

// Reusable sortBy schema constants
const SORT_BY_ID_SCHEMA = {
  type: 'string' as const,
  enum: ['id', 'iddesc'] as const,
  description: 'Sort by ID in ascending or descending order'
};

const SORT_BY_ID_NAME_SCHEMA = {
  type: 'string' as const,
  enum: ['id', 'iddesc', 'name', 'namedesc'] as const,
  description: 'Sort by ID or name in ascending or descending order'
};

const SORT_BY_WORKER_SCHEMA = {
  type: 'string' as const,
  enum: ['id', 'iddesc', 'testcompleted', 'testcompleteddesc'] as const,
  description: 'Sort workers by specified field'
};

const SORT_BY_WORKER_PROFILES_SCHEMA = {
  type: 'string' as const,
  enum: ['id', 'iddesc', 'dob', 'lastinducted', 'lastinducteddesc'] as const,
  description: 'Sort worker profiles by specified field'
};

const SORT_BY_EMPLOYERS_SCHEMA = {
  type: 'string' as const,
  enum: ['id', 'iddesc', 'started', 'starteddesc'] as const,
  description: 'Sort employers by specified field'
};

const SORT_BY_EQUIPMENT_PROFILES_SCHEMA = {
  type: 'string' as const,
  enum: ['id', 'iddesc', 'make'] as const,
  description: 'Sort equipment profiles by specified field'
};

export class HammerTechMCPServer {
  server: Server;
  apiClient: HammerTechApiClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'hammertech-api-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

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
          // Status
          case 'status_ping':
            return this.handleStatusPing();

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
          case 'create_worker':
            return await this.handleCreateWorker(args as unknown as CreateWorkerRequest);

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

          // Equipment Inductions  
          case 'list_equipment_inductions':
            return await this.handleListEquipmentInductions(args);

          // Equipment Profiles
          case 'list_equipment_profiles':
            return await this.handleListEquipmentProfiles(args);
          case 'get_equipment_profile':
            return await this.handleGetEquipmentProfile(args);
          case 'create_equipment_profile':
            return await this.handleCreateEquipmentProfile(args);
          case 'delete_equipment_profile':
            return await this.handleDeleteEquipmentProfile(args);

          // Equipment Categories
          case 'list_equipment_categories':
            return await this.handleListEquipmentCategories(args);
          case 'get_equipment_category':
            return await this.handleGetEquipmentCategory(args);

          // Equipment Types
          case 'list_equipment_types':
            return await this.handleListEquipmentTypes(args);
          case 'get_equipment_type':
            return await this.handleGetEquipmentType(args);

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

          // Help Center
          case 'help_search':
            return await this.handleHelpSearch(args);
          case 'help_get':
            return await this.handleHelpGet(args);
          case 'help_summarize':
            return await this.handleHelpSummarize(args);

          // Job Titles
          case 'list_job_titles':
            return await this.handleListJobTitles(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
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
      // Status
      {
        name: 'status_ping',
        description: 'Check server status and configuration',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      // Projects - does not support sortBy
      {
        name: 'list_projects',
        description: 'List construction projects with optional filtering and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            skip: { type: 'number', description: 'Number of records to skip for pagination' },
            take: { type: 'number', description: 'Number of records to take (max 100)' },
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
            id: { type: 'string', description: 'Project ID' },
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
            sortBy: SORT_BY_WORKER_SCHEMA,
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
      {
        name: 'create_worker',
        description: 'Create a new worker (assign a Worker Profile to a Project). IMPORTANT: All required information must be collected from the user - do not assume or provide default values.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project UUID - must be provided by user', format: 'uuid' },
            employerId: { type: 'string', description: 'Employer UUID (subcontractor/supplier organization) - must be provided by user', format: 'uuid' },
            workerProfileId: { type: 'string', description: 'Worker Profile UUID (the person being assigned to the project) - must be provided by user', format: 'uuid' },
            inductionChecklistSignatureFileId: { type: 'string', description: 'Signed induction checklist file ID (optional)', format: 'uuid' },
          },
          required: ['projectId', 'employerId', 'workerProfileId'],
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
            sortBy: SORT_BY_WORKER_PROFILES_SCHEMA,
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
        description: 'Create a new worker profile (unique individual/person within the company). IMPORTANT: All required information must be collected from the user - do not assume or provide default values.',
        inputSchema: {
          type: 'object',
          properties: {
            firstName: { type: 'string', description: 'Worker first name - must be provided by user' },
            lastName: { type: 'string', description: 'Worker last name - must be provided by user' },
            dateOfBirth: { type: 'string', description: 'Actual date of birth in extended ISO 8601 format (YYYY-MM-DDThh:mm:ss), e.g. 1970-01-01T00:00:00 - MUST be the real birthdate, never use placeholder dates' },
            jobTitle: { type: 'string', description: 'Worker job title/position - must be provided by user' },
            preferredCommunicationLanguage: { type: 'string', description: 'BCP 47 language tag (e.g. en-US, es-ES) - ask user for their preference' },
            email: { type: 'string', description: 'Worker email address - must be provided by user' },
          },
          required: ['firstName', 'lastName', 'dateOfBirth', 'jobTitle', 'preferredCommunicationLanguage'],
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
            jobTitle: { type: 'string', description: 'Worker job title/position' },
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
            sortBy: SORT_BY_EMPLOYERS_SCHEMA,
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
            businessName: { type: 'string', description: 'Business/company name' },
            description: { type: 'string', description: 'Employer description' },
          },
          required: ['businessName'],
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
            sortBy: SORT_BY_ID_NAME_SCHEMA,
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
        description: 'Create a new employer profile (master company/organization record). IMPORTANT: All information must be collected from the user - do not assume or provide default values.',
        inputSchema: {
          type: 'object',
          properties: {
            businessName: { type: 'string', description: 'Company/organization business name - must be provided by user' },
            abn: { type: 'string', description: 'Australia Business Number (optional)' },
            internalIdentifier: { type: 'string', description: 'Internal company identifier (optional)' },
          },
          required: ['businessName'],
        },
      },
      {
        name: 'update_employer_profile',
        description: 'Update an existing employer profile (master company/organization record)',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Employer Profile ID' },
            businessName: { type: 'string', description: 'Company/organization business name' },
            abn: { type: 'string', description: 'Australia Business Number' },
            internalIdentifier: { type: 'string', description: 'Internal company identifier' },
          },
          required: ['id'],
        },
      },

      // Equipment Inductions
      {
        name: 'list_equipment_inductions',
        description: 'List equipment inductions with optional filtering and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            skip: { type: 'number' },
            take: { type: 'number' },
            sortBy: SORT_BY_ID_SCHEMA,
            modifiedSince: { type: 'string' },
            projectId: { type: 'string' },
            includeDeleted: { type: 'boolean' },
          },
        },
      },

      // Equipment Profiles
      {
        name: 'list_equipment_profiles',
        description: 'List equipment profiles (master records for construction equipment) with optional filtering and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            skip: { type: 'number' },
            take: { type: 'number' },
            sortBy: SORT_BY_EQUIPMENT_PROFILES_SCHEMA,
            modifiedSince: { type: 'string' },
            projectId: { type: 'string' },
            includeDeleted: { type: 'boolean' },
          },
        },
      },
      {
        name: 'get_equipment_profile',
        description: 'Retrieve a specific equipment profile by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Equipment Profile ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_equipment_profile',
        description: 'Create a new equipment profile record',
        inputSchema: {
          type: 'object',
          properties: {
            make: { type: 'string', description: 'Equipment make/manufacturer' },
            model: { type: 'string', description: 'Equipment model' },
            year: { type: 'number', description: 'Manufacturing year' },
            registrationNumber: { type: 'string', description: 'Registration/license number' },
            equipmentTypeId: { type: 'string', description: 'Equipment Type ID', format: 'uuid' },
            projectId: { type: 'string', description: 'Project ID', format: 'uuid' },
          },
          required: ['make', 'equipmentTypeId', 'projectId'],
        },
      },
      {
        name: 'delete_equipment_profile',
        description: 'Delete an equipment profile by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Equipment Profile ID' },
          },
          required: ['id'],
        },
      },

      // Equipment Categories
      {
        name: 'list_equipment_categories',
        description: 'List equipment categories with optional filtering and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            skip: { type: 'number' },
            take: { type: 'number' },
            sortBy: SORT_BY_ID_NAME_SCHEMA,
            modifiedSince: { type: 'string' },
            projectId: { type: 'string' },
          },
        },
      },
      {
        name: 'get_equipment_category',
        description: 'Retrieve a specific equipment category by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Equipment Category ID' },
          },
          required: ['id'],
        },
      },

      // Equipment Types
      {
        name: 'list_equipment_types',
        description: 'List equipment types with optional filtering and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            skip: { type: 'number' },
            take: { type: 'number' },
            sortBy: SORT_BY_ID_NAME_SCHEMA,
            modifiedSince: { type: 'string' },
            projectId: { type: 'string' },
          },
        },
      },
      {
        name: 'get_equipment_type',
        description: 'Retrieve a specific equipment type by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Equipment Type ID' },
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
            sortBy: SORT_BY_ID_SCHEMA,
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
        description: 'Create a new IoT event record with an uploaded image attachment. CRITICAL: Do NOT fabricate or create fake base64 image data. Only use actual image data from uploaded files.',
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

      // Help Center
      {
        name: 'help_search',
        description: 'Search https://help.hammertech.com for articles',
        inputSchema: {
          type: 'object',
          properties: {
            q: { type: 'string', description: 'Search query' },
            locale: { type: 'string', description: 'Language locale (default: en-us)' },
            limit: { type: 'number', description: 'Maximum number of results (1-10, default: 5)' },
          },
          required: ['q'],
        },
      },
      {
        name: 'help_get',
        description: 'Fetch a specific Help Center article by ID or slug',
        inputSchema: {
          type: 'object',
          properties: {
            idOrSlug: { type: 'string', description: 'Article ID or slug' },
            locale: { type: 'string', description: 'Language locale (default: en-us)' },
            format: { type: 'string', description: 'Response format: markdown or html (default: markdown)' },
          },
          required: ['idOrSlug'],
        },
      },
      {
        name: 'help_summarize',
        description: 'Fetch an article and return a concise summary plus key steps',
        inputSchema: {
          type: 'object',
          properties: {
            idOrSlug: { type: 'string', description: 'Article ID or slug' },
            locale: { type: 'string', description: 'Language locale (default: en-us)' },
            maxBullets: { type: 'number', description: 'Maximum number of bullet points (1-8, default: 5)' },
          },
          required: ['idOrSlug'],
        },
      },

      // Job Titles
      {
        name: 'list_job_titles',
        description: 'List available job titles with optional filtering and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            skip: { type: 'number', description: 'Number of records to skip for pagination' },
            take: { type: 'number', description: 'Number of records to take (max 100)' },
            sortBy: SORT_BY_ID_NAME_SCHEMA,
            modifiedSince: { type: 'string', description: 'ISO datetime to filter modified records' },
            projectId: { type: 'string', description: 'Filter by project ID' },
          },
        },
      },
    ];
  }

  // Tool handlers
  handleStatusPing() {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          ok: true,
          server: 'hammertech-api-server',
          version: '1.0.0',
          region: process.env.HAMMERTECH_REGION || 'us',
          authConfigured: !!process.env.HAMMERTECH_JWT_TOKEN,
        }, null, 2)
      }],
    };
  }

  async handleListProjects(args: any) {
    const result = await this.apiClient!.listProjects(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetProject(args: any) {
    const result = await this.apiClient!.getProject(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListWorkers(args: any) {
    const result = await this.apiClient!.listWorkers(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetWorker(args: any) {
    const result = await this.apiClient!.getWorker(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleCreateWorker(args: CreateWorkerRequest) {
    // Validate that required fields are provided
    if (!args.projectId || !args.employerId || !args.workerProfileId) {
      return {
        content: [{
          type: 'text',
          text: 'Error: All required fields must be provided (projectId, employerId, workerProfileId). Please ask the user for this information.'
        }],
      };
    }

    const result = await this.apiClient!.createWorker(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListWorkerProfiles(args: any) {
    const result = await this.apiClient!.listWorkerProfiles(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetWorkerProfile(args: any) {
    const result = await this.apiClient!.getWorkerProfile(args.id, args.includeConfidentialData);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleCreateWorkerProfile(args: any) {
    // Validate that required fields are provided and not placeholder values
    if (!args.firstName || !args.lastName || !args.dateOfBirth || !args.jobTitle || !args.preferredCommunicationLanguage) {
      return {
        content: [{
          type: 'text',
          text: 'Error: All required fields must be provided (firstName, lastName, dateOfBirth, jobTitle, preferredCommunicationLanguage). Please ask the user for this information.'
        }],
      };
    }

    // Check for common placeholder dates that should not be used
    const placeholderDates = ['1990-01-01', '2000-01-01', '1980-01-01', '1970-01-01'];
    const dateOnly = args.dateOfBirth.split('T')[0];
    if (placeholderDates.includes(dateOnly)) {
      return {
        content: [{
          type: 'text',
          text: `Error: The date ${dateOnly} appears to be a placeholder. Please ask the user for their actual date of birth.`
        }],
      };
    }

    const result = await this.apiClient!.createWorkerProfile(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleUpdateWorkerProfile(args: any) {
    const { id, ...updateData } = args;
    const result = await this.apiClient!.updateWorkerProfile(id, updateData);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListEmployers(args: any) {
    const result = await this.apiClient!.listEmployers(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetEmployer(args: any) {
    const result = await this.apiClient!.getEmployer(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleCreateEmployer(args: any) {
    const result = await this.apiClient!.createEmployer(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListEmployerProfiles(args: any) {
    const result = await this.apiClient!.listEmployerProfiles(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetEmployerProfile(args: any) {
    const result = await this.apiClient!.getEmployerProfile(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleCreateEmployerProfile(args: any) {
    const result = await this.apiClient!.createEmployerProfile(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleUpdateEmployerProfile(args: any) {
    const { id, ...updateData } = args;
    const result = await this.apiClient!.updateEmployerProfile(id, updateData);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListEquipmentInductions(args: any) {
    const result = await this.apiClient!.listEquipmentInductions(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListEquipmentProfiles(args: any) {
    const result = await this.apiClient!.listEquipmentProfiles(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetEquipmentProfile(args: any) {
    const result = await this.apiClient!.getEquipmentProfile(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleCreateEquipmentProfile(args: any) {
    // Validate required fields
    if (!args.make || !args.equipmentTypeId || !args.projectId) {
      return {
        content: [{ type: 'text', text: 'Error: make, equipmentTypeId, and projectId are required fields.' }],
        isError: true,
      };
    }

    const result = await this.apiClient!.createEquipmentProfile(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleDeleteEquipmentProfile(args: any) {
    const result = await this.apiClient!.deleteEquipmentProfile(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListEquipmentCategories(args: any) {
    const result = await this.apiClient!.listEquipmentCategories(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetEquipmentCategory(args: any) {
    const result = await this.apiClient!.getEquipmentCategory(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListEquipmentTypes(args: any) {
    const result = await this.apiClient!.listEquipmentTypes(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetEquipmentType(args: any) {
    const result = await this.apiClient!.getEquipmentType(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListIoTVendors(args: any) {
    const result = await this.apiClient!.listIoTVendors(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetIoTVendor(args: any) {
    const result = await this.apiClient!.getIoTVendor(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleCreateIoTVendor(args: any) {
    const result = await this.apiClient!.createIoTVendor(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleListIoTEvents(args: any) {
    const result = await this.apiClient!.listIoTEvents(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleGetIoTEvent(args: any) {
    const result = await this.apiClient!.getIoTEvent(args.id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleCreateIoTEvent(args: any) {
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

    const result = await this.apiClient!.createIoTEvent(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  async handleCreateIoTEventWithImage(args: any) {
    // Validate required parameters
    if (!args.projectId) {
      return {
        content: [{ type: 'text', text: 'Error: projectId is required' }]
      };
    }
    if (!args.iotVendorId) {
      return {
        content: [{ type: 'text', text: 'Error: iotVendorId is required' }]
      };
    }
    if (!args.iotEventTypeId) {
      return {
        content: [{ type: 'text', text: 'Error: iotEventTypeId is required' }]
      };
    }
    if (!args.imageBase64) {
      return {
        content: [{ type: 'text', text: 'Error: imageBase64 is required' }]
      };
    }
    if (!args.imageFileName) {
      return {
        content: [{ type: 'text', text: 'Error: imageFileName is required' }]
      };
    }

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

    // Aggressive validation to detect fake/placeholder base64 image data
    const base64Data = args.imageBase64;
    
    // Check minimum size (real images are typically much larger)
    if (base64Data.length < 100) {
      return {
        content: [{
          type: 'text',
          text: 'Error: Image data appears to be invalid or too small. Please provide actual image data from an uploaded file.'
        }],
      };
    }
    
    // Check for common fake/placeholder patterns
    const suspiciousPatterns = [
      /^iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==$/, // 1x1 transparent PNG
      /^iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFElEQVR42mNkYPhfz0AEYBxVSF+FAP\/\/Y\/+RkMOnAAAAAElFTkSuQmCC$/, // 10x10 checkerboard
      /^\/9j\/4AAQSkZJRgABAQEAYABgAAD$/, // Minimal JPEG header
      /^UklGRiQAAABXRUJQVlA4$/, // WebP header
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(base64Data)) {
        return {
          content: [{
            type: 'text',
            text: 'Error: The provided image data appears to be a placeholder or fake image. Please provide actual image data from an uploaded file, not fabricated data.'
          }],
        };
      }
    }
    
    // Check for obviously fake text patterns in the base64
    const textPatterns = [
      /test/i, /fake/i, /placeholder/i, /dummy/i, /sample/i, /example/i
    ];
    
    for (const pattern of textPatterns) {
      if (pattern.test(base64Data)) {
        return {
          content: [{
            type: 'text',
            text: 'Error: The provided image data contains suspicious text patterns suggesting it is not real image data. Please provide actual image data from an uploaded file.'
          }],
        };
      }
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

    const result = await this.apiClient!.createIoTEvent(iotEventData);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  // Help Center handlers
  async handleHelpSearch(args: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `Help Center search is currently unavailable due to Cloudflare bot protection. Please access help.hammertech.com directly in your browser to search for "${args.q}".` 
      }],
      isError: true,
    };
  }

  async handleHelpGet(args: any) {
    const { idOrSlug } = args;
    return {
      content: [{ 
        type: 'text', 
        text: `Help Center articles are currently unavailable due to Cloudflare bot protection. Please access https://help.hammertech.com/hc/en-us/articles/${idOrSlug} directly in your browser.` 
      }],
      isError: true,
    };
  }

  async handleHelpSummarize(args: any) {
    const { idOrSlug } = args;
    return {
      content: [{ 
        type: 'text', 
        text: `Help Center summarization is currently unavailable due to Cloudflare bot protection. Please access https://help.hammertech.com/hc/en-us/articles/${idOrSlug} directly in your browser to read the article.` 
      }],
      isError: true,
    };
  }

  // Help Center helper methods
  async fetchHelpArticle(idOrSlug: string, locale = 'en-us'): Promise<any> {
    try {
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const slug = String(idOrSlug).replace(/^\/+|\/+$/g, '');
      const url = `https://help.hammertech.com/hc/${locale}/articles/${slug}`;
      const res = await fetch(url, {
        headers: { 
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1"
        },
      });
      if (!res.ok) return { url, status: res.status, markdown: null, html: null };
      const html = await res.text();
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const bodyMatch = html.match(
        /<div[^>]+class=["'][^"']*(article-body|article__body|zd-article|article-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
      );
      const rawBody = bodyMatch ? bodyMatch[2] : html;
      const text = rawBody
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : slug;
      return { url, title, html: rawBody, markdown: `# ${title}\n\n${text}` };
    } catch (e) {
      return { url: String(idOrSlug), error: String(e), markdown: null, html: null };
    }
  }

  async searchHelp(q: string, locale = 'en-us', limit = 5): Promise<any> {
    try {
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const url = `https://help.hammertech.com/hc/${locale}/search?query=${encodeURIComponent(q)}`;
      const res = await fetch(url, { 
        headers: { 
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1"
        }
      });
      if (!res.ok) return { url, items: [], status: res.status };
      const html = await res.text();
      const re = /href=\"\/hc\/[^\"]*\/articles\/([0-9]+-[^\"]+)\"[^>]*>(.*?)<\/a>/gi;
      const items = [];
      const seen = new Set();
      let m;
      while ((m = re.exec(html)) && items.length < limit) {
        const slug = m[1];
        const title = m[2].replace(/<[^>]+>/g, "").trim();
        if (seen.has(slug)) continue;
        seen.add(slug);
        items.push({
          idOrSlug: slug,
          title,
          url: `https://help.hammertech.com/hc/${locale}/articles/${slug}`,
        });
      }
      return { url, items };
    } catch (e) {
      return { url: null, items: [], error: String(e) };
    }
  }

  // Job Title handlers
  async handleListJobTitles(args: any) {
    const result = await this.apiClient!.listJobTitles(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  initializeApiClient() {
    const jwtToken = process.env.HAMMERTECH_JWT_TOKEN;
    const region = (process.env.HAMMERTECH_REGION || 'us') as 'us' | 'au' | 'eu';

    if (!jwtToken) {
      throw new Error('HAMMERTECH_JWT_TOKEN environment variable is required');
    }

    try {
      const config = ConfigSchema.parse({
        jwtToken,
        region,
      });

      this.apiClient = new HammerTechApiClient(config);
    } catch (error) {
      throw new Error(`Invalid configuration: ${error}`);
    }
  }

  async run() {
    try {
      this.initializeApiClient();
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error('HammerTech MCP server running on stdio');
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

const server = new HammerTechMCPServer();
server.run().catch(console.error);