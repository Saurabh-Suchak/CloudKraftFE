// API service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        return { error: error.detail || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Authentication
  async register(email: string, password: string, fullName?: string) {
    return this.request<{ access_token: string; token_type: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  }

  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData as any),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      return { error: error.detail || 'Login failed' };
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('auth_token', data.access_token);
    }
    return { data };
  }

  async registerWithAWS(
    email: string,
    fullName: string,
    awsAccessKey: string,
    awsSecretKey: string,
    awsRegion: string
  ) {
    return this.request<{ access_token: string; token_type: string }>('/api/auth/aws-register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        full_name: fullName,
        aws_access_key: awsAccessKey,
        aws_secret_key: awsSecretKey,
        aws_region: awsRegion,
      }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  // Workflows
  async getWorkflows() {
    return this.request<any[]>('/api/workflows');
  }

  async getWorkflow(id: number) {
    return this.request<any>(`/api/workflows/${id}`);
  }

  async createWorkflow(name: string, description: string, workflowState: any) {
    return this.request<any>('/api/workflows', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        workflow_state: workflowState,
      }),
    });
  }

  async updateWorkflow(id: number, updates: any) {
    return this.request<any>(`/api/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteWorkflow(id: number) {
    return this.request(`/api/workflows/${id}`, {
      method: 'DELETE',
    });
  }

  // Code Generation
  async generateCode(workflowId?: number, workflow?: any) {
    return this.request<{ terraform_code: string; files: Array<{ filename: string; content: string }> }>(
      '/api/codegen/generate',
      {
        method: 'POST',
        body: JSON.stringify({
          workflow_id: workflowId,
          workflow: workflow,
        }),
      }
    );
  }

  async estimateCost(workflow: any) {
    return this.request<{
      total_monthly_low: number;
      total_monthly_high: number;
      line_items: Array<{
        resource: string;
        resource_type: string;
        monthly_usd_low: number;
        monthly_usd_high: number;
        notes: string;
      }>;
      disclaimer: string;
    }>('/api/codegen/estimate', {
      method: 'POST',
      body: JSON.stringify({ workflow }),
    });
  }

  // AI Architecture Generation
  async generateFromPrompt(prompt: string) {
    return this.request<{ workflow_state: any; description: string }>('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  // Validation
  // AWS Connection
  async connectAWS(payload: {
    auth_method: 'access_key' | 'assume_role';
    region: string;
    access_key?: string;
    secret_key?: string;
    role_arn?: string;
    external_id?: string;
  }) {
    return this.request<{ connected: boolean; auth_method: string; region: string; role_arn?: string }>(
      '/api/auth/connect-aws',
      { method: 'POST', body: JSON.stringify(payload) }
    );
  }

  async getAWSStatus() {
    return this.request<{ connected: boolean; auth_method: string | null; region: string | null; role_arn: string | null }>(
      '/api/auth/aws-status'
    );
  }

  async validateCode(
    terraformCode: string,
    files?: Array<{ filename: string; content: string }>,
  ) {
    return this.request<{
      valid: boolean;
      errors: Array<{
        type: string;
        severity: string;
        message: string;
        line?: number;
        column?: number;
        resource?: string;
      }>;
      warnings: Array<{
        type: string;
        severity: string;
        message: string;
        line?: number;
        column?: number;
        resource?: string;
      }>;
      method: string;
      validator_version?: string;
    }>('/api/validation/validate', {
      method: 'POST',
      body: JSON.stringify({ terraform_code: terraformCode, files: files ?? [] }),
    });
  }
}

export const apiService = new ApiService();

