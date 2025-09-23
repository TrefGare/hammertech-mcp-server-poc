import { z } from 'zod';

// Configuration schema - secure token-based approach
export const ConfigSchema = z.object({
  // JWT token (required) - tenant will be extracted from this
  jwtToken: z.string(),
  // Region determines both API and auth URLs
  region: z.enum(['us', 'au', 'eu']).default('us')
});

// Helper function to get URLs based on region
export function getUrlsForRegion(region: 'us' | 'au' | 'eu') {
  const urlMap = {
    us: {
      apiUrl: 'https://us-api.hammertechonline.com',
      authUrl: 'https://us-auth.hammertechonline.com',
    },
    au: {
      apiUrl: 'https://au-api.hammertechonline.com',
      authUrl: 'https://au-auth.hammertechonline.com',
    },
    eu: {
      apiUrl: 'https://eu-api.hammertechonline.com',
      authUrl: 'https://eu-auth.hammertechonline.com',
    }
  };
  return urlMap[region];
}

export type Config = z.infer<typeof ConfigSchema>;

// Common API response types
export interface HammerTechApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Query parameters for list endpoints
export interface ListParams {
  skip?: number;
  take?: number;
  sortBy?: string;
  modifiedSince?: string;
  projectId?: string;
}

// POC-focused endpoint types
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

// Create request types
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

// JWT Token Response - HammerTech format
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

// Standard OAuth2 format (fallback)
export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

// Authentication configuration
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