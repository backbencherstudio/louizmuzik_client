'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Music, Upload, X, Check, Play, Pause } from 'lucide-react';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { KeySelector } from '@/components/key-selector';
import WaveSurfer from 'wavesurfer.js';
import { useSearchParams } from 'next/navigation';

// Predefined options for different fields
const genreOptions = [
    'Trap',
    'Reggaeton',
    'Afrobeat',
    'Drill',
    'House',
    'Hip Hop',
    'R&B',
    'Pop',
    'Rock',
    'Jazz',
];

const instrumentOptions = [
    'Piano',
    'Guitar',
    'Drums',
    'Bass',
    'Synthesizer',
    'Violin',
    'Trumpet',
    'Saxophone',
    'Flute',
    'Percussion',
];

const artistTypeOptions = [
    'Producer',
    'Songwriter',
    'Composer',
    'Beatmaker',
    'Musician',
    'DJ',
    'Artist',
    'Band',
];

// Mock data for existing melodies - In a real app, this would come from your API
const mockMelodies: Record<string, {
    id: string;
    name: string;
    bpm: number;
    key: string;
    splitPercentage: number;
    genres: string[];
    instruments: string[];
    artistTypes: string[];
    audioUrl: string;
}> = {
    '1': {
        id: '1',
        name: 'Summer Vibes',
        bpm: 128,
        key: 'C Major',
        splitPercentage: 50,
        genres: ['Pop', 'Dance'],
        instruments: ['Piano', 'Synth'],
        artistTypes: ['Producer', 'Beatmaker'],
        audioUrl: '/path/to/audio.mp3', // In a real app, this would be a real URL
    },
};

interface TagInputProps {
    label: string;
    placeholder: string;
    tags: string[];
    onRemoveTag: (tag: string) => void;
    options: string[];
    onSelect: (value: string) => void;
}

function TagInput({
    label,
    placeholder,
    tags,
    onRemoveTag,
    options,
    onSelect,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const filteredOptions = options.filter(
        (option) =>
            option.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(option)
    );

    const handleSelect = (value: string) => {
        onSelect(value);
        setInputValue('');
    };

    return (
        <div className="space-y-2">
            <Label className="text-white">{label}</Label>
            <Popover open={inputValue.length > 0}>
                <PopoverTrigger asChild>
                    <div className="relative flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-white">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-sm"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => onRemoveTag(tag)}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-500 placeholder:text-sm"
                            placeholder={placeholder}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command className="bg-zinc-900">
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option}
                                        onSelect={() => handleSelect(option)}
                                        className="text-white hover:bg-zinc-800"
                                    >
                                        <Check className="mr-2 h-4 w-4 opacity-0" />
                                        {option}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default function UploadPage() {
    const searchParams = useSearchParams();
    const melodyId = searchParams.get('id');
    const isEditMode = Boolean(melodyId);

    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const audioUrl = file ? URL.createObjectURL(file) : null;
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedInstruments, setSelectedInstruments] = useState<string[]>(
        []
    );
    const [selectedArtistTypes, setSelectedArtistTypes] = useState<string[]>(
        []
    );
    const [selectedKey, setSelectedKey] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [splitPercentage, setSplitPercentage] = useState<number>(50);
    const [melodyName, setMelodyName] = useState('');

    // Load existing melody data if in edit mode
    useEffect(() => {
        if (isEditMode && melodyId && mockMelodies[melodyId]) {
            const melody = mockMelodies[melodyId];
            setMelodyName(melody.name);
            setSplitPercentage(melody.splitPercentage);
            setSelectedKey(melody.key);
            setSelectedGenres(melody.genres);
            setSelectedInstruments(melody.instruments);
            setSelectedArtistTypes(melody.artistTypes);

            // In a real app, you would fetch and set the audio file here
            // For now, we'll just simulate it with a console log
            console.log('Would load audio file from:', melody.audioUrl);
        }
    }, [isEditMode, melodyId]);

    // Initialize WaveSurfer
    useEffect(() => {
        if (waveformRef.current && file) {
            // Destroy previous instance if it exists
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }

            // Create new WaveSurfer instance
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#374151', // Zinc-700
                progressColor: '#10b981', // Emerald-500
                cursorColor: '#10b981', // Emerald-500
                barWidth: 2,
                barGap: 1,
                barRadius: 3,
                height: 60,
                normalize: true,
            });

            // Load audio file
            wavesurfer.loadBlob(file);

            // Add event listeners
            wavesurfer.on('ready', () => {
                setDuration(wavesurfer.getDuration());
                wavesurferRef.current = wavesurfer;
            });

            wavesurfer.on('audioprocess', () => {
                setCurrentTime(wavesurfer.getCurrentTime());
            });

            wavesurfer.on('finish', () => {
                setIsPlaying(false);
            });

            // Cleanup
            return () => {
                wavesurfer.destroy();
            };
        }
    }, [file]);

    const handlePlayPause = () => {
        if (wavesurferRef.current) {
            if (isPlaying) {
                wavesurferRef.current.pause();
            } else {
                wavesurferRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('audio/')) {
                setFile(file);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('audio/')) {
                setFile(file);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const bpmInput = document.getElementById('bpm') as HTMLInputElement;
        const formData = {
            name: melodyName,
            bpm: bpmInput?.value,
            key: selectedKey,
            splitPercentage,
            genres: selectedGenres,
            instruments: selectedInstruments,
            artistTypes: selectedArtistTypes,
            audioFile: file,
        };

        if (isEditMode) {
            // In a real app, you would update the existing melody
            console.log('Updating melody:', melodyId, formData);
        } else {
            // In a real app, you would create a new melody
            console.log('Creating new melody:', formData);
        }
    };

    return (
        <Layout>
            <div className="p-8">
                <style jsx global>{`
                    /* Remove number input spinners for BPM and split percentage inputs specifically */
                    #bpm::-webkit-inner-spin-button,
                    #bpm::-webkit-outer-spin-button,
                    #split::-webkit-inner-spin-button,
                    #split::-webkit-outer-spin-button {
                        -webkit-appearance: none !important;
                        margin: 0 !important;
                    }

                    #bpm,
                    #split {
                        -moz-appearance: textfield !important;
                    }

                    /* WaveSurfer custom styles */
                    .wavesurfer-handle {
                        background-color: #10b981 !important;
                    }
                `}</style>
                <div className="mx-auto max-w-3xl space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            {isEditMode
                                ? 'Edit Your Melody'
                                : 'Upload Your Melody'}
                        </h1>
                        <p className="mt-2 text-sm md:text-base text-zinc-400">
                            {isEditMode
                                ? 'Update your creation and share the changes'
                                : 'Share your creation with the world'}
                        </p>
                    </div>

                    <Card className="border-0 bg-black p-4 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Drag & Drop Area */}
                            <div
                                className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 md:p-6 transition-colors ${
                                    dragActive
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() =>
                                    document
                                        .getElementById('file-input')
                                        ?.click()
                                }
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    className="hidden"
                                    accept="audio/*"
                                    onChange={handleFileInput}
                                />
                                <div className="flex flex-col items-center gap-2 text-center">
                                    {file ? (
                                        <>
                                            <Music className="h-10 w-10 md:h-12 md:w-12 text-emerald-500" />
                                            <p className="text-base md:text-lg font-medium text-white">
                                                {file.name}
                                            </p>
                                            <p className="text-xs md:text-sm text-zinc-400">
                                                Click or drag to upload a
                                                different file
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-10 w-10 md:h-12 md:w-12 text-zinc-400" />
                                            <p className="text-base md:text-lg font-medium text-white">
                                                Drop your audio file here
                                            </p>
                                            <p className="text-xs md:text-sm text-zinc-400 px-2">
                                                or click to browse (MP3, WAV up
                                                to 50MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Audio Player */}
                            {file && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={handlePlayPause}
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-500"
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-5 w-5" />
                                            ) : (
                                                <Play className="h-5 w-5" />
                                            )}
                                        </Button>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-zinc-400">
                                                {formatTime(currentTime)} /{' '}
                                                {formatTime(duration)}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        ref={waveformRef}
                                        className="rounded-lg bg-zinc-900/50 p-4"
                                    />
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-white"
                                    >
                                        Melody Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={melodyName}
                                        onChange={(e) =>
                                            setMelodyName(e.target.value)
                                        }
                                        placeholder="Enter the name of your melody"
                                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                    />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Left Column - Simple Fields */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="bpm"
                                                className="text-white"
                                            >
                                                BPM
                                            </Label>
                                            <Input
                                                id="bpm"
                                                type="number"
                                                min="0"
                                                placeholder="e.g. 120"
                                                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 [appearance:textfield]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="key"
                                                className="text-white"
                                            >
                                                Key
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between border-zinc-800 bg-zinc-900 text-left font-normal text-white hover:bg-zinc-800"
                                                    >
                                                        {selectedKey ||
                                                            'Select a key'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <KeySelector
                                                        value={selectedKey}
                                                        onChange={
                                                            setSelectedKey
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="split"
                                                className="text-white"
                                            >
                                                Split Percentage
                                            </Label>
                                            <Input
                                                id="split"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={splitPercentage}
                                                onChange={(e) =>
                                                    setSplitPercentage(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 [appearance:textfield]"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column - Tag Fields */}
                                    <div className="space-y-6">
                                        <TagInput
                                            label="Genres"
                                            placeholder="Search genres..."
                                            tags={selectedGenres}
                                            onRemoveTag={(tag) =>
                                                setSelectedGenres(
                                                    selectedGenres.filter(
                                                        (g) => g !== tag
                                                    )
                                                )
                                            }
                                            options={genreOptions}
                                            onSelect={(value) =>
                                                setSelectedGenres((prev) =>
                                                    prev.includes(value)
                                                        ? prev
                                                        : [...prev, value]
                                                )
                                            }
                                        />

                                        <TagInput
                                            label="Instruments"
                                            placeholder="Search instruments..."
                                            tags={selectedInstruments}
                                            onRemoveTag={(tag) =>
                                                setSelectedInstruments(
                                                    selectedInstruments.filter(
                                                        (i) => i !== tag
                                                    )
                                                )
                                            }
                                            options={instrumentOptions}
                                            onSelect={(value) =>
                                                setSelectedInstruments((prev) =>
                                                    prev.includes(value)
                                                        ? prev
                                                        : [...prev, value]
                                                )
                                            }
                                        />

                                        <TagInput
                                            label="Artist Type"
                                            placeholder="Search artist types..."
                                            tags={selectedArtistTypes}
                                            onRemoveTag={(tag) =>
                                                setSelectedArtistTypes(
                                                    selectedArtistTypes.filter(
                                                        (a) => a !== tag
                                                    )
                                                )
                                            }
                                            options={artistTypeOptions}
                                            onSelect={(value) =>
                                                setSelectedArtistTypes((prev) =>
                                                    prev.includes(value)
                                                        ? prev
                                                        : [...prev, value]
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 pt-4">
                                    <Checkbox
                                        id="terms"
                                        className="mt-1 border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        checked={agreedToTerms}
                                        onCheckedChange={(checked) =>
                                            setAgreedToTerms(checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor="terms"
                                        className="text-sm leading-relaxed text-zinc-400"
                                    >
                                        By continuing to upload you are ensuring
                                        that all the details above are your own
                                        creation and if it reveals that you are
                                        not associated with it, Melody Collab
                                        will not be associated with you. Please
                                        check the{' '}
                                        <a
                                            href="/privacy"
                                            className="text-emerald-500 hover:underline"
                                        >
                                            privacy and policy page
                                        </a>{' '}
                                        to get everything clear to you.
                                    </Label>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Button
                                        type="submit"
                                        className="bg-emerald-500 text-white hover:bg-emerald-600"
                                    >
                                        {isEditMode
                                            ? 'Save Changes'
                                            : 'Upload Melody'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
