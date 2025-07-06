'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // TODO: Implement password reset email logic here

        // Simulate email sent for now
        setTimeout(() => {
            setIsEmailSent(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-[#0f0f0f] relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-emerald-500 blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-emerald-500 blur-3xl"></div>
            </div>

            <div className="w-full max-w-md p-8 space-y-8 bg-gradient-to-br from-[#0f0f0f]/90 to-black/90 backdrop-blur-sm rounded-2xl border border-zinc-800 shadow-2xl relative z-10">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/isotype.png"
                            alt="MelodyCollab"
                            width={32}
                            height={32}
                            className="h-8 w-8"
                            priority
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-zinc-400">
                        Enter your email address and we'll send you instructions
                        to reset your password
                    </p>
                </div>

                {!isEmailSent ? (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-zinc-300"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="mt-1 bg-black/50 border-zinc-800 text-white placeholder:text-zinc-400 focus:border-emerald-500/50"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            {isLoading
                                ? 'Sending...'
                                : 'Send reset instructions'}
                        </Button>

                        <p className="text-center text-sm text-zinc-400">
                            Remember your password?{' '}
                            <Link
                                href="/login"
                                className="text-emerald-500 hover:text-emerald-400"
                            >
                                Back to login
                            </Link>
                        </p>
                    </form>
                ) : (
                    <div className="mt-8 space-y-6">
                        <div className="rounded-lg bg-emerald-500/10 p-4 text-emerald-500 text-center">
                            <svg
                                className="mx-auto h-12 w-12 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold mb-2">
                                Check your email
                            </h3>
                            <p className="text-emerald-400">
                                We've sent you instructions to reset your
                                password. Please check your inbox.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-black/50 border-zinc-800 text-white hover:bg-black/70 hover:border-emerald-500/50"
                            onClick={() => setIsEmailSent(false)}
                        >
                            Try another email
                        </Button>

                        <p className="text-center text-sm text-zinc-400">
                            Or go back to{' '}
                            <Link
                                href="/login"
                                className="text-emerald-500 hover:text-emerald-400"
                            >
                                login
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
