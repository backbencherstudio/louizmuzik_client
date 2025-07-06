import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Heart, Play, Download } from 'lucide-react';

interface Melody {
    id: number;
    title: string;
    producer: string;
    bpm: number;
    key: string;
    genre: string;
    instrument: string;
    isFavorite: boolean;
}

interface MelodiesTableProps {
    melodies: Melody[];
}

export function MelodiesTable({ melodies }: MelodiesTableProps) {
    return (
        <div className="w-full overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-400 w-[100px]"></TableHead>
                        <TableHead className="text-zinc-400">Title</TableHead>
                        <TableHead className="text-zinc-400">
                            Producer
                        </TableHead>
                        <TableHead className="text-zinc-400">BPM</TableHead>
                        <TableHead className="text-zinc-400">Key</TableHead>
                        <TableHead className="text-zinc-400">Genre</TableHead>
                        <TableHead className="text-zinc-400">
                            Instrument
                        </TableHead>
                        <TableHead className="text-zinc-400 w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {melodies.map((melody) => (
                        <TableRow
                            key={melody.id}
                            className="border-zinc-800 hover:bg-zinc-900/50"
                        >
                            <TableCell className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-white hover:bg-black/50"
                                >
                                    <Play className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-white hover:bg-black/50"
                                >
                                    <Heart
                                        className={`h-4 w-4 ${
                                            melody.isFavorite
                                                ? 'fill-emerald-500 text-emerald-500'
                                                : 'text-white'
                                        }`}
                                    />
                                </Button>
                            </TableCell>
                            <TableCell className="font-medium text-white">
                                {melody.title}
                            </TableCell>
                            <TableCell className="text-zinc-400">
                                {melody.producer}
                            </TableCell>
                            <TableCell className="text-zinc-400">
                                {melody.bpm}
                            </TableCell>
                            <TableCell className="text-zinc-400">
                                {melody.key}
                            </TableCell>
                            <TableCell className="text-zinc-400">
                                {melody.genre}
                            </TableCell>
                            <TableCell className="text-zinc-400">
                                {melody.instrument}
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-white hover:bg-black/50"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
