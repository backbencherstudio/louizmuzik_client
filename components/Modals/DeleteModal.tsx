'use client'
import React from 'react';
import { Button } from '../ui/button';
import { Loader, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  itemToDelete: { title: string } | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  itemToDelete,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !itemToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-white">
            Delete {itemToDelete?.title}
          </h3>
          <button
            onClick={onCancel}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-zinc-400 mb-6">
          Are you sure you want to delete &quot;{itemToDelete?.title}&quot;? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
