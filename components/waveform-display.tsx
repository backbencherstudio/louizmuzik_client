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

    useEffect(() => {
        if (!waveformRef.current || !audioUrl) {
            return;
        }

        setIsLoading(true);
        setError(null);

        // Crear la instancia de WaveSurfer
        const wavesurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#374151',
            progressColor: '#10b981',
            cursorColor: '#10b981',
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            height: height,
            normalize: true,
            responsive: true,
            interact: true,
            mediaControls: false,
            hideScrollbar: true,
            minPxPerSec: 50,
            fillParent: true,
        });

        // Guardar la referencia
        wavesurferRef.current = wavesurfer;

        // Configurar los event listeners
        wavesurfer.on('ready', () => {
            console.log('WaveSurfer is ready');
            setIsLoading(false);
        });

        wavesurfer.on('error', (err) => {
            console.error('WaveSurfer error:', err);
            setError('Error loading audio');
            setIsLoading(false);
        });

        // Cargar el audio
        try {
            wavesurfer.load(audioUrl);
        } catch (err) {
            console.error('Error loading audio:', err);
            setError('Error loading audio');
            setIsLoading(false);
        }

        // Cleanup
        return () => {
            if (wavesurferRef.current) {
                // Detener la reproducción antes de destruir
                wavesurferRef.current.pause();
                // Esperar un momento antes de destruir
                setTimeout(() => {
                    if (wavesurferRef.current) {
                        wavesurferRef.current.destroy();
                        wavesurferRef.current = null;
                    }
                }, 100);
            }
        };
    }, [audioUrl, height]);

    useEffect(() => {
        const wavesurfer = wavesurferRef.current;
        if (!wavesurfer || isLoading || error) return;

        try {
            if (isPlaying) {
                wavesurfer.play();
            } else {
                wavesurfer.pause();
            }
        } catch (err) {
            console.error('Error controlling playback:', err);
        }
    }, [isPlaying, isLoading, error]);

    return (
        <div className="relative">
            {error && (
                <div
                    style={{ width, height }}
                    className="rounded bg-zinc-900/50 flex items-center justify-center text-red-500 text-sm"
                >
                    {error}
                </div>
            )}
            {isLoading && (
                <div
                    style={{ width, height }}
                    className="rounded bg-zinc-900/50 flex items-center justify-center text-zinc-400 text-sm"
                >
                    Loading audio...
                </div>
            )}
            <div
                ref={waveformRef}
                style={{ width, height: isLoading || error ? 0 : height }}
                className="rounded bg-zinc-900/50 transition-all duration-300"
                onClick={onPlayPause}
            />
        </div>
    );
}
