import { supabase } from '../lib/supabaseClient';
import { Project, ProjectCreate, ProjectUpdate } from '../types/Project';

const PROJECTS_TABLE = 'projects';

// Create a new project
export async function createProject(projectData: ProjectCreate): Promise<Project> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .insert(projectData)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  return data;
}

// Get all projects (potentially for a specific user if owner_id is used for RLS)
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  return data || [];
}

// Get a single project by its ID
export async function getProjectById(projectId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    // If error is because no rows found, it's not a "throwable" error for a "get by ID"
    if (error.code === 'PGRST116') { 
      return null;
    }
    console.error('Error fetching project by ID:', error);
    throw error;
  }
  return data;
}

// Update an existing project
export async function updateProject(projectId: string, updates: ProjectUpdate): Promise<Project> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }
  return data;
}

// Delete a project by its ID
export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from(PROJECTS_TABLE)
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
} 