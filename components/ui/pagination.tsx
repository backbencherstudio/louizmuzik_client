'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    className = '',
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${className}`}>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-black text-white hover:bg-zinc-900 hover:text-white border-zinc-800"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {getVisiblePages().map((page, index) => (
                    <div key={index}>
                        {page === '...' ? (
                            <span className="px-2 text-zinc-500">...</span>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className={`h-8 w-8 p-0 ${
                                    currentPage === page
                                        ? 'bg-emerald-500 text-black hover:bg-emerald-600 border-emerald-500'
                                        : 'bg-black text-white hover:bg-zinc-900 hover:text-white border-zinc-800'
                                }`}
                                onClick={() => onPageChange(page as number)}
                            >
                                {page}
                            </Button>
                        )}
                    </div>
                ))}
                
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-black text-white hover:bg-zinc-900 hover:text-white border-zinc-800"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
} 