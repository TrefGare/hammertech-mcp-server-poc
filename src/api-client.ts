import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Config, 
  HammerTechApiResponse, 
  ListParams,
  ProjectDescriptor,
  WorkerDescriptor,
  WorkerProfileDescriptor,
  EmployerDescriptor,
  EmployerProfileDescriptor,
  IoTVendorDescriptor,
  IoTEventDescriptor,
  CreateWorkerProfileRequest,
  CreateEmployerRequest,
  CreateIoTEventRequest,
  getUrlsForRegion
} from './types.js';
import { HammerTechAuthClient } from './auth-client.js';

export class HammerTechApiClient {
  private client: AxiosInstance;
  private authClient: HammerTechAuthClient;

  constructor(private config: Config) {
    const urls = getUrlsForRegion(config.region);
    this.authClient = new HammerTechAuthClient(config);
    
    this.client = axios.create({
      baseURL: urls.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor to ensure valid JWT token
    this.client.interceptors.request.use(async (requestConfig) => {
      const token = await this.authClient.getValidToken();
      requestConfig.headers['Authorization'] = `Bearer ${token}`;
      return requestConfig;
    });
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<HammerTechApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url: endpoint,
        data,
        params
      });

      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || error.message || 'Unknown error',
        status: error.response?.status || 500
      };
    }
  }

  // Projects
  async listProjects(params?: ListParams): Promise<HammerTechApiResponse<ProjectDescriptor[]>> {
    return this.makeRequest<ProjectDescriptor[]>('GET', '/api/v1/Projects', undefined, params);
  }

  async getProject(id: string): Promise<HammerTechApiResponse<ProjectDescriptor>> {
    return this.makeRequest<ProjectDescriptor>('GET', `/api/v1/Projects/${id}`);
  }

  // Workers  
  async listWorkers(params?: ListParams): Promise<HammerTechApiResponse<WorkerDescriptor[]>> {
    return this.makeRequest<WorkerDescriptor[]>('GET', '/api/v1/Workers', undefined, params);
  }

  async getWorker(id: string): Promise<HammerTechApiResponse<WorkerDescriptor>> {
    return this.makeRequest<WorkerDescriptor>('GET', `/api/v1/Workers/${id}`);
  }

  // Worker Profiles
  async listWorkerProfiles(params?: ListParams): Promise<HammerTechApiResponse<WorkerProfileDescriptor[]>> {
    return this.makeRequest<WorkerProfileDescriptor[]>('GET', '/api/v1/WorkerProfiles', undefined, params);
  }

  async getWorkerProfile(id: string, includeConfidentialData?: boolean): Promise<HammerTechApiResponse<WorkerProfileDescriptor>> {
    const queryParams = includeConfidentialData !== undefined ? { includeConfidentialData } : undefined;
    return this.makeRequest<WorkerProfileDescriptor>('GET', `/api/v1/WorkerProfiles/${id}`, undefined, queryParams);
  }

  async createWorkerProfile(data: CreateWorkerProfileRequest): Promise<HammerTechApiResponse<WorkerProfileDescriptor>> {
    return this.makeRequest<WorkerProfileDescriptor>('POST', '/api/v1/WorkerProfiles', data);
  }

  async updateWorkerProfile(id: string, data: Partial<CreateWorkerProfileRequest>): Promise<HammerTechApiResponse<WorkerProfileDescriptor>> {
    return this.makeRequest<WorkerProfileDescriptor>('PATCH', `/api/v1/WorkerProfiles/${id}`, data);
  }

  // Employers
  async listEmployers(params?: ListParams): Promise<HammerTechApiResponse<EmployerDescriptor[]>> {
    return this.makeRequest<EmployerDescriptor[]>('GET', '/api/v1/Employers', undefined, params);
  }

  async getEmployer(id: string): Promise<HammerTechApiResponse<EmployerDescriptor>> {
    return this.makeRequest<EmployerDescriptor>('GET', `/api/v1/Employers/${id}`);
  }

  async createEmployer(data: CreateEmployerRequest): Promise<HammerTechApiResponse<EmployerDescriptor>> {
    return this.makeRequest<EmployerDescriptor>('POST', '/api/v1/Employers', data);
  }

  // Employer Profiles
  async listEmployerProfiles(params?: ListParams): Promise<HammerTechApiResponse<EmployerProfileDescriptor[]>> {
    return this.makeRequest<EmployerProfileDescriptor[]>('GET', '/api/v1/EmployerProfiles', undefined, params);
  }

  async getEmployerProfile(id: string): Promise<HammerTechApiResponse<EmployerProfileDescriptor>> {
    return this.makeRequest<EmployerProfileDescriptor>('GET', `/api/v1/EmployerProfiles/${id}`);
  }

  async createEmployerProfile(data: any): Promise<HammerTechApiResponse<EmployerProfileDescriptor>> {
    return this.makeRequest<EmployerProfileDescriptor>('POST', '/api/v1/EmployerProfiles', data);
  }

  async updateEmployerProfile(id: string, data: any): Promise<HammerTechApiResponse<EmployerProfileDescriptor>> {
    return this.makeRequest<EmployerProfileDescriptor>('PATCH', `/api/v1/EmployerProfiles/${id}`, data);
  }

  // IoT Vendors
  async listIoTVendors(params?: ListParams): Promise<HammerTechApiResponse<IoTVendorDescriptor[]>> {
    return this.makeRequest<IoTVendorDescriptor[]>('GET', '/api/v1/IoTVendors', undefined, params);
  }

  async getIoTVendor(id: string): Promise<HammerTechApiResponse<IoTVendorDescriptor>> {
    return this.makeRequest<IoTVendorDescriptor>('GET', `/api/v1/IoTVendors/${id}`);
  }

  async createIoTVendor(data: any): Promise<HammerTechApiResponse<IoTVendorDescriptor>> {
    return this.makeRequest<IoTVendorDescriptor>('POST', '/api/v1/IoTVendors', data);
  }

  // IoT Events
  async listIoTEvents(params?: ListParams): Promise<HammerTechApiResponse<IoTEventDescriptor[]>> {
    return this.makeRequest<IoTEventDescriptor[]>('GET', '/api/v1/IoTEvents', undefined, params);
  }

  async getIoTEvent(id: string): Promise<HammerTechApiResponse<IoTEventDescriptor>> {
    return this.makeRequest<IoTEventDescriptor>('GET', `/api/v1/IoTEvents/${id}`);
  }

  async createIoTEvent(data: CreateIoTEventRequest): Promise<HammerTechApiResponse<IoTEventDescriptor>> {
    return this.makeRequest<IoTEventDescriptor>('POST', '/api/v1/IoTEvents', data);
  }
}