export interface WorkItemType {
  id: string; // UUID
  name: string; // e.g., 'Epic', 'Feature', 'User Story', 'Task', 'Bug'
  icon?: string; // Optional: for UI display
  // project_id?: string; // UUID, Foreign Key to projects(id) - if types become project-specific
  created_at: string; // TIMESTAMPTZ
}

// Currently, WorkItemTypes are pre-populated and global, so no Create/Update interfaces needed from client.
// If they become manageable by users (e.g., admins or project-specific):
// export interface WorkItemTypeCreate {
//   name: string;
//   icon?: string;
//   project_id?: string;
// }

// export interface WorkItemTypeUpdate {
//   name?: string;
//   icon?: string;
// } 