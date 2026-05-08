// API service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        return { error: error.detail || `HTTP ${response.status}` };
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { data: undefined as T };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Authentication
  async register(email: string, password: string, fullName?: string) {
    const result = await this.request<{ access_token: string; token_type: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    if (!result.error && result.data?.access_token) {
      localStorage.setItem('auth_token', result.data.access_token);
    }
    return result;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      return { error: error.detail || 'Login failed' };
    }

    const data = await response.json();
    if (data?.access_token) {
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
    const result = await this.request<{ access_token: string; token_type: string }>('/api/auth/aws-register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        full_name: fullName,
        aws_access_key: awsAccessKey,
        aws_secret_key: awsSecretKey,
        aws_region: awsRegion,
      }),
    });
    if (!result.error && result.data?.access_token) {
      localStorage.setItem('auth_token', result.data.access_token);
    }
    return result;
  }

  async getCurrentUser() {
    return this.request<{ id: number; email: string; full_name: string | null; created_at: string }>('/api/auth/me');
  }

  async updateProfile(fullName: string, email: string) {
    return this.request<{ id: number; email: string; full_name: string | null; created_at: string }>(
      '/api/auth/profile',
      { method: 'PUT', body: JSON.stringify({ full_name: fullName, email }) }
    );
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>(
      '/api/auth/password',
      { method: 'PUT', body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) }
    );
  }

  async getEnvVars() {
    return this.request<{ anthropic_api_key_set: boolean; anthropic_api_key_preview: string | null }>(
      '/api/auth/env-vars'
    );
  }

  async updateEnvVars(anthropicApiKey: string | null) {
    return this.request<{ anthropic_api_key_set: boolean; anthropic_api_key_preview: string | null }>(
      '/api/auth/env-vars',
      { method: 'PUT', body: JSON.stringify({ anthropic_api_key: anthropicApiKey }) }
    );
  }

  async logout() {
    await this.request('/api/auth/logout', { method: 'POST' });
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

  // Deployments
  async listDeployments() {
    return this.request<any[]>('/api/deploy/');
  }

  async getDeployment(id: number) {
    return this.request<any>(`/api/deploy/${id}`);
  }

  // F-012: two-phase plan/approve
  async planDeployment(workflowId?: number, workflow?: any) {
    return this.request<any>('/api/deploy/plan', {
      method: 'POST',
      body: JSON.stringify({ workflow_id: workflowId, workflow }),
    });
  }

  async approveDeployment(id: number) {
    return this.request<any>(`/api/deploy/${id}/approve`, { method: 'POST' });
  }

  async destroyDeployment(id: number) {
    return this.request<any>(`/api/deploy/${id}/destroy`, { method: 'POST' });
  }

  async destroyAllDeployments() {
    // F-017: backend requires explicit { confirm: true } body to prevent accidental mass-destroy
    return this.request<{ message: string; count: number }>('/api/deploy/destroy-all', {
      method: 'POST',
      body: JSON.stringify({ confirm: true }),
    });
  }

  async getDeploymentLogs(id: number, afterId = 0) {
    return this.request<{ logs: any[]; deployment_status: string }>(`/api/deploy/${id}/logs?after_id=${afterId}`);
  }

  async disconnectAWS() {
    return this.request<{ message: string }>('/api/auth/disconnect-aws', { method: 'POST' });
  }

  async getAWSStatus() {
    return this.request<{ connected: boolean; auth_method: string | null; region: string | null; role_arn: string | null; external_id: string | null }>(
      '/api/auth/aws-status'
    );
  }

  // F-006: fetch platform IAM ARN from server so it is never hardcoded in FE source
  async getPlatformInfo() {
    return this.request<{ cloudkraft_iam_arn: string }>('/api/auth/platform-info');
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

