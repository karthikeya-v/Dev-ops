import { supabase } from '../lib/supabaseClient';
import { Iteration, IterationCreate, IterationUpdate } from '../types/Iteration';

const ITERATIONS_TABLE = 'iterations';

// Create a new iteration for a specific project
export async function createIteration(iterationData: IterationCreate): Promise<Iteration> {
  const { data, error } = await supabase
    .from(ITERATIONS_TABLE)
    .insert(iterationData)
    .select()
    .single();

  if (error) {
    console.error('Error creating iteration:', error);
    throw error;
  }
  return data;
}

// Get all iterations for a specific project
export async function getIterationsByProjectId(projectId: string): Promise<Iteration[]> {
  const { data, error } = await supabase
    .from(ITERATIONS_TABLE)
    .select('*')
    .eq('project_id', projectId)
    .order('start_date', { ascending: true, nullsFirst: false }); // Order by start_date, then name

  if (error) {
    console.error('Error fetching iterations for project:', error);
    throw error;
  }
  return data || [];
}

// Get a single iteration by its ID
export async function getIterationById(iterationId: string): Promise<Iteration | null> {
  const { data, error } = await supabase
    .from(ITERATIONS_TABLE)
    .select('*')
    .eq('id', iterationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    console.error('Error fetching iteration by ID:', error);
    throw error;
  }
  return data;
}

// Update an existing iteration
export async function updateIteration(iterationId: string, updates: IterationUpdate): Promise<Iteration> {
  const { data, error } = await supabase
    .from(ITERATIONS_TABLE)
    .update(updates)
    .eq('id', iterationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating iteration:', error);
    throw error;
  }
  return data;
}

// Delete an iteration by its ID
export async function deleteIteration(iterationId: string): Promise<void> {
  const { error } = await supabase
    .from(ITERATIONS_TABLE)
    .delete()
    .eq('id', iterationId);

  if (error) {
    console.error('Error deleting iteration:', error);
    throw error;
  }
} 