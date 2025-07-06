'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

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
    melodyData: {
        name: string;
        splitPercentage: string;
        producerName: string;
        beatstarsUsername: string;
        soundeeUsername?: string;
        instagramUsername: string;
        youtubeChannel: string;
    };
}

export function CollabModal({ isOpen, onClose, melodyData }: CollabModalProps) {
    const [isChecked, setIsChecked] = useState(false);

    const handleDownloadMelody = () => {
        // Handle melody download
        console.log('Downloading melody...');
    };

    const handleDownloadLicence = () => {
        // Handle licence download
        console.log('Downloading licence...');
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
                        {melodyData.name}
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                Split Percentage : {melodyData.splitPercentage}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                Producer name: {melodyData.producerName}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                Beatstars Username :{' '}
                                {melodyData.beatstarsUsername}
                            </span>
                        </div>
                        {melodyData.soundeeUsername && (
                            <div className="flex items-center gap-3 text-zinc-300">
                                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                <span>
                                    Soundee Username :{' '}
                                    {melodyData.soundeeUsername}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                Instagram Username :{' '}
                                {melodyData.instagramUsername}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            <span>
                                YouTube Channel : {melodyData.youtubeChannel}
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
