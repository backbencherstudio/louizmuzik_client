'use client';

import type React from 'react';

import { useState } from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout';

export default function AccountPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle profile update
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle password change
    };

    return (
        <Layout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-3xl space-y-8">
                    {/* Edit Profile Section */}
                    <Card className="border-0 bg-[#0F0F0F] p-6">
                        <form onSubmit={handleProfileUpdate}>
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Edit Your Profile
                            </h2>
                            <div className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-zinc-400"
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            defaultValue="Mr User"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-zinc-400"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            defaultValue="user@user.com"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="artistName"
                                            className="text-zinc-400"
                                        >
                                            Producer Name
                                        </Label>
                                        <Input
                                            id="artistName"
                                            placeholder="Your producer name"
                                            defaultValue="Thunder Beatz"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="location"
                                            className="text-zinc-400"
                                        >
                                            Country
                                        </Label>
                                        <Input
                                            id="location"
                                            placeholder="Your country"
                                            defaultValue="Mexico"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="beatstars"
                                            className="text-zinc-400"
                                        >
                                            Beatstars Username
                                        </Label>
                                        <Input
                                            id="beatstars"
                                            placeholder="Your Beatstars username"
                                            defaultValue="iqu11"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="instagram"
                                            className="text-zinc-400"
                                        >
                                            Instagram Username
                                        </Label>
                                        <Input
                                            id="instagram"
                                            placeholder="Your Instagram username"
                                            defaultValue="iqu22"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="youtube"
                                            className="text-zinc-400"
                                        >
                                            Youtube Username
                                        </Label>
                                        <Input
                                            id="youtube"
                                            placeholder="Your Youtube username"
                                            defaultValue="iqu33"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="tiktok"
                                            className="text-zinc-400"
                                        >
                                            TikTok Username
                                        </Label>
                                        <Input
                                            id="tiktok"
                                            placeholder="Your TikTok username"
                                            defaultValue="@setup_ai"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="bio"
                                        className="text-zinc-400"
                                    >
                                        Bio
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself"
                                        defaultValue="Music producer from the United States. Credits include Drake, The Weeknd, Bad Bunny, Anuel AA, and Maluma."
                                        className="min-h-[100px] border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                                >
                                    Update Profile
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Password & Security Section */}
                    <Card className="border-0 bg-[#0F0F0F] p-6">
                        <form onSubmit={handlePasswordChange}>
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Password & Security
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="currentPassword"
                                        className="text-zinc-400"
                                    >
                                        Current Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="••••••••"
                                            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-white"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="newPassword"
                                            className="text-zinc-400"
                                        >
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={
                                                    showNewPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="••••••••"
                                                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-white"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword
                                                    )
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="confirmPassword"
                                            className="text-zinc-400"
                                        >
                                            Confirm New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="••••••••"
                                                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-white"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Subscription Section */}
                    <Card className="border-0 bg-[#0F0F0F] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Subscription
                                </h2>
                                <p className="text-zinc-400 mt-1">
                                    Current Plan:{' '}
                                    <span className="text-emerald-500">
                                        Pro
                                    </span>
                                </p>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                className="border-zinc-800"
                            >
                                <Link href="/subscription">
                                    Manage Subscription
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span>Unlimited melody uploads</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span>Full marketplace visibility</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span>Priority support</span>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Settings Section */}
                    <Card className="border-0 bg-[#0F0F0F] p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Payment (PayPal Setting)
                        </h2>
                        <Button className="w-full bg-emerald-500 text-black hover:bg-emerald-600">
                            Link your PayPal Account 2
                        </Button>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
