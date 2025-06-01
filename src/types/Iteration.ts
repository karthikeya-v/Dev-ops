export interface Iteration {
  id: string; // UUID
  project_id: string; // UUID, Foreign Key to projects(id)
  name: string;
  start_date?: string; // DATE
  end_date?: string; // DATE
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

export interface IterationCreate {
  project_id: string;
  name: string;
  start_date?: string;
  end_date?: string;
}

export interface IterationUpdate {
  name?: string;
  start_date?: string;
  end_date?: string;
} 