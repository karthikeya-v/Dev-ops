export interface Project {
  id: string; // UUID
  name: string;
  description?: string;
  owner_id: string; // UUID, Foreign Key to auth.users(id)
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

export interface ProjectCreate {
  name: string;
  description?: string;
  owner_id: string; // Should be set to auth.uid() on creation
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  // owner_id is typically not changed after creation
} 