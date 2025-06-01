export type WorkItemStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done';

export interface WorkItem {
  id: string
  title: string
  description?: string
  status: WorkItemStatus;
  created_at: string
  updated_at: string
  user_id?: string
  assignee_id?: string
  project_id?: string
  iteration_id?: string
  work_item_type_id?: string
  parent_work_item_id?: string
  due_date?: string
}

export interface WorkItemCreate {
  title: string
  description?: string
  status: WorkItemStatus;
  user_id: string
  assignee_id?: string
  project_id?: string
  iteration_id?: string
  work_item_type_id?: string
  parent_work_item_id?: string
  due_date?: string
}

export interface WorkItemUpdate {
  title?: string
  description?: string
  status?: WorkItemStatus
  assignee_id?: string
  project_id?: string
  iteration_id?: string
  work_item_type_id?: string
  parent_work_item_id?: string
  due_date?: string
}
