'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Music2, Search, Play, Download, Trash2 } from 'lucide-react';
import { ClientPagination } from '@/components/admin/ClientPagination';

type Melody = {
    id: string;
    title: string;
    producer: {
        username: string;
        email: string;
    };
    bpm: number;
    key: string;
    genre: string;
    instrument: string;
    stats: {
        downloads: number;
        plays: number;
    };
    created_at: string;
    downloadUrl: string;
};

export default function MelodiesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [melodies, setMelodies] = useState<Melody[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const page = Number(searchParams.get('page')) || 1;
    const limit = 10;

    useEffect(() => {
        fetchMelodies();
    }, [page, searchTerm]);

    const fetchMelodies = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                ...(searchTerm && { search: searchTerm }),
            });

            const response = await fetch(`/api/admin/melodies?${params}`);
            const data = await response.json();

            if (response.ok) {
                setMelodies(data.melodies);
                setTotal(data.pagination.total);
            } else {
                console.error('Error fetching melodies:', data.error);
            }
        } catch (error) {
            console.error('Error fetching melodies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMelody = async (melodyId: string) => {
        if (
            !confirm(
                'Are you sure you want to delete this melody? This action cannot be undone.'
            )
        ) {
            return;
        }

        try {
            setLoading({ ...loading, [`delete-${melodyId}`]: true });
            // In a real application, this would make an API call to delete the melody
            // await fetch(`/api/admin/melodies/${melodyId}`, {
            //     method: 'DELETE',
            // });

            setMelodies(melodies.filter((melody) => melody.id !== melodyId));
        } catch (error) {
            console.error('Error deleting melody:', error);
            alert('Failed to delete melody. Please try again.');
        } finally {
            setLoading({ ...loading, [`delete-${melodyId}`]: false });
        }
    };

    const handleDownloadMelody = async (melody: Melody) => {
        try {
            setLoading({ ...loading, [`download-${melody.id}`]: true });
            // In a real application, this would trigger the file download
            // const response = await fetch(melody.downloadUrl);
            // const blob = await response.blob();
            // const url = window.URL.createObjectURL(blob);
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = `${melody.title}.wav`;
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
            // window.URL.revokeObjectURL(url);

            alert(`Downloading melody: ${melody.title}`);
        } catch (error) {
            console.error('Error downloading melody:', error);
            alert('Failed to download melody. Please try again.');
        } finally {
            setLoading({ ...loading, [`download-${melody.id}`]: false });
        }
    };

    const filteredMelodies = melodies.filter(
        (melody) =>
            melody.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            melody.producer.username
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            melody.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">
                    Melody Management
                </h2>
            </div>

            {/* Search */}
            <div className="bg-zinc-900 p-4 rounded-lg mb-6">
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                            <Search className="w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search melodies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none text-white focus:outline-none w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Melodies Table */}
            <div className="bg-zinc-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Melody
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Producer
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Details
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Stats
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center p-4 text-zinc-400"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredMelodies.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center p-4 text-zinc-400"
                                    >
                                        No melodies found
                                    </td>
                                </tr>
                            ) : (
                                filteredMelodies.map((melody) => (
                                    <tr
                                        key={melody.id}
                                        className="border-b border-zinc-800 hover:bg-zinc-800/50"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                                    <Music2 className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {melody.title}
                                                    </div>
                                                    <div className="text-sm text-zinc-400">
                                                        Uploaded:{' '}
                                                        {new Date(
                                                            melody.created_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="text-white">
                                                    {melody.producer.username}
                                                </div>
                                                <div className="text-sm text-zinc-400">
                                                    {melody.producer.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="text-white">
                                                    {melody.bpm} BPM ·{' '}
                                                    {melody.key}
                                                </div>
                                                <div className="text-sm text-zinc-400">
                                                    {melody.genre} ·{' '}
                                                    {melody.instrument}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Play className="w-4 h-4" />
                                                    <span>
                                                        {melody.stats.plays}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Download className="w-4 h-4" />
                                                    <span>
                                                        {melody.stats.downloads}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleDownloadMelody(
                                                            melody
                                                        )
                                                    }
                                                    disabled={
                                                        loading[
                                                            `download-${melody.id}`
                                                        ]
                                                    }
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-zinc-700 transition-colors"
                                                    title="Download Melody"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteMelody(
                                                            melody.id
                                                        )
                                                    }
                                                    disabled={
                                                        loading[
                                                            `delete-${melody.id}`
                                                        ]
                                                    }
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-700 transition-colors"
                                                    title="Delete Melody"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <ClientPagination total={total} />
        </div>
    );
}
