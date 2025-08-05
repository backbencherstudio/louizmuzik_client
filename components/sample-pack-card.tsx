import React from 'react';
import Image from 'next/image';
import { Heart, Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SamplePackCardProps {
    title: string;
    producer: string;
    price: number;
    imageUrl: string;
    isFavorite: boolean;
    id: string;
    handleFavoriteClick: () => void;
    onPlayClick?: () => void;
    isPlaying?: boolean;
}

export function SamplePackCard({
    title,
    producer,
    price,
    imageUrl,
    isFavorite,
    id,
    handleFavoriteClick,
    onPlayClick,
    isPlaying = false,
}: SamplePackCardProps) {
    const router = useRouter();
    return (
        <Card className="overflow-hidden border-0 bg-[#0F0F0F]">
            <div className="relative aspect-square">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 text-white hover:bg-black/50"
                    onClick={handleFavoriteClick}
                >
                    <Heart
                        className={`h-5 w-5 ${
                            isFavorite
                                ? 'fill-emerald-500 text-emerald-500'
                                : 'text-white'
                        }`}
                    />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                        isPlaying
                            ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                            : 'text-white hover:bg-black/50'
                    }`}
                    onClick={onPlayClick}
                >
                    {isPlaying ? (
                        <Pause className="h-8 w-8" />
                    ) : (
                        <Play className="h-8 w-8" />
                    )}
                </Button>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-white truncate">{title}</h3>
                <p className="text-sm text-zinc-400">{producer}</p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-emerald-500 font-semibold">
                        ${price.toFixed(2)}
                    </span>
                    <Button
                        size="sm"
                        className="hidden sm:block bg-emerald-500 text-black hover:bg-emerald-600"
                        onClick={() => router.push(`/product/${id}`)}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </Card>
    );
}
