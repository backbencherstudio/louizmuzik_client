'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ClientPaginationProps {
    total: number;
    limit?: number;
}

export function ClientPagination({ total, limit = 10 }: ClientPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1; // Fixed: default to 1
    const totalPages = Math.ceil(total / limit); // Fixed: calculate based on total and limit

    const handlePrevious = () => {
        if (page > 1) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', String(page - 1));
            router.push(`?${params.toString()}`);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', String(page + 1));
            router.push(`?${params.toString()}`);
        }
    };

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-zinc-400">
                Showing{' '}
                <span className="font-medium">
                    {Math.min(page * limit, total)}
                </span>{' '}
                of <span className="font-medium">{total}</span> melodies
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrevious}
                    disabled={page <= 1}
                    className={`px-3 py-1 rounded-lg bg-zinc-900 text-zinc-400 transition-colors ${
                        page > 1
                            ? 'hover:text-white'
                            : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    Previous
                </button>
                <div className="text-zinc-400">
                    Page {page} of {totalPages}
                </div>
                <button
                    onClick={handleNext}
                    disabled={page >= totalPages}
                    className={`px-3 py-1 rounded-lg bg-zinc-900 text-zinc-400 transition-colors ${
                        page < totalPages
                            ? 'hover:text-white'
                            : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
