'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLoginMutation } from '../store/api/authApis/authApi';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

    const [login, { isLoading: isLoggingIn }] = useLoginMutation();
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        try {
            const response = await login({ email, password }).unwrap();

            if (response.success) {
                localStorage.setItem('token', response.data?.accessToken);
                console.log("user", response.data);
                router.push('/');
            }
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Login failed:', error);
        }
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
                        Welcome back
                    </h2>
                    <p className="mt-2 text-zinc-400">
                        Sign in to your account to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-zinc-300">
                                Email
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
                        <div>
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-zinc-300"
                                >
                                    Password
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-emerald-500 hover:text-emerald-400"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="mt-1 bg-black/50 border-zinc-800 text-white placeholder:text-zinc-400 focus:border-emerald-500/50"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                        {isLoggingIn ? 'Signing in...' : 'Sign in'}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#0f0f0f]/90 text-zinc-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-black/50 border-zinc-800 text-white hover:bg-black/70 hover:border-emerald-500/50"
                        onClick={() => {
                            // TODO: Implement Google Sign-In
                            console.log('Google Sign-In to be implemented');
                        }}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <p className="text-center text-sm text-zinc-400">
                        Don't have an account?{' '}
                        <Link
                            href="/signup"
                            className="text-emerald-500 hover:text-emerald-400"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
