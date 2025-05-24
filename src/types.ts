export type Role = 'admin' | 'company_admin' | 'user';

export interface Company {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  email: string;
  phone: string;
  address: string;
}

export interface Room {
  id: string;
  company_id: string;
  name: string;
  created_at: string;
}

export interface RoomEvent {
  id: string;
  room_id: string;
  title: string;
  start_time: string;
  end_time: string;
  recurrence_rule?: string;
  recurrence_exceptions?: string[];
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  company_id?: string;
}
