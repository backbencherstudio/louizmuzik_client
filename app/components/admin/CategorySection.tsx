'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    name: string;
    type: 'genre' | 'artist_type' | 'instrument';
    created_at: string;
}

interface CategorySectionProps {
    title: string;
    type: 'genre' | 'artist_type' | 'instrument';
    items: Category[];
}

export function CategorySection({ title, type, items }: CategorySectionProps) {
    const [newItem, setNewItem] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        setIsAdding(true);
        setError('');

        try {
            const supabaseClient = await supabase;
            const { error } = await supabaseClient.from('categories').insert({
                name: newItem.trim(),
                type,
            });

            if (error) throw error;

            setNewItem('');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const supabaseClient = await supabase;
            const { error } = await supabaseClient
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            router.refresh();
        } catch (err: any) {
            console.error('Error deleting category:', err);
        }
    };

    return (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>

            <form onSubmit={handleAdd} className="mb-6">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder={`Add new ${title.toLowerCase()}`}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                        type="submit"
                        disabled={isAdding || !newItem.trim()}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            isAdding || !newItem.trim()
                                ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </form>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-2"
                    >
                        <span className="text-white">{item.name}</span>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
