'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Package,
    Search,
    MoreVertical,
    DollarSign,
    ShoppingCart,
    Pencil,
    Trash2,
    X,
    Download,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ClientPagination } from '@/components/admin/ClientPagination';

type SamplePack = {
    id: string;
    title: string;
    producer: {
        username: string;
        email: string;
    };
    price: number;
    description: string;
    coverArt: string;
    demoAudio: string;
    stats: {
        sales: number;
        revenue: number;
    };
    created_at: string;
};

export default function SamplePacksPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [packs, setPacks] = useState<SamplePack[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPack, setEditingPack] = useState<SamplePack | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [packToDelete, setPackToDelete] = useState<SamplePack | null>(null);

    const page = Number(searchParams.get('page')) || 1;
    const limit = 10;

    useEffect(() => {
        fetchPacks();
    }, [page, searchTerm]);

    const fetchPacks = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                ...(searchTerm && { search: searchTerm }),
            });

            const response = await fetch(`/api/admin/sample-packs?${params}`);
            const data = await response.json();

            if (response.ok) {
                setPacks(data.packs);
                setTotal(data.pagination.total);
            } else {
                console.error('Error fetching sample packs:', data.error);
            }
        } catch (error) {
            console.error('Error fetching sample packs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (pack: SamplePack) => {
        setPackToDelete(pack);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!packToDelete) return;

        try {
            const response = await fetch('/api/admin/sample-packs', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packId: packToDelete.id,
                    action: 'delete',
                }),
            });

            if (response.ok) {
                fetchPacks(); // Refresh the pack list
                setDeleteModalOpen(false);
                setPackToDelete(null);
            } else {
                const data = await response.json();
                console.error('Error deleting sample pack:', data.error);
            }
        } catch (error) {
            console.error('Error deleting sample pack:', error);
        }
    };

    const handleEditDetails = async (pack: SamplePack) => {
        setEditingPack(pack);
        // Here you would typically open a modal with a form to edit details
        console.log('Editing pack:', pack);
    };

    const handleDownload = async (pack: SamplePack) => {
        try {
            // In a real application, this would make an API call to get the download URL
            const response = await fetch(
                `/api/admin/sample-packs/${pack.id}/download`
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${pack.title}.zip`; // Set the filename
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error('Error downloading sample pack');
            }
        } catch (error) {
            console.error('Error downloading sample pack:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">
                    Sample Pack Management
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
                                placeholder="Search sample packs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none text-white focus:outline-none w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sample Packs Table */}
            <div className="bg-zinc-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Sample Pack
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Producer
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Price
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Sales
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
                            ) : packs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center p-4 text-zinc-400"
                                    >
                                        No sample packs found
                                    </td>
                                </tr>
                            ) : (
                                packs.map((pack) => (
                                    <tr
                                        key={pack.id}
                                        className="border-b border-zinc-800"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                                                    {pack.coverArt ? (
                                                        <img
                                                            src={pack.coverArt}
                                                            alt={pack.title}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-emerald-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {pack.title}
                                                    </div>
                                                    <div className="text-sm text-zinc-400">
                                                        Uploaded:{' '}
                                                        {new Date(
                                                            pack.created_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="text-white">
                                                    {pack.producer.username}
                                                </div>
                                                <div className="text-sm text-zinc-400">
                                                    {pack.producer.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white">
                                                {formatCurrency(pack.price)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    <span>
                                                        {pack.stats.sales}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>
                                                        {formatCurrency(
                                                            pack.stats.revenue
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-[160px] bg-zinc-900 border-zinc-800"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDownload(pack)
                                                        }
                                                        className="text-emerald-500 hover:text-emerald-500 hover:bg-zinc-800"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEditDetails(
                                                                pack
                                                            )
                                                        }
                                                        className="text-white hover:text-white hover:bg-zinc-800"
                                                    >
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                pack
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-500 hover:bg-zinc-800"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && packToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-white">
                                Delete Sample Pack
                            </h3>
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setPackToDelete(null);
                                }}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-zinc-400 mb-6">
                            Are you sure you want to delete &quot;
                            {packToDelete.title}&quot;? This action cannot be
                            undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setPackToDelete(null);
                                }}
                                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
