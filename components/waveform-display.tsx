'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformDisplayProps {
    audioUrl: string;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    height?: number;
    width?: string;
    // New props for syncing with audio player
    currentTime?: number;
    duration?: number;
    isControlled?: boolean; // If true, waveform is controlled by external audio player
}

export function WaveformDisplay({
    audioUrl,
    isPlaying = false,
    onPlayPause,
    height = 40,
    width = '100%',
    currentTime = 0,
    duration = 0,
    isControlled = false,
}: WaveformDisplayProps) {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

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
                    interact: !isControlled, // Disable interaction if controlled by external player
                    mediaControls: false,
                    hideScrollbar: true,
                    minPxPerSec: 50,
                    fillParent: true,
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

                // Only handle click events if not controlled by external player
                if (!isControlled) {
                    wavesurfer.on('click', () => {
                        if (onPlayPause) {
                            onPlayPause();
                        }
                    });
                }

                // Load the audio with error handling
                const loadAudio = async () => {
                    try {
                        console.log('Loading audio from:', audioUrl);
                        
                        // Check if URL is accessible first
                        const response = await fetch(audioUrl, { 
                            method: 'HEAD',
                            mode: 'cors' 
                        });
                
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
    }, [audioUrl, height, isControlled]);

    // Handle play/pause state changes (only if not controlled)
    useEffect(() => {
        if (isControlled) return; // Skip if controlled by external player
        
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
    }, [isPlaying, isReady, error, isControlled]);

    // Sync with external audio player progress
    useEffect(() => {
        if (!isControlled || !isReady) return;
        
        const wavesurfer = wavesurferRef.current;
        if (!wavesurfer || !duration) return;

        try {
            // Update the progress position without playing
            const progress = currentTime / duration;
            wavesurfer.setTime(currentTime);
        } catch (err) {
            console.error('Error syncing waveform progress:', err);
        }
    }, [currentTime, duration, isControlled, isReady]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isControlled) {
            // If controlled, just trigger the play/pause callback
            if (onPlayPause) {
                onPlayPause();
            }
        } else {
            // If not controlled, let WaveSurfer handle it
            if (onPlayPause) {
                onPlayPause();
            }
        }
    };

    return (
        <div className="relative" style={{ width, height }}>
            {error && (
                <div
                    className="absolute inset-0 rounded bg-zinc-900/50 flex items-center justify-center text-red-400 text-xs border border-red-500/20"
                    onClick={handleClick}
                >
                    {/* <span className="px-2 py-1">Audio Error</span> */}
                </div>
            )}
            
            {isLoading && !error && (
                <div
                    className="absolute inset-0 rounded bg-zinc-900/50 flex items-center justify-center text-zinc-400 text-xs"
                    onClick={handleClick}
                >
                    {/* <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 border border-emerald-500 border-t-transparent"></div>
                        <span></span>
                    </div> */}
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
                    className="absolute inset-0 flex items-center justify-center space-x-1 opacity-30"
                    onClick={handleClick}
                >
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-sm"
                            style={{
                                width: '1px',
                                height: `${Math.sin(i * 0.2) * 25 + 50}%`,
                                backgroundColor: i < 20 ? '#10b981' : '#6b7280',
                                animation: `waveformProgress 2s ease-in-out infinite`,
                                animationDelay: `${i * 0.05}s`,
                                transform: 'scaleY(0.3)',
                                transformOrigin: 'center'
                            }}
                        />
                    ))}
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes waveformProgress {
                        0% {
                            transform: scaleY(0.3);
                            opacity: 0.4;
                        }
                        25% {
                            transform: scaleY(1);
                            opacity: 1;
                        }
                        50% {
                            transform: scaleY(0.8);
                            opacity: 0.8;
                        }
                        75% {
                            transform: scaleY(1);
                            opacity: 1;
                        }
                        100% {
                            transform: scaleY(0.3);
                            opacity: 0.4;
                        }
                    }
                `
            }} />
        </div>
    );
}