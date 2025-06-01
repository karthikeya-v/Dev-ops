/*
# Work Items Table Schema

1. New Tables
  - `work_items`
    - id (uuid, primary key)
    - title (text)
    - description (text)
    - status (text)
    - created_at (timestamp)
    - updated_at (timestamp)
    - assignee_id (uuid references auth.users)
    - due_date (timestamp)

2. Security
  - Enable RLS on work_items
  - Policies:
    - Authenticated users can manage their own items
    - Users can only view public items
*/

CREATE TABLE IF NOT EXISTS work_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'Backlog',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  assignee_id uuid REFERENCES auth.users(id),
  due_date timestamptz
);

ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their work items" ON work_items
FOR ALL
TO authenticated
USING (auth.uid() = assignee_id)
WITH CHECK (auth.uid() = assignee_id);

CREATE POLICY "Public read access" ON work_items
FOR SELECT
TO authenticated
USING (true);