import { supabase } from '../lib/supabaseClient'
import { WorkItem, WorkItemCreate } from '../types/WorkItem'

export const getWorkItem = async (): Promise<WorkItem[]> => {
  const { data, error } = await supabase
    .from('work_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as WorkItem[]
}

export const getWorkItems = async (): Promise<WorkItem[]> => {
  const { data, error } = await supabase
    .from('work_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as WorkItem[]
}

export const createWorkItem = async (item: WorkItemCreate): Promise<WorkItem> => {
  const { data, error } = await supabase
    .from('work_items')
    .insert(item)
    .select()
    .single()

  if (error) throw error
  return data as WorkItem
}

export const updateWorkItem = async (
  id: string,
  updates: Partial<WorkItem>
): Promise<WorkItem> => {
  const { data, error } = await supabase
    .from('work_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as WorkItem
}

export const deleteWorkItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('work_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}
