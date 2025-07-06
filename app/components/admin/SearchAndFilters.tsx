'use client';

import { Search, Filter } from 'lucide-react';

export function SearchAndFilters() {
    return (
        <div className="bg-zinc-900 p-4 rounded-lg mb-6 flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="bg-transparent border-none text-white focus:outline-none w-full"
                />
            </div>
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
                Filter
            </button>
        </div>
    );
}
