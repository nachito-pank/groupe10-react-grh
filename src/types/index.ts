export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employe';
  service_id?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiAuthResponse {
  success: boolean;
  data: AuthResponse;
}
``

export interface Employee {
  id: number;
  user_id: number;
  name: string;
  email: string;
  role: string;
  service_id: number;
  service?: Service;
  created_at: string;
}

export interface Service {
  id: number;
  nom: string;
  description?: string;
}

export interface LeaveRequest {
  id: number;
  employe_id: number;
  date_debut: string;
  date_fin: string;
  raison: string;
  status: 'pending' | 'approved' | 'rejected';
  employe?: Employee;
  created_at: string;
}

export interface Attendance {
  id: number;
  employe_id: number;
  date: string;
  heure_arrivee: string;
  heure_depart?: string;
  status: 'present' | 'absent' | 'retard';
}

export interface Performance {
  id: number;
  employe_id: number;
  date_evaluation: string;
  note: number;
  commentaire: string;
  evaluateur_id: number;
}

export interface Training {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  participants: number[];
}
