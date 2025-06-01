import React from 'react';
import { WorkItem } from '../types/WorkItem';
import { Button } from './ui/Button';

type KanbanColumnProps = {
  title: string;
  items: WorkItem[];
  onUpdate: (id: string, updates: Partial<WorkItem>) => void;
  onDelete: (id: string) => void;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, items, onUpdate, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="border rounded-md p-3 hover:shadow-md transition-shadow">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                className="text-xs py-1 px-2"
                onClick={() => onUpdate(item.id, { status: 'In Progress' })}
              >
                Start
              </Button>
              <Button
                variant="outline"
                className="text-xs py-1 px-2"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
