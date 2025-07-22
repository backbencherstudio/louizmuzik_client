'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformDisplayProps {
    audioUrl: string;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    height?: number;
    width?: string;
}

export function WaveformDisplay({
    audioUrl,
    isPlaying = false,
    onPlayPause,
    height = 40,
    width = '100%',
}: WaveformDisplayProps) {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    // console.log('audioUrl', audioUrl);

    useEffect(() => {
        // Clean up previous instance if it exists
        if (wavesurferRef.current) {
            wavesurferRef.current.destroy();
            wavesurferRef.current = null;
        }

        if (!waveformRef.current || !audioUrl) {
            console.log('No container or audio URL:', { container: !!waveformRef.current, audioUrl });
            return;
        }

        // console.log('Creating WaveSurfer for URL:', audioUrl);
        setIsLoading(true);
        setError(null);
        setIsReady(false);

        // Add a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            try {
                // Create WaveSurfer instance
                const wavesurfer = WaveSurfer.create({
                    container: waveformRef.current!,
                    waveColor: '#374151',
                    progressColor: '#10b981',
                    cursorColor: '#10b981',
                    barWidth: 2,
                    barGap: 1,
                    barRadius: 2,
                    height: height,
                    normalize: true,
                    interact: true,
                    mediaControls: false,
                    hideScrollbar: true,
                    minPxPerSec: 50,
                    fillParent: true,
                    // Add backend option for better browser compatibility
                    backend: 'WebAudio',
                });

                wavesurferRef.current = wavesurfer;

                // Set up event listeners
                wavesurfer.on('ready', () => {
                    console.log('WaveSurfer is ready for:', audioUrl);
                    setIsLoading(false);
                    setIsReady(true);
                    setError(null);
                });

                wavesurfer.on('error', (err) => {
                    console.error('WaveSurfer error:', err);
                    setError('Failed to load audio waveform');
                    setIsLoading(false);
                    setIsReady(false);
                });

                wavesurfer.on('loading', (percent) => {
                    console.log('Loading progress:', percent + '%');
                });

                // Load the audio with error handling
                const loadAudio = async () => {
                    try {
                        console.log('Loading audio from:', audioUrl);
                        
                        // Check if URL is accessible first
                        const response = await fetch(audioUrl, { 
                            method: 'HEAD',
                            mode: 'cors' 
                        });
                
                        console.log('Response status:', response.status);
                        console.log('Response headers:', response.headers);
                
                        if (!response.ok) {
                            throw new Error('Audio file not accessible');
                        }
                
                        await wavesurfer.load(audioUrl);
                    } catch (err) {
                        console.error('Error loading audio:', err);
                        setError('Cannot load audio file');
                        setIsLoading(false);
                        setIsReady(false);
                    }
                };

                loadAudio();

            } catch (err) {
                console.error('Error creating WaveSurfer:', err);
                setError('Failed to initialize waveform');
                setIsLoading(false);
                setIsReady(false);
            }
        }, 100);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            if (wavesurferRef.current) {
                try {
                    wavesurferRef.current.pause();
                    wavesurferRef.current.destroy();
                } catch (err) {
                    console.error('Error destroying WaveSurfer:', err);
                }
                wavesurferRef.current = null;
            }
            setIsReady(false);
        };
    }, [audioUrl, height]);

    // Handle play/pause state changes
    useEffect(() => {
        const wavesurfer = wavesurferRef.current;
        if (!wavesurfer || !isReady || error) {
            return;
        }

        try {
            if (isPlaying) {
                if (!wavesurfer.isPlaying()) {
                    wavesurfer.play();
                }
            } else {
                if (wavesurfer.isPlaying()) {
                    wavesurfer.pause();
                }
            }
        } catch (err) {
            console.error('Error controlling playback:', err);
        }
    }, [isPlaying, isReady, error]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onPlayPause) {
            onPlayPause();
        }
    };

    return (
        <div className="relative" style={{ width, height }}>
            {error && (
                <div
                    className="absolute inset-0 rounded bg-zinc-900/50 flex items-center justify-center text-red-400 text-xs border border-red-500/20"
                    onClick={handleClick}
                >
                    <span className="px-2 py-1">Audio Error</span>
                </div>
            )}
            
            {isLoading && !error && (
                <div
                    className="absolute inset-0 rounded bg-zinc-900/50 flex items-center justify-center text-zinc-400 text-xs"
                    onClick={handleClick}
                >
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 border border-emerald-500 border-t-transparent"></div>
                        <span>Loading...</span>
                    </div>
                </div>
            )}
            
            <div
                ref={waveformRef}
                className={`rounded bg-zinc-900/30 cursor-pointer transition-all duration-300 ${
                    (isLoading || error) ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                    width: '100%', 
                    height: height,
                    display: (isLoading || error) ? 'none' : 'block'
                }}
                onClick={handleClick}
            />
            
            {/* Fallback static waveform when loading or error */}
            {(isLoading || error) && (
                <div 
                    className="absolute inset-0 flex items-center justify-center space-x-1 opacity-20"
                    onClick={handleClick}
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-zinc-600 rounded-sm animate-pulse"
                            style={{
                                width: '2px',
                                height: `${Math.random() * 60 + 20}%`,
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}