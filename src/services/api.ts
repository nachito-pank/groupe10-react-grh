import { ApiAuthResponse, AuthResponse, Employee, LeaveRequest, Service } from '../types';

const base_url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new ApiError(response.status, error.message || 'Une erreur est survenue');
  }
  return response.json();
}

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    service_id?: number;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${base_url}/api/groupe-10/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(
      "https://api.react.nos-apps.com/api/groupe-10/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur login");
    }

    const json: ApiAuthResponse = await response.json();

    console.log("🔍 API LOGIN JSON =", json);

    // 👇 ICI EST LA CORRECTION CRUCIALE
    return json.data;
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${base_url}/api/groupe-10/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    await handleResponse<void>(response);
  },
};

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    const response = await fetch(`${base_url}/api/groupe-10/employes`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Employee[]>(response);
  },

  getProfile: async (): Promise<Employee> => {
    const response = await fetch(`${base_url}/api/groupe-10/mon-profil`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Employee>(response);
  },

  create: async (data: { user_id: number; role: string; service_id: number }): Promise<Employee> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/employes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Employee>(response);
  },
};

export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await fetch(`${base_url}/api/groupe-10/services`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Service[]>(response);
  },

  create: async (data: { nom: string; description?: string }): Promise<Service> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Service>(response);
  },
};

export const leaveApi = {
  getAll: async (): Promise<LeaveRequest[]> => {
    const response = await fetch(`${base_url}/api/groupe-10/conges`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<LeaveRequest[]>(response);
  },

  create: async (data: {
    date_debut: string;
    date_fin: string;
    raison: string;
  }): Promise<LeaveRequest> => {
    const response = await fetch(`${base_url}/api/groupe-10/conges`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<LeaveRequest>(response);
  },

  updateStatus: async (id: number, status: 'approved' | 'rejected'): Promise<LeaveRequest> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/conges/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<LeaveRequest>(response);
  },
};