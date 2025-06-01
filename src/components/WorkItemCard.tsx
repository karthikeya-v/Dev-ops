import React from 'react';
import { WorkItem } from '../types/WorkItem';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface WorkItemCardProps {
  item: WorkItem;
  onUpdate: (id: string, updates: Partial<WorkItem>) => void;
  onDelete: (id: string) => void;
}

const WorkItemCard: React.FC<WorkItemCardProps> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(item.title);
  const [editedDesc, setEditedDesc] = React.useState(item.description);

  const handleSave = () => {
    onUpdate(item.id, { title: editedTitle, description: editedDesc });
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {isEditing ? (
        <div className="space-y-2">
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-1 border rounded"
          />
          <textarea
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="w-full p-1 border rounded"
          />
          <button 
            onClick={handleSave}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="font-medium">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkItemCard;
