'use client';

import { Plus } from 'lucide-react';

export function AddUserButton() {
    return (
        <button
            onClick={() => {
                // TODO: Implement add user functionality
                console.log('Add user clicked');
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
            <Plus className="w-4 h-4" />
            Add User
        </button>
    );
}
