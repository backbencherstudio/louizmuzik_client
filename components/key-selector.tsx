'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type KeySelectorProps = {
    value: string;
    onChange: (value: string) => void;
};

export function KeySelector({ value, onChange }: KeySelectorProps) {
    const [accidental, setAccidental] = React.useState<'FLAT' | 'SHARP'>(
        'SHARP'
    );
    const [selectedNote, setSelectedNote] = React.useState<string>('');
    const [selectedType, setSelectedType] = React.useState<'Maj' | 'Min' | ''>(
        ''
    );

    // Definimos las notas accidentales y naturales
    const getAccidentalNotes = () => {
        return accidental === 'SHARP'
            ? ['C#', 'D#', 'F#', 'G#', 'A#']
            : ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];
    };
    const naturalNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    const handleNoteClick = (note: string) => {
        setSelectedNote(note);
        if (selectedType) {
            onChange(`${note} ${selectedType}`);
        }
    };

    const handleTypeClick = (type: 'Maj' | 'Min') => {
        setSelectedType(type);
        if (selectedNote) {
            onChange(`${selectedNote} ${type}`);
        }
    };

    const handleClear = () => {
        setSelectedNote('');
        setSelectedType('');
        onChange('');
    };

    return (
        <div className="w-[280px] rounded-lg bg-zinc-900 p-4">
            {/* Accidental Toggle */}
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-zinc-800 p-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAccidental('FLAT')}
                    className={cn(
                        'rounded-md text-sm font-medium',
                        accidental === 'FLAT'
                            ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                            : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    )}
                >
                    FLAT
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAccidental('SHARP')}
                    className={cn(
                        'rounded-md text-sm font-medium',
                        accidental === 'SHARP'
                            ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                            : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    )}
                >
                    SHARP
                </Button>
            </div>

            {/* Accidental Notes */}
            <div className="mb-2 grid grid-cols-5 gap-2 px-4">
                {getAccidentalNotes().map((note) => (
                    <Button
                        key={note}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNoteClick(note)}
                        className={cn(
                            'rounded-md bg-zinc-800 text-sm font-medium',
                            selectedNote === note
                                ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                                : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                        )}
                    >
                        {note}
                    </Button>
                ))}
            </div>

            {/* Natural Notes */}
            <div className="mb-4 grid grid-cols-7 gap-2">
                {naturalNotes.map((note) => (
                    <Button
                        key={note}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNoteClick(note)}
                        className={cn(
                            'rounded-md bg-zinc-800 text-sm font-medium',
                            selectedNote === note
                                ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                                : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                        )}
                    >
                        {note}
                    </Button>
                ))}
            </div>

            {/* Major/Minor Selection */}
            <div className="mb-4 grid grid-cols-2 gap-2">
                <Button
                    variant="ghost"
                    onClick={() => handleTypeClick('Maj')}
                    className={cn(
                        'rounded-md bg-zinc-800 text-sm font-medium',
                        selectedType === 'Maj'
                            ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                            : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    )}
                >
                    Maj
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => handleTypeClick('Min')}
                    className={cn(
                        'rounded-md bg-zinc-800 text-sm font-medium',
                        selectedType === 'Min'
                            ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                            : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    )}
                >
                    Min
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    onClick={handleClear}
                    className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
                >
                    Clear
                </Button>
                <Button className="bg-emerald-500 text-black hover:bg-emerald-600">
                    Apply
                </Button>
            </div>
        </div>
    );
}
