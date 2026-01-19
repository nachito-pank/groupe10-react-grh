import { AuthResponse, Employee, LeaveRequest, Service } from '../types';

const base_url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

console.log('🔌 API Base URL:', base_url);

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('🔐 Token present:', !!token);
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: any = { message: 'Une erreur est survenue' };
    try {
      errorData = await response.json();
    } catch (e) {
      // Si la réponse n'est pas JSON, utiliser le texte
      try {
        const text = await response.text();
        console.error('Response text:', text);
      } catch (e2) {
        console.error('Could not read response');
      }
    }

    const errorMessage = errorData?.message || errorData?.error || 'Une erreur est survenue';
    console.error(`API Error [${response.status}]:`, errorData);
    throw new ApiError(response.status, errorMessage);
  }

  const json = await response.json();
  console.log('📥 Raw response:', json);
  console.log('📥 Response type:', Array.isArray(json) ? 'array' : typeof json);

  // Normaliser la réponse - si c'est un objet avec une clé 'data', l'extraire
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    // Chercher les clés communes de structure imbriquée
    if ('data' in json) {
      console.log('📥 Extracting data property');
      return json.data as T;
    }
    if ('employes' in json) {
      console.log('📥 Extracting employes property');
      return json.employes as T;
    }
    if ('services' in json) {
      console.log('📥 Extracting services property');
      return json.services as T;
    }
    if ('conges' in json) {
      console.log('📥 Extracting conges property');
      return json.conges as T;
    }
    // Si c'est un objet mais qu'on attendait un array, logger l'erreur
    if (Array.isArray(json) === false && typeof json === 'object') {
      console.warn('⚠️ Response is an object but array was expected, returning as-is:', json);
    }
  }

  return json as T;
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
      `${base_url}/api/groupe-10/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const raw = await response.text().catch(() => '');
    let json: any = {};
    try {
      json = raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('Login response not JSON:', raw);
      throw new ApiError(response.status, 'Réponse inattendue du serveur');
    }

    console.log('🔍 API LOGIN JSON =', json);

    // Try several common shapes and normalize the user shape to match `AuthResponse`
    // 1) { success: boolean, data: { token, user } }
    // 2) { token, user }
    // 3) { data: { data: { token, user } } }

    let authCandidate: any = null;
    if (json?.data && json.data.token && json.data.user) {
      authCandidate = json.data;
    } else if (json?.token && json?.user) {
      authCandidate = json;
    } else if (json?.data?.data && json.data.data.token && json.data.data.user) {
      authCandidate = json.data.data;
    }

    if (authCandidate) {
      // Normalize user: some backends nest role/service in `groupe10_employe`
      const rawUser: any = authCandidate.user || {};
      const normalizedUser = {
        id: rawUser.id,
        name: rawUser.name || rawUser.nom || '',
        email: rawUser.email,
        // prefer direct role, fallback to nested groupe10_employe.role
        role: (rawUser.role || rawUser.groupe10_employe?.role || '').toLowerCase() || 'employe',
        service_id: rawUser.service_id ?? rawUser.groupe10_employe?.service_id ?? undefined,
      } as any;

      return { token: authCandidate.token, user: normalizedUser } as AuthResponse;
    }

    // Not ok
    if (!response.ok) {
      const errMsg = json?.message || json?.error || 'Erreur login';
      throw new ApiError(response.status, errMsg);
    }

    throw new ApiError(response.status, 'Format de réponse inattendu pour login');
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
  getProfile: async (): Promise<Employee> => {
    const response = await fetch(`${base_url}/api/groupe-10/mon-profil`, {
      headers: getAuthHeaders(),
    });
    const data: any = await handleResponse<any>(response);

    // Normaliser la réponse du profil
    const profile = Array.isArray(data) ? data[0] : (data?.data || data);
    const name = profile.name || profile.user?.name || profile.nom || '';
    const email = profile.email || profile.user?.email || '';

    return {
      id: profile.id ?? profile.user?.id ?? 0,
      user_id: profile.user_id ?? profile.user?.id ?? 0,
      name,
      email,
      role: profile.role ?? profile.user?.role ?? 'employe',
      service_id: profile.service_id ?? profile.user?.service_id ?? profile.service?.id ?? 0,
      service: profile.service ?? undefined,
      created_at: profile.created_at ?? profile.createdAt ?? '',
    } as Employee;
  },

  getAll: async (): Promise<Employee[]> => {
    const response = await fetch(`${base_url}/api/groupe-10/employes`, {
      headers: getAuthHeaders(),
    });

    // On récupère la réponse brute (handleResponse gère unwraps courants)
    const data: any = await handleResponse<any>(response);

    // Si ce n'est pas déjà un tableau, tenter d'extraire un tableau connu
    let arr: any[] = Array.isArray(data) ? data : [];
    if (!Array.isArray(data)) {
      if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) arr = data.data;
        else if (Array.isArray(data.employes)) arr = data.employes;
        else if (Array.isArray(data.employees)) arr = data.employees;
        else {
          // Fallback: essayer d'extraire les valeurs si l'objet contient des items
          const vals = Object.values(data).filter((v) => Array.isArray(v));
          if (vals.length > 0) arr = vals[0];
        }
      }
    }

    // Normaliser chaque entrée pour garantir `name` et `email` accessibles
    const normalized: Employee[] = arr.map((item: any) => {
      const name = item.name || item.user?.name || item.user?.nom || '';
      const email = item.email || item.user?.email || '';
      return {
        id: item.id ?? item.user?.id ?? 0,
        user_id: item.user_id ?? item.user?.id ?? 0,
        name,
        email,
        role: item.role ?? item.user?.role ?? 'employe',
        service_id: item.service_id ?? item.user?.service_id ?? item.service?.id ?? 0,
        service: item.service ?? undefined,
        created_at: item.created_at ?? item.createdAt ?? '',
      } as Employee;
    });

    return normalized;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await fetch(`${base_url}/api/groupe-10/employes/${id}`, {
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
    const item: any = await handleResponse<any>(response);

    // Normaliser la réponse pour garantir `name` et `email` accessibles
    const name = item.name || item.user?.name || item.user?.nom || '';
    const email = item.email || item.user?.email || '';
    return {
      id: item.id ?? item.user?.id ?? 0,
      user_id: item.user_id ?? item.user?.id ?? 0,
      name,
      email,
      role: item.role ?? item.user?.role ?? 'employe',
      service_id: item.service_id ?? item.user?.service_id ?? item.service?.id ?? 0,
      service: item.service ?? undefined,
      created_at: item.created_at ?? item.createdAt ?? '',
    } as Employee;
  },

  update: async (id: number, data: { user_id?: number; role?: string; service_id?: number }): Promise<Employee> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/employes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const item: any = await handleResponse<any>(response);

    // Normaliser la réponse pour garantir `name` et `email` accessibles
    const name = item.name || item.user?.name || item.user?.nom || '';
    const email = item.email || item.user?.email || '';
    return {
      id: item.id ?? item.user?.id ?? 0,
      user_id: item.user_id ?? item.user?.id ?? 0,
      name,
      email,
      role: item.role ?? item.user?.role ?? 'employe',
      service_id: item.service_id ?? item.user?.service_id ?? item.service?.id ?? 0,
      service: item.service ?? undefined,
      created_at: item.created_at ?? item.createdAt ?? '',
    } as Employee;
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/employes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};

export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await fetch(`${base_url}/api/groupe-10/services`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Service[]>(response);
  },

  getById: async (id: number): Promise<Service> => {
    const response = await fetch(`${base_url}/api/groupe-10/services/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Service>(response);
  },

  create: async (data: { nom: string; description?: string }): Promise<Service> => {
    console.log('📤 Creating service with data:', data);
    const url = `${base_url}/api/groupe-10/admin/services`;
    console.log('📤 POST URL:', url);
    const headers = getAuthHeaders();
    console.log('📤 Headers:', { ...headers, Authorization: headers.Authorization ? '***' : 'none' });
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    console.log('📥 Response status:', response.status);
    return handleResponse<Service>(response);
  },

  update: async (id: number, data: { nom?: string; description?: string }): Promise<Service> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Service>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};

export const leaveApi = {
  getAll: async (): Promise<LeaveRequest[]> => {
    const response = await fetch(`${base_url}/api/groupe-10/conges`, {
      headers: getAuthHeaders(),
    });

    // Récupérer la réponse brute et la dénormaliser si nécessaire
    const data: any = await handleResponse<any>(response);
    console.log('📋 Raw leave data from API:', data);

    // Si ce n'est pas un tableau, essayer d'extraire un tableau
    let arr: any[] = Array.isArray(data) ? data : [];
    if (!Array.isArray(data)) {
      if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) arr = data.data;
        else if (Array.isArray(data.conges)) arr = data.conges;
        else if (Array.isArray(data.leaves)) arr = data.leaves;
      }
    }

    console.log('📋 Extracted leaves array:', arr);

    // Charger les employés pour enrichir les congés
    // Essayer d'abord de charger tous les employés (admin only), sinon continuer sans enrichissement
    let employees: Employee[] = [];
    try {
      employees = await employeeApi.getAll();
      console.log('👥 Loaded all employees:', employees);
    } catch (e: any) {
      // C'est normal pour les non-admins - l'endpoint retournera 403
      console.log('ℹ️ Could not load all employees (non-admin access or error):', e instanceof ApiError ? `Error ${e.status}: ${e.message}` : e);
    }

    // Enrichir chaque congé avec les informations de l'employé
    const normalized: LeaveRequest[] = arr.map((item: any) => {
      // Si les données de l'employé ne sont pas dans le congé, chercher dans la liste chargée
      let employe = item.employe || item.employee || item.user;
      console.log(`🔍 Leave ${item.id}: employe_id=${item.employe_id}, found employe:`, employe);

      if (!employe && item.employe_id && employees.length > 0) {
        employe = employees.find(e => e.id === item.employe_id);
        console.log(`   After search with employe_id=${item.employe_id}:`, employe);
      }

      return {
        id: item.id ?? 0,
        employe_id: item.employe_id ?? item.employee_id ?? item.user_id ?? 0,
        date_debut: item.date_debut ?? item.dateDebut ?? '',
        date_fin: item.date_fin ?? item.dateFin ?? '',
        raison: item.raison ?? item.reason ?? '',
        status: item.status ?? 'pending',
        employe: employe ? {
          id: employe.id ?? 0,
          name: employe.name || employe.nom || '',
          email: employe.email || '',
          role: employe.role || 'employe',
          service_id: employe.service_id ?? 0,
        } : undefined,
        created_at: item.created_at ?? item.createdAt ?? '',
      } as LeaveRequest;
    });

    console.log('✅ Final normalized leaves:', normalized);
    return normalized;
  },

  getById: async (id: number): Promise<LeaveRequest> => {
    const response = await fetch(`${base_url}/api/groupe-10/conges/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<LeaveRequest>(response);
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
    const item: any = await handleResponse<any>(response);

    // Enrichir avec les informations de l'employé
    const employe = item.employe || item.employee || item.user;
    return {
      id: item.id ?? 0,
      employe_id: item.employe_id ?? item.employee_id ?? item.user_id ?? 0,
      date_debut: item.date_debut ?? item.dateDebut ?? '',
      date_fin: item.date_fin ?? item.dateFin ?? '',
      raison: item.raison ?? item.reason ?? '',
      status: item.status ?? 'pending',
      employe: employe ? {
        id: employe.id ?? 0,
        name: employe.name || employe.nom || '',
        email: employe.email || '',
        role: employe.role || 'employe',
        service_id: employe.service_id ?? 0,
      } : undefined,
      created_at: item.created_at ?? item.createdAt ?? '',
    } as LeaveRequest;
  },

  updateStatus: async (id: number, status: 'approved' | 'rejected'): Promise<LeaveRequest> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/conges/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const item: any = await handleResponse<any>(response);

    // Enrichir avec les informations de l'employé
    const employe = item.employe || item.employee || item.user;
    return {
      id: item.id ?? 0,
      employe_id: item.employe_id ?? item.employee_id ?? item.user_id ?? 0,
      date_debut: item.date_debut ?? item.dateDebut ?? '',
      date_fin: item.date_fin ?? item.dateFin ?? '',
      raison: item.raison ?? item.reason ?? '',
      status: item.status ?? 'pending',
      employe: employe ? {
        id: employe.id ?? 0,
        name: employe.name || employe.nom || '',
        email: employe.email || '',
        role: employe.role || 'employe',
        service_id: employe.service_id ?? 0,
      } : undefined,
      created_at: item.created_at ?? item.createdAt ?? '',
    } as LeaveRequest;
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${base_url}/api/groupe-10/admin/conges/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};

// Additional APIs: Présences, Évaluations, Formations
export const attendanceApi = {
  getAll: async (): Promise<import('../types').Attendance[]> => {
    try {
      const response = await fetch(`${base_url}/api/groupe-10/presences`, {
        headers: getAuthHeaders(),
      });
      return handleResponse<import('../types').Attendance[]>(response);
    } catch (err: any) {
      // fallback to local storage if backend endpoint is missing
      const raw = localStorage.getItem('mock_attendance');
      return raw ? JSON.parse(raw) : [];
    }
  },

  record: async (data: { date: string; heure_arrivee: string; heure_depart?: string; status: 'present' | 'absent' | 'retard' }) => {
    try {
      const response = await fetch(`${base_url}/api/groupe-10/presences`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<import('../types').Attendance>(response);
    } catch (err) {
      const raw = localStorage.getItem('mock_attendance');
      const arr = raw ? JSON.parse(raw) : [];
      const newRec = { id: Date.now(), ...data };
      arr.unshift(newRec);
      localStorage.setItem('mock_attendance', JSON.stringify(arr));
      return newRec;
    }
  },
};

export const performanceApi = {
  getAll: async (): Promise<import('../types').Performance[]> => {
    try {
      const response = await fetch(`${base_url}/api/groupe-10/evaluations`, {
        headers: getAuthHeaders(),
      });
      return handleResponse<import('../types').Performance[]>(response);
    } catch (err) {
      const raw = localStorage.getItem('mock_performances');
      return raw ? JSON.parse(raw) : [];
    }
  },

  create: async (data: { employe_id: number; note: number; commentaire: string; evaluateur_id: number; date_evaluation?: string }) => {
    try {
      const response = await fetch(`${base_url}/api/groupe-10/admin/evaluations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<import('../types').Performance>(response);
    } catch (err) {
      const raw = localStorage.getItem('mock_performances');
      const arr = raw ? JSON.parse(raw) : [];
      const newRec = { id: Date.now(), date_evaluation: data.date_evaluation || new Date().toISOString(), note: data.note, commentaire: data.commentaire, employe_id: data.employe_id, evaluateur_id: data.evaluateur_id };
      arr.unshift(newRec);
      localStorage.setItem('mock_performances', JSON.stringify(arr));
      return newRec;
    }
  },
};

export const trainingApi = {
  getAll: async (): Promise<import('../types').Training[]> => {
    try {
      const response = await fetch(`${base_url}/api/groupe-10/formations`, {
        headers: getAuthHeaders(),
      });
      return handleResponse<import('../types').Training[]>(response);
    } catch (err) {
      const raw = localStorage.getItem('mock_trainings');
      return raw ? JSON.parse(raw) : [];
    }
  },

  enroll: async (id: number, userId: number) => {
    try {
      const response = await fetch(`${base_url}/api/groupe-10/formations/${id}/inscriptions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_id: userId }),
      });
      return handleResponse(response);
    } catch (err) {
      // local fallback: add userId to participants
      const raw = localStorage.getItem('mock_trainings');
      const arr = raw ? JSON.parse(raw) : [];
      const tIndex = arr.findIndex((t: any) => t.id === id);
      if (tIndex >= 0) {
        arr[tIndex].participants = arr[tIndex].participants || [];
        if (!arr[tIndex].participants.includes(userId)) arr[tIndex].participants.push(userId);
        localStorage.setItem('mock_trainings', JSON.stringify(arr));
      }
      return { success: true };
    }
  },
};

export const statsApi = {
  // Compute some statistics client-side using available endpoints
  getOverview: async () => {
    const [employees, leaves, performances] = await Promise.all([
      employeeApi.getAll().catch(() => []),
      leaveApi.getAll().catch(() => []),
      performanceApi.getAll().catch(() => []),
    ]);

    const totalEmployees = employees.length;
    const approvedLeaves = leaves.filter((l: any) => l.status === 'approved').length;
    const avgNote = performances.length > 0 ? (performances.reduce((a: any, p: any) => a + p.note, 0) / performances.length) : 0;

    return {
      totalEmployees,
      approvedLeaves,
      avgNote: Number(avgNote.toFixed(2)),
    };
  },
};