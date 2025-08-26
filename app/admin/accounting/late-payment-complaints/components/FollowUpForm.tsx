'use client';

import { useState } from 'react';

interface FollowUpFormProps {
  complaintId: string;
  onSubmit: (actionData: any) => void;
  onCancel: () => void;
}

export default function FollowUpForm({
  complaintId,
  onSubmit,
  onCancel,
}: FollowUpFormProps) {
  const [formData, setFormData] = useState({
    actionType: 'email' as
      | 'email'
      | 'call'
      | 'letter'
      | 'legal'
      | 'payment_plan'
      | 'other',
    description: '',
    dueDate: '',
    assignedTo: '',
    status: 'pending' as 'pending' | 'completed' | 'cancelled',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (onSubmit) {
        onSubmit({
          ...formData,
          complaintId,
        });
      }
    } catch (error) {
      console.error('Failed to add follow-up action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mb-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20'>
      <h4 className='mb-3 font-medium text-gray-900 dark:text-gray-100'>
        New Follow-up Action
      </h4>
      <form onSubmit={handleSubmit} className='space-y-3'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Action Type
          </label>
          <select
            className='w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            value={formData.actionType}
            onChange={(e) =>
              setFormData({ ...formData, actionType: e.target.value as any })
            }
          >
            <option value='email'>Email</option>
            <option value='call'>Phone Call</option>
            <option value='letter'>Formal Letter</option>
            <option value='legal'>Legal Action</option>
            <option value='payment_plan'>Payment Plan</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Description
          </label>
          <input
            type='text'
            className='w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder='Describe the action to be taken'
            required
          />
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Due Date
          </label>
          <input
            type='date'
            className='w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Assigned To
          </label>
          <input
            type='text'
            className='w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            value={formData.assignedTo}
            onChange={(e) =>
              setFormData({ ...formData, assignedTo: e.target.value })
            }
            placeholder='Enter user name or ID'
            required
          />
        </div>
        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={onCancel}
            className='rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='rounded-md bg-blue-600 px-3 py-1 text-white dark:bg-blue-500'
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Action'}
          </button>
        </div>
      </form>
    </div>
  );
}
