'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Music, Upload, X, Check, Play, Pause, Loader2 } from 'lucide-react';
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
import { useCreateMelodyMutation, useGetMelodyByIdQuery, useUpdateMelodyMutation } from '../store/api/melodyApis/melodyApis';
import { toast } from 'sonner';
import { useLoggedInUserQuery } from '../store/api/authApis/authApi';

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
    "6lack", "2 Chainz", "21 Savage", "50 Cent", "Alicia Keys", "Amapiano", "Anuel AA", "Arcangel", "A$AP Ferg", "A$AP Rocky", 
    "A Boogie wit da Hoodie", "Bad Bunny", "Beyoncé", "Benny Sings", "Beyoncé", "Burna Boy", "Cardi B", "Cañito de Santa", 
    "Central Cee", "Chamanes Cortez", "Chris Brown", "Chronixx", "Chuckyy", "Daddy Yankee", "Damian Marley", "Danny Mendoza", 
    "Don Toliver", "Duki", "Eladio Carrión", "Elvis Crespo", "Fetty Wap", "Future", "G Herbo", "Gazo", "Gente de Zona", "GloRilla", 
    "Gunna", "Hamza", "Juice WRLD", "Jack Harlow", "J Balvin", "Jowell & Randy", "Justin Quiles", "Key Glock", "Kevin Gates", 
    "Koffee", "Lil Baby", "Lil Durk", "Lil Tjay", "Lil Tecca", "Lil Uzi Vert", "Lil Yachty", "Megan Thee Stallion", "Migos", "Milo J", 
    "Miky Woodz", "Moneybagg Yo", "Mora", "Morad", "Myke Towers", "Natti Natasha", "Nemzzz", "Nicki Minaj", "Nicky Jam", "NBA YoungBoy", 
    "Omah Lay", "Omar Courtz", "Ozuna", "Partynextdoor", "Playboi Carti", "Polo G", "Pop Smoke", "Roa", "Roddy Ricch", "Rosalía", 
    "Sean Paul", "Sech", "Shaggy", "Shenseea", "Shy Glizzy", "Smino", "Snoop Dogg", "Tempo", "Tego Calderón", "Tokischa", "Travis Scott", 
    "Trippie Redd", "Tory Lanez", "Ty Dolla $ign", "Tyga", "Tyler, The Creator", "Wisin", "Wisin y Yandel", "Yandel", "YNW Melly", 
    "Young Miko", "Young Thug", "Young Dolph", "YG", "YFG Fatso", "YN Jay", "Zion", "Zion & Lennox"
  ];
  

interface TagInputProps {
    label: string;
    placeholder: string;
    tags: string[];
    onRemoveTag: (tag: string) => void;
    options: string[];
    onSelect: (value: string) => void;
    error?: string;
}

function TagInput({
    label,
    placeholder,
    tags,
    onRemoveTag,
    options,
    onSelect,
    error,
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
                    <div className={`relative flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border bg-zinc-900 px-3 py-2 text-white ${error ? 'border-red-500' : 'border-zinc-800'}`}>
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
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}

export default function UploadPage() {
    const searchParams = useSearchParams();
    const melodyId = searchParams.get('edit');
    const isEditMode = Boolean(melodyId);

    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [bpm, setBpm] = useState('');
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
    const [selectedArtistTypes, setSelectedArtistTypes] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [splitPercentage, setSplitPercentage] = useState<number>(50);
    const [melodyName, setMelodyName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [existingAudioUrl, setExistingAudioUrl] = useState<string>('');
    const [existingImageUrl, setExistingImageUrl] = useState<string>('');
    const [keyPopoverOpen, setKeyPopoverOpen] = useState(false);

    const { data: user } = useLoggedInUserQuery(null);
    const userData = user?.data;

    console.log(userData);

    const [createMelody, { isLoading: isCreatingMelody, reset: resetCreate }] = useCreateMelodyMutation();
    const [updateMelody, { isLoading: isUpdatingMelody, reset: resetUpdate }] = useUpdateMelodyMutation();

    const { data: melodyData, isLoading: isMelodyLoading, error: melodyError } = useGetMelodyByIdQuery(melodyId, { 
        skip: !isEditMode 
    });

    const clearForm = () => {
        setFile(null);
        setImageFile(null);
        setMelodyName('');
        setBpm('');
        setSplitPercentage(50);
        setSelectedKey('');
        setSelectedGenres([]);
        setSelectedInstruments([]);
        setSelectedArtistTypes([]);
        setAgreedToTerms(false);
        setFormErrors({});
        setExistingAudioUrl('');
        setExistingImageUrl('');
    };

    useEffect(() => {
        if (isEditMode && melodyData?.success && melodyData?.data) {
            const melody = melodyData.data;
            
            setMelodyName(melody.name || '');
            setBpm(melody.bpm ? String(melody.bpm) : '');
            setSplitPercentage(melody.splitPercentage || 50);
            setSelectedKey(melody.key || '');
            
            if (melody.genre) {
                try {
                    const genres = typeof melody.genre === 'string' 
                        ? JSON.parse(melody.genre) 
                        : melody.genre;
                    setSelectedGenres(Array.isArray(genres) ? genres : []);
                } catch (e) {
                    setSelectedGenres([]);
                }
            }
            
            if (melody.instruments) {
                try {
                    const instruments = typeof melody.instruments === 'string' 
                        ? JSON.parse(melody.instruments) 
                        : melody.instruments;
                    setSelectedInstruments(Array.isArray(instruments) ? instruments : []);
                } catch (e) {
                    setSelectedInstruments([]);
                }
            }
            
            if (melody.artistType) {
                try {
                    const artistTypes = typeof melody.artistType === 'string' 
                        ? JSON.parse(melody.artistType) 
                        : melody.artistType;
                    setSelectedArtistTypes(Array.isArray(artistTypes) ? artistTypes : []);
                } catch (e) {
                    setSelectedArtistTypes([]);
                }
            }
            
            if (melody.audioUrl) {
                setExistingAudioUrl(melody.audioUrl);
            }
            if (melody.image) {
                setExistingImageUrl(melody.image);
            }
            
            setAgreedToTerms(true);
        }
    }, [isEditMode, melodyData]);

    useEffect(() => {
        if (waveformRef.current && (file || existingAudioUrl)) {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }

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

            if (file) {
                wavesurfer.loadBlob(file);
            } else if (existingAudioUrl) {
                wavesurfer.load(existingAudioUrl);
            }

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

            return () => {
                wavesurfer.destroy();
            };
        }
    }, [file, existingAudioUrl]);

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
                setExistingAudioUrl(''); 
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                setMelodyName(fileName);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('audio/')) {
                setFile(file);
                setExistingAudioUrl(''); 
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                setMelodyName(fileName);
            }
        }
    };

    const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                setExistingImageUrl(''); 
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setExistingAudioUrl('');
        setMelodyName('');
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!melodyName.trim()) {
            errors.melodyName = 'Melody name is required.';
        }
        if (!bpm.trim() || isNaN(Number(bpm)) || Number(bpm) <= 0) {
            errors.bpm = 'Valid BPM is required.';
        }
        if (!selectedKey) {
            errors.key = 'Key is required.';
        }
        if (selectedGenres.length === 0) {
            errors.genres = 'At least one genre is required.';
        }
        if (selectedArtistTypes.length === 0) {
            errors.artistTypes = 'At least one artist type is required.';
        }
        if (!file && !existingAudioUrl) {
            errors.audio = 'Audio file is required.';
        }
        
        if (!agreedToTerms) {
            errors.terms = 'You must agree to the terms.';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Fill all the fields correctly');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('userId', userData?._id || '');
            formData.append('producer', userData?.producer_name || userData?.name || 'Unknown Producer');
            formData.append('name', melodyName);
            formData.append('bpm', bpm);
            formData.append('key', selectedKey);
            formData.append('splitPercentage', String(splitPercentage));
            formData.append('genre', JSON.stringify(selectedGenres));
            formData.append('instruments', JSON.stringify(selectedInstruments));
            formData.append('artistType', JSON.stringify(selectedArtistTypes));
            
            if (file) formData.append('audioUrl', file);
            if (imageFile) formData.append('image', imageFile);

            let response;
            if (isEditMode) {
                response = await updateMelody({ id: melodyId, formData }).unwrap();
                if (response.success) {
                    toast.success('Melody updated successfully');
                    resetUpdate();
                } else {
                    toast.error(response.message || 'Failed to update melody');
                }
            } else {
                response = await createMelody(formData).unwrap();
                if (response.success) {
                    toast.success('Melody created successfully');
                    resetCreate();
                    clearForm();
                } else {
                    toast.error(response.message || 'Failed to create melody');
                }
            }
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || 'Something went wrong');
        }
    };

    const handleKeyChange = (key: string) => {
        setSelectedKey(key);
        setKeyPopoverOpen(false); 
    };

    if (isEditMode && isMelodyLoading) {
        return (
            <Layout>
                <div className="p-8 flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center gap-2 text-white">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading melody data...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (isEditMode && melodyError) {
        return (
            <Layout>
                <div className="p-8 flex items-center justify-center min-h-[400px]">
                    <div className="text-center text-red-500">
                        <p>Failed to load melody data</p>
                        <p className="text-sm text-zinc-400 mt-2">Please try again</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const hasAudio = file || existingAudioUrl;
    const hasImage = imageFile || existingImageUrl;

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
                            {/* Image Upload Area commented by dev */}
                            <div
                                className={`relative hidden min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 md:p-6 transition-colors border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 mb-4 ${formErrors.image ? 'border-red-500' : ''}`}
                                onClick={() => document.getElementById('image-input')?.click()}
                            >
                                <input
                                    id="image-input"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageInput}
                                />
                                <div className="flex flex-col items-center gap-2 text-center">
                                    {hasImage ? (
                                        <>
                                            <Music className="h-8 w-8 text-emerald-500" />
                                            <p className="text-base font-medium text-white">
                                                {imageFile?.name || 'Current cover image'}
                                            </p>
                                            <p className="text-xs text-zinc-400">Click to change image</p>
                                            {existingImageUrl && !imageFile && (
                                                <img 
                                                    src={existingImageUrl} 
                                                    alt="Current cover" 
                                                    className="mt-2 h-16 w-16 rounded object-cover"
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-zinc-400" />
                                            <p className="text-base font-medium text-white">Upload Cover Image</p>
                                            <p className="text-xs text-zinc-400 px-2">(JPG, PNG, etc.)</p>
                                        </>
                                    )}
                                </div>
                                {/* {formErrors.image && (
                                    <p className="mt-2 text-xs text-red-500">{formErrors.image}</p>
                                )} */}
                            </div>

                            {/* Drag & Drop Area */}
                            <div
                                className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 md:p-6 transition-colors ${
                                    dragActive
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800'
                                } ${formErrors.audio ? 'border-red-500' : ''}`}
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
                                    {hasAudio ? (
                                        <>
                                            <Music className="h-10 w-10 md:h-12 md:w-12 text-emerald-500" />
                                            <p className="text-base md:text-lg font-medium text-white">
                                                {file?.name || 'Current audio file'}
                                            </p>
                                            <p className="text-xs md:text-sm text-zinc-400">
                                                Click or drag to upload a different file
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-10 w-10 md:h-12 md:w-12 text-zinc-400" />
                                            <p className="text-base md:text-lg font-medium text-white">
                                                Drop your audio file here
                                            </p>
                                            <p className="text-xs md:text-sm text-zinc-400 px-2">
                                                or click to browse (MP3, WAV up to 50MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                                {formErrors.audio && (
                                    <p className="mt-2 text-xs text-red-500">{formErrors.audio}</p>
                                )}
                            </div>

                            {/* Audio Player */}
                            {hasAudio && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
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
                                                    {file?.name.split('.')[0] || melodyName || 'Audio File'}
                                                </p>
                                                <p className="text-xs text-zinc-400">
                                                    {formatTime(currentTime)} /{' '}
                                                    {formatTime(duration)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleRemoveFile}
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div
                                        ref={waveformRef}
                                        className="rounded-lg bg-zinc-900/50 p-4"
                                    />
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="grid gap-6">
                                <div className="space-y-2 ">
                                    <Label htmlFor="name" className="text-white">
                                        Melody Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={melodyName}
                                        onChange={(e) => setMelodyName(e.target.value)}
                                        placeholder="Enter the name of your melody"
                                        className={`border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 ${formErrors.melodyName ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.melodyName && (
                                        <p className="mt-1 text-xs text-red-500">{formErrors.melodyName}</p>
                                    )}
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Left Column - Simple Fields */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="bpm" className="text-white">
                                                BPM
                                            </Label>
                                            <Input
                                                id="bpm"
                                                type="number"
                                                min="0"
                                                value={bpm}
                                                onChange={(e) => setBpm(e.target.value)}
                                                placeholder="e.g. 120"
                                                className={`border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 [appearance:textfield] ${formErrors.bpm ? 'border-red-500' : ''}`}
                                            />
                                            {formErrors.bpm && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.bpm}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="key" className="text-white">
                                                Key
                                            </Label>
                                            <Popover open={keyPopoverOpen} onOpenChange={setKeyPopoverOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={`w-full justify-between border-zinc-800 bg-zinc-900 text-left font-normal text-white hover:bg-zinc-800 ${formErrors.key ? 'border-red-500' : ''}`}
                                                    >
                                                        {selectedKey || 'Select a key'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <KeySelector
                                                        value={selectedKey}
                                                        onChange={handleKeyChange}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {formErrors.key && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.key}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="split" className="text-white">
                                                Split Percentage
                                            </Label>
                                            <Input
                                                id="split"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={splitPercentage}
                                                onChange={(e) =>
                                                    setSplitPercentage(Number(e.target.value))
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
                                                    selectedGenres.filter((g) => g !== tag)
                                                )
                                            }
                                            options={genreOptions}
                                            onSelect={(value) =>
                                                setSelectedGenres((prev) =>
                                                    prev.includes(value) ? prev : [...prev, value]
                                                )
                                            }
                                            error={formErrors.genres}
                                        />

                                        {/* <TagInput
                                            label="Instruments"
                                            placeholder="Search instruments..."
                                            tags={selectedInstruments}
                                            onRemoveTag={(tag) =>
                                                setSelectedInstruments(
                                                    selectedInstruments.filter((i) => i !== tag)
                                                )
                                            }
                                            options={instrumentOptions}
                                            onSelect={(value) =>
                                                setSelectedInstruments((prev) =>
                                                    prev.includes(value) ? prev : [...prev, value]
                                                )
                                            }
                                            error={formErrors.instruments}
                                        /> */}

                                        <TagInput
                                            label="Artist Type"
                                            placeholder="Search artist types..."
                                            tags={selectedArtistTypes}
                                            onRemoveTag={(tag) =>
                                                setSelectedArtistTypes(
                                                    selectedArtistTypes.filter((a) => a !== tag)
                                                )
                                            }
                                            options={artistTypeOptions}
                                            onSelect={(value) =>
                                                setSelectedArtistTypes((prev) =>
                                                    prev.includes(value) ? prev : [...prev, value]
                                                )
                                            }
                                            error={formErrors.artistTypes}
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
                                {formErrors.terms && (
                                    <p className="mt-1 text-xs text-red-500">{formErrors.terms}</p>
                                )}

                                <div className="flex justify-end pt-6">
                                    <Button
                                        type="submit"
                                        disabled={isCreatingMelody || isUpdatingMelody}
                                        className="bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {(isCreatingMelody || isUpdatingMelody) ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                {isEditMode ? 'Updating...' : 'Uploading...'}
                                            </div>
                                        ) : (
                                            isEditMode ? 'Save Changes' : 'Upload Melody'
                                        )}
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