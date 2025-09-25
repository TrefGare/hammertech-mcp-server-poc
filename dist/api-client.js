import axios from 'axios';
import { getUrlsForRegion } from './types.js';
import { HammerTechAuthClient } from './auth-client.js';
export class HammerTechApiClient {
    config;
    client;
    authClient;
    constructor(config) {
        this.config = config;
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
    async makeRequest(method, endpoint, data, params) {
        try {
            const response = await this.client.request({
                method,
                url: endpoint,
                data,
                params
            });
            return {
                data: response.data,
                status: response.status
            };
        }
        catch (error) {
            // Handle different error response formats:
            // 400: { isSuccess, httpStatusCode, messageText, ... }
            // 500: { Code, Message }
            // 401: empty body
            const errorMessage = error.response?.data?.messageText || // 400 validation errors
                error.response?.data?.Message || // 500 internal errors  
                error.response?.data?.message || // fallback for other formats
                error.message || // network/axios errors
                'Unknown error';
            return {
                error: errorMessage,
                status: error.response?.status || 500
            };
        }
    }
    // Projects
    async listProjects(params) {
        return this.makeRequest('GET', '/api/v1/Projects', undefined, params);
    }
    async getProject(id) {
        return this.makeRequest('GET', `/api/v1/Projects/${id}`);
    }
    // Workers  
    async listWorkers(params) {
        return this.makeRequest('GET', '/api/v1/Workers', undefined, params);
    }
    async getWorker(id) {
        return this.makeRequest('GET', `/api/v1/Workers/${id}`);
    }
    async createWorker(workerData) {
        return this.makeRequest('POST', '/api/v1/Workers', workerData);
    }
    // Worker Profiles
    async listWorkerProfiles(params) {
        return this.makeRequest('GET', '/api/v1/WorkerProfiles', undefined, params);
    }
    async getWorkerProfile(id, includeConfidentialData) {
        const queryParams = includeConfidentialData !== undefined ? { includeConfidentialData } : undefined;
        return this.makeRequest('GET', `/api/v1/WorkerProfiles/${id}`, undefined, queryParams);
    }
    async createWorkerProfile(data) {
        return this.makeRequest('POST', '/api/v1/WorkerProfiles', data);
    }
    async updateWorkerProfile(id, data) {
        return this.makeRequest('PATCH', `/api/v1/WorkerProfiles/${id}`, data);
    }
    // Employers
    async listEmployers(params) {
        return this.makeRequest('GET', '/api/v1/Employers', undefined, params);
    }
    async getEmployer(id) {
        return this.makeRequest('GET', `/api/v1/Employers/${id}`);
    }
    async createEmployer(data) {
        return this.makeRequest('POST', '/api/v1/Employers', data);
    }
    // Employer Profiles
    async listEmployerProfiles(params) {
        return this.makeRequest('GET', '/api/v1/EmployerProfiles', undefined, params);
    }
    async getEmployerProfile(id) {
        return this.makeRequest('GET', `/api/v1/EmployerProfiles/${id}`);
    }
    async createEmployerProfile(data) {
        return this.makeRequest('POST', '/api/v1/EmployerProfiles', data);
    }
    async updateEmployerProfile(id, data) {
        return this.makeRequest('PATCH', `/api/v1/EmployerProfiles/${id}`, data);
    }
    // IoT Vendors
    async listIoTVendors(params) {
        return this.makeRequest('GET', '/api/v1/IoTVendors', undefined, params);
    }
    async getIoTVendor(id) {
        return this.makeRequest('GET', `/api/v1/IoTVendors/${id}`);
    }
    async createIoTVendor(data) {
        return this.makeRequest('POST', '/api/v1/IoTVendors', data);
    }
    // IoT Events
    async listIoTEvents(params) {
        return this.makeRequest('GET', '/api/v1/IoTEvents', undefined, params);
    }
    async getIoTEvent(id) {
        return this.makeRequest('GET', `/api/v1/IoTEvents/${id}`);
    }
    async createIoTEvent(data) {
        return this.makeRequest('POST', '/api/v1/IoTEvents', data);
    }
    // Equipment Inductions
    async listEquipmentInductions(params) {
        return this.makeRequest('GET', '/api/v1/EquipmentInductions', undefined, params);
    }
    // Equipment Profiles
    async listEquipmentProfiles(params) {
        return this.makeRequest('GET', '/api/v1/EquipmentProfiles', undefined, params);
    }
    async getEquipmentProfile(id) {
        return this.makeRequest('GET', `/api/v1/EquipmentProfiles/${id}`);
    }
    async createEquipmentProfile(data) {
        return this.makeRequest('POST', '/api/v1/EquipmentProfiles', data);
    }
    async deleteEquipmentProfile(id) {
        return this.makeRequest('DELETE', `/api/v1/EquipmentProfiles/${id}`);
    }
    // Equipment Categories
    async listEquipmentCategories(params) {
        return this.makeRequest('GET', '/api/v1/EquipmentCategories', undefined, params);
    }
    async getEquipmentCategory(id) {
        return this.makeRequest('GET', `/api/v1/EquipmentCategories/${id}`);
    }
    // Equipment Types
    async listEquipmentTypes(params) {
        return this.makeRequest('GET', '/api/v1/EquipmentTypes', undefined, params);
    }
    async getEquipmentType(id) {
        return this.makeRequest('GET', `/api/v1/EquipmentTypes/${id}`);
    }
    // Job Titles
    async listJobTitles(params) {
        return this.makeRequest('GET', '/api/v1/JobTitles', undefined, params);
    }
}
//# sourceMappingURL=api-client.js.map