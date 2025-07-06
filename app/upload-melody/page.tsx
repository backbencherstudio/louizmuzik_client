'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Layout from '@/components/layout';

// Sample data for a melody (simulating database/API response)
const getMelodyById = (id: string) => {
    // This would be replaced with an actual API call
    return {
        id: parseInt(id),
        name: 'Summer Vibes',
        producer: 'Thunder Beatz',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        audioUrl: '/audio/melody-1.mp3',
        bpm: 128,
        key: 'C Maj',
        genre: 'Pop',
        artistType: 'Producer',
    };
};

export default function UploadMelodyPage() {
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [formData, setFormData] = useState({
        name: '',
        bpm: '',
        key: '',
        genre: '',
        artistType: '',
        audioFile: null as File | null,
        imageFile: null as File | null,
    });
    const [previewImage, setPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            // Fetch melody data when in edit mode
            const melodyData = getMelodyById(editId);
            setFormData({
                name: melodyData.name,
                bpm: melodyData.bpm.toString(),
                key: melodyData.key,
                genre: melodyData.genre,
                artistType: melodyData.artistType,
                audioFile: null,
                imageFile: null,
            });
            setPreviewImage(melodyData.image);
        }
    }, [editId, isEditMode]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, imageFile: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // This would be replaced with actual API calls
            if (isEditMode) {
                // Update existing melody
                console.log('Updating melody:', { id: editId, ...formData });
            } else {
                // Create new melody
                console.log('Creating new melody:', formData);
            }

            // Redirect to items page after success
            window.location.href = '/items';
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900/50">
                <div className="mx-auto max-w-4xl px-4 py-8">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-8 text-zinc-400 hover:text-white"
                        asChild
                    >
                        <Link href="/items" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Items
                        </Link>
                    </Button>

                    <h1 className="text-3xl font-bold text-white mb-8">
                        {isEditMode ? 'Edit Melody' : 'Upload Melody'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Cover Image
                            </label>
                            <div className="flex items-start gap-4">
                                <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-zinc-800">
                                    {previewImage ? (
                                        <Image
                                            src={previewImage}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-500">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="border-zinc-800 bg-zinc-900 text-white"
                                    />
                                    <p className="mt-2 text-sm text-zinc-500">
                                        Recommended: 500x500px, max 2MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Audio Upload */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Audio File
                            </label>
                            <Input
                                type="file"
                                accept="audio/*"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        audioFile: e.target.files?.[0] || null,
                                    }))
                                }
                                className="border-zinc-800 bg-zinc-900 text-white"
                            />
                            <p className="mt-2 text-sm text-zinc-500">
                                Accepted formats: WAV, MP3. Max 10MB
                            </p>
                        </div>

                        {/* Melody Name */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Melody Name
                            </label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="border-zinc-800 bg-zinc-900 text-white"
                                placeholder="Enter melody name"
                            />
                        </div>

                        {/* BPM */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                BPM
                            </label>
                            <Input
                                type="number"
                                value={formData.bpm}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        bpm: e.target.value,
                                    }))
                                }
                                className="border-zinc-800 bg-zinc-900 text-white"
                                placeholder="Enter BPM"
                            />
                        </div>

                        {/* Key */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Key
                            </label>
                            <Select
                                value={formData.key}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        key: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
                                    <SelectValue placeholder="Select key" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="C Maj">
                                        C Major
                                    </SelectItem>
                                    <SelectItem value="G Maj">
                                        G Major
                                    </SelectItem>
                                    <SelectItem value="D Min">
                                        D Minor
                                    </SelectItem>
                                    <SelectItem value="A Min">
                                        A Minor
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Genre */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Genre
                            </label>
                            <Select
                                value={formData.genre}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        genre: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
                                    <SelectValue placeholder="Select genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pop">Pop</SelectItem>
                                    <SelectItem value="Hip Hop">
                                        Hip Hop
                                    </SelectItem>
                                    <SelectItem value="Jazz">Jazz</SelectItem>
                                    <SelectItem value="Electronic">
                                        Electronic
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Artist Type */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Artist Type
                            </label>
                            <Select
                                value={formData.artistType}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        artistType: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
                                    <SelectValue placeholder="Select artist type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Producer">
                                        Producer
                                    </SelectItem>
                                    <SelectItem value="Beatmaker">
                                        Beatmaker
                                    </SelectItem>
                                    <SelectItem value="Composer">
                                        Composer
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Saving...'
                                : isEditMode
                                ? 'Save Changes'
                                : 'Upload Melody'}
                        </Button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
