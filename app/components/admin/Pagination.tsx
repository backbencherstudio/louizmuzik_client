'use client';

interface PaginationProps {
    total: number;
    onPrevious: () => void;
    onNext: () => void;
}

export function Pagination({ total, onPrevious, onNext }: PaginationProps) {
    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-zinc-400">
                Showing <span className="font-medium">{total}</span> users
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onPrevious}
                    className="px-3 py-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={onNext}
                    className="px-3 py-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
