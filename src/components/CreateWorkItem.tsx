import React from 'react';
import { useForm } from 'react-hook-form';
import { WorkItem } from '../types/WorkItem';

interface Props {
  onSubmit: (data: Omit<WorkItem, 'id'>) => void;
}

const CreateWorkItem: React.FC<Props> = ({ onSubmit }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<Omit<WorkItem, 'id'>>();

  const handleFormSubmit = (data: Omit<WorkItem, 'id'>) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className={`w-full p-2 border rounded ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <span className="text-red-500 text-sm">{errors.title.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className={`w-full p-2 border rounded ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={3}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">{errors.description.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          {...register('status', { required: 'Status is required' })}
          className="w-full p-2 border rounded border-gray-300"
        >
          <option value="Backlog">Backlog</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Create Work Item
      </button>
    </form>
  );
};

export default CreateWorkItem;
