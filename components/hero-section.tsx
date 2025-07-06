'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { interBlackItalic } from '@/app/fonts';
import { Play, Music } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative w-full min-h-screen flex items-center py-20 md:py-0 overflow-hidden bg-black">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-10"></div>

                {/* Main background image - UPDATED */}
                <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/landing-02-LQVGkPexNLMXFs7XFC1X1C5Q6yXwPy.webp"
                    alt="Music Production Background"
                    fill
                    className="object-cover object-center opacity-60"
                    priority
                />

                {/* Animated circles */}
                <div
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] animate-pulse"
                    style={{ animationDuration: '8s' }}
                ></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-pulse"
                    style={{ animationDuration: '12s' }}
                ></div>
            </div>

            <style jsx global>{`
                @keyframes wave {
                    0% {
                        height: 30%;
                    }
                    50% {
                        height: 100%;
                    }
                    100% {
                        height: 30%;
                    }
                }

                .wave-bar {
                    animation: wave 1.5s ease-in-out infinite;
                }

                .wave-bar:nth-child(2n) {
                    animation-delay: 0.2s;
                }

                .wave-bar:nth-child(3n) {
                    animation-delay: 0.4s;
                }

                .wave-bar:nth-child(4n) {
                    animation-delay: 0.6s;
                }

                .wave-bar:nth-child(5n) {
                    animation-delay: 0.8s;
                }
            `}</style>

            <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center">
                    {/* Left side - Text content */}
                    <div className="text-center lg:text-left w-full max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
                            <div className="flex items-center gap-[2px] h-4">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="wave-bar w-[2px] bg-primary"
                                        style={{
                                            height: '100%',
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <span className="text-sm font-medium">
                                Music Producer Collaboration Platform
                            </span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="relative">
                                <span className="block text-4xl md:text-5xl font-bold tracking-tight text-white/80 mb-4">
                                    COLLAB WITH
                                </span>
                                <div
                                    className={`text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80 font-extrabold tracking-tight leading-none ${interBlackItalic.className}`}
                                >
                                    TOP MUSIC
                                    <br />
                                    <span className="inline-block mt-2">
                                        PRODUCERS
                                    </span>
                                </div>
                            </h1>

                            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl">
                                Browse thousands of free melodies from top
                                producers to collaborate on your next hit!
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-10">
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary text-black hover:bg-primary/90 px-8 py-4 text-lg h-auto rounded-lg w-full sm:w-auto font-medium transition-all duration-300 transform hover:scale-105"
                            >
                                <Link href="#pricing">Get Started Today</Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 px-8 py-4 text-lg h-auto rounded-lg group w-full sm:w-auto transition-all duration-300 transform hover:scale-105"
                            >
                                <Link
                                    href="#pricing"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <Play className="w-5 h-5 text-primary group-hover:text-primary" />
                                    <span>Try For Free</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right side - Visual element */}
                    <div className="block relative mt-12 lg:mt-0 w-full max-w-xl mx-auto">
                        {/* Floating device mockup */}
                        <div className="relative mx-auto">
                            {/* Decorative elements */}
                            <div className="absolute -top-20 -left-20 w-40 h-40 hidden lg:block">
                                <div className="relative w-full h-full">
                                    <div className="absolute top-0 left-0 w-16 h-16 bg-primary/20 rounded-full blur-md animate-pulse"></div>
                                    <div
                                        className="absolute bottom-0 right-0 w-20 h-20 bg-primary/30 rounded-full blur-md"
                                        style={{ animationDelay: '1s' }}
                                    ></div>
                                </div>
                            </div>

                            {/* Main device frame */}
                            <div className="relative bg-[#0f0f0f] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                                {/* Audio waveform visualization */}
                                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-primary/20 to-transparent flex items-center justify-center">
                                    <div className="flex items-end h-8 space-x-1">
                                        {[...Array(20)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="wave-bar w-1 bg-primary rounded-full"
                                                style={{
                                                    animationDelay: `${
                                                        index * 0.1
                                                    }s`,
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-20 pb-8 px-6">
                                    <Image
                                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/landing-02-LQVGkPexNLMXFs7XFC1X1C5Q6yXwPy.webp"
                                        alt="MelodyCollab Sample Packs"
                                        width={600}
                                        height={400}
                                        className="rounded-lg shadow-lg border border-gray-800"
                                    />

                                    {/* Updated info section */}
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Music className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">
                                                    Share your music and
                                                    collaborate with top
                                                    producers
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    Download, collaborate, and
                                                    create
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl -z-10 opacity-50"></div>

                            {/* Floating elements */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 hidden lg:block">
                                <div className="relative w-full h-full">
                                    <div
                                        className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-full blur-md animate-pulse"
                                        style={{ animationDelay: '0.5s' }}
                                    ></div>
                                    <div
                                        className="absolute bottom-0 left-0 w-12 h-12 bg-primary/30 rounded-full blur-md"
                                        style={{ animationDelay: '1.5s' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom wave decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute bottom-0 w-full h-20 text-[#0f0f0f]"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,141.14c67.6,0,123.64-16.34,180.32-39.59C466.89,67.67,518.81,58.66,583.45,44.67c69.27-15.17,140.46-18.31,209.95-5.5"
                        fill="currentColor"
                    ></path>
                </svg>
            </div>
        </section>
    );
}
