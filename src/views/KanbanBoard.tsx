import React, { useState, useEffect } from 'react';
import { getWorkItem, createWorkItem, updateWorkItem, deleteWorkItem } from '../api/workItemApi';
import { WorkItem, WorkItemCreate, WorkItemStatus } from '../types/WorkItem';
import KanbanColumn from '../components/KanbanColumn';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { useAuth } from '../providers/AuthProvider';
import { cn } from '../lib/utils';

const KanbanBoard: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemStatus, setNewItemStatus] = useState<WorkItemStatus>('Backlog'); // Default to Backlog

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getWorkItem();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) {
      alert('Title is required.');
      return;
    }
    if (!user || !user.user) { 
      alert('User not authenticated. Cannot create item.');
      return;
    }
    const newItem: WorkItemCreate = {
      title: newItemTitle,
      description: newItemDescription,
      status: newItemStatus,
      user_id: user.user.id,
    };
    try {
      const createdItem = await createWorkItem(newItem);
      setItems([...items, createdItem]);
      setNewItemTitle('');
      setNewItemDescription('');
      setNewItemStatus('Backlog');
      setShowAddForm(false); // Hide form after creation
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create work item. See console for details.');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<WorkItem>) => {
    try {
      const updatedItem = await updateWorkItem(id, updates);
      setItems(items.map(item => item.id === id ? updatedItem : item));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWorkItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-white/70 text-lg font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Project Dashboard</h2>
          <p className="text-gray-600">Manage your workflow with style and efficiency</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="default">
          {showAddForm ? 'Cancel' : 'Add New Work Item'}
        </Button>
      </div>

      {showAddForm && (
        <div className="p-6 bg-white rounded-lg shadow-md mb-6">
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Create New Work Item</h3>
            <div>
              <Label htmlFor="newItemTitle">Title</Label>
              <Input 
                id="newItemTitle"
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Enter work item title"
                required
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor="newItemDescription">Description (Optional)</Label>
              <textarea 
                id="newItemDescription"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter work item description"
                rows={3}
                className={cn(
                  'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
                  'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'transition-shadow duration-150 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg mt-1'
                )}
              />
            </div>
            <div>
              <Label htmlFor="newItemStatus">Status</Label>
              <select 
                id="newItemStatus" 
                value={newItemStatus} 
                onChange={(e) => setNewItemStatus(e.target.value as WorkItemStatus)}
                className="mt-1 w-full p-2 border rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white"
              >
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Create Item
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KanbanColumn 
          title="Backlog"
          items={items.filter(item => item.status === 'Backlog')}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <KanbanColumn 
          title="In Progress"
          items={items.filter(item => item.status === 'In Progress')}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <KanbanColumn 
          title="Review"
          items={items.filter(item => item.status === 'Review')}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <KanbanColumn 
          title="Done"
          items={items.filter(item => item.status === 'Done')}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
