'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface CollabModalProps {
    isOpen: boolean;
    onClose: () => void;
    melodyData: any;
    melodyDownloadCounter: (melodyId: string) => Promise<any>;
}

export function CollabModal({ isOpen, onClose, melodyData, melodyDownloadCounter }: CollabModalProps) {
    const [isChecked, setIsChecked] = useState(false);

    const handleDownloadMelody = async () => {
        try {
            // First, increment the download counter
            const response = await melodyDownloadCounter(melodyData._id);

            if (response) {
                console.error('Failed to increment download counter');
            }

            // Then download the file
            const audioUrl = melodyData.audioUrl || melodyData.audio_path || melodyData.audio;
            if (audioUrl) {
                const link = document.createElement('a');
                link.href = audioUrl;
                link.download = audioUrl.split('/').pop() || `${melodyData.name}.wav`;
                link.click();
                toast.success('Melody downloaded successfully!');
                onClose();
            } else {
                toast.error("No audio URL found!");
            }
        } catch (error) {
            console.error("Error downloading melody:", error);
            toast.error("Failed to download melody. Please try again.");
        }
    };

    const handleDownloadLicence = () => {
        // Handle licence download - this would typically generate a PDF
        console.log('Downloading licence...');
        onClose();
    };

    return (
        <Dialog modal open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-[#0F0F0F] border-zinc-800">
                <DialogHeader>
                    <div className="flex items-center">
                        <DialogTitle className="text-2xl font-bold text-emerald-500">
                            Collab Percentage Information
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="mt-4">
                    <h3 className="text-lg font-medium text-white mb-6">
                        {melodyData?.name || 'Melody'}
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                Producer: {melodyData?.producer || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                BPM: {melodyData?.bpm || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                Key: {melodyData?.key || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                Genre: {Array.isArray(melodyData?.genre) 
                                    ? melodyData.genre.join(', ') 
                                    : melodyData?.genre || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                Artist Type: {Array.isArray(melodyData?.artistType) 
                                    ? melodyData.artistType.join(', ') 
                                    : melodyData?.artistType || 'Unknown'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-start gap-3">
                        <Checkbox
                            id="terms"
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                                setIsChecked(checked as boolean)
                            }
                            className="mt-1 border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-zinc-400 leading-relaxed"
                        >
                            By downloading and using this melody, the producer
                            agrees to add the melody&apos;s owner as a
                            collaborator on the beat that is uploaded to any
                            digital store or music distribution platform.
                            Failure to comply with this condition may result in
                            the removal of the beat from such platforms.
                        </label>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Button
                            onClick={handleDownloadMelody}
                            disabled={!isChecked}
                            className="bg-emerald-500 text-black hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                        >
                            Download Melody
                        </Button>
                        <Button
                            onClick={handleDownloadLicence}
                            disabled={!isChecked}
                            className="bg-emerald-500 text-black hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                        >
                            Download Licence
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
