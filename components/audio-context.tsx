"use client"

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    currentMelodyId: string | null;
    setAudioState: (state: {
        currentTime: number;
        duration: number;
        isPlaying: boolean;
        currentMelodyId: string | null;
    }) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [audioState, setAudioState] = useState({
        currentTime: 0,
        duration: 0,
        isPlaying: false,
        currentMelodyId: null as string | null,
    });

    const value = {
        ...audioState,
        setAudioState,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudioContext() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudioContext must be used within an AudioProvider');
    }
    return context;
}

