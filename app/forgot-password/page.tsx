'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useOtpForResetPasswordMutation, useResetPasswordMutation } from '../store/api/authApis/authApi';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [resetPassword] = useResetPasswordMutation();
    const [otpForResetPassword] = useOtpForResetPasswordMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await resetPassword({ email, password }).unwrap();
            console.log(response);
            setUserEmail(email);
            setIsEmailSent(true);
            toast.success('Verification code sent to your email');
        } catch (error: any) {
            console.error('Error resetting password:', error);
            const errorMessage = error?.data?.message || error?.message || 'Failed to send verification code';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpForResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(e.currentTarget);
        const otp = formData.get('otp') as string;

        try {
            const response = await otpForResetPassword({ email: userEmail, otp }).unwrap();
            if(response?.success){
                setIsOtpVerified(true);
                toast.success('Password reset successful!');
            } else {
                const errorMessage = response?.message || 'OTP verification failed';
                toast.error(errorMessage);
            }
        } catch (error: any) {
            console.error('Error verifying OTP:', error);
            
            // Handle the specific error structure you provided
            if (error?.data) {
                const errorData = error.data;
                if (errorData.message) {
                    toast.error(errorData.message);
                } else if (errorData.errorSources && errorData.errorSources.length > 0) {
                    toast.error(errorData.errorSources[0].message);
                } else {
                    toast.error('OTP verification failed');
                }
            } else if (error?.message) {
                toast.error(error.message);
            } else {
                toast.error('OTP verification failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const maskEmail = (email: string) => {
        const [username, domain] = email.split('@');
        if (username.length <= 2) {
            return `${username[0]}*@${domain}`;
        }
        const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
        return `${maskedUsername}@${domain}`;
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
                        {!isEmailSent ? 'Reset your password' : !isOtpVerified ? 'Enter verification code' : 'Password reset successful'}
                    </h2>
                    <p className="mt-2 text-zinc-400">
                        {!isEmailSent 
                            ? 'Enter your email address and new password to reset your password'
                            : !isOtpVerified 
                            ? `We've sent a verification code to ${maskEmail(userEmail)}`
                            : 'Your password has been successfully reset'
                        }
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
                            <div>
                                <Label
                                    htmlFor="password"
                                    className="text-zinc-300"
                                >
                                    New Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your new password"
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
                                : 'Send verification code'}
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
                ) : !isOtpVerified ? (
                    <div className="mt-8 space-y-6">
                        {/* OTP Verification Form */}
                        <form onSubmit={handleOtpForResetPassword} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="otp"
                                        className="text-zinc-300"
                                    >
                                        Verification Code
                                    </Label>
                                    <Input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        className="mt-1 bg-black/50 border-zinc-800 text-white placeholder:text-zinc-400 focus:border-emerald-500/50 text-center text-2xl tracking-widest"
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
                                    ? 'Verifying...'
                                    : 'Verify Code'}
                            </Button>
                        </form>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-zinc-400">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    className="text-emerald-500 hover:text-emerald-400"
                                    onClick={async () => {
                                        // Resend OTP by calling the reset password again
                                        setIsLoading(true);
                                        try {
                                            const response = await resetPassword({ email: userEmail, password: '' }).unwrap();
                                            toast.success('Verification code resent to your email');
                                        } catch (error: any) {
                                            console.error('Error resending OTP:', error);
                                            const errorMessage = error?.data?.message || error?.message || 'Failed to resend verification code';
                                            toast.error(errorMessage);
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    Resend code
                                </button>
                            </p>
                            <p className="text-sm text-zinc-400">
                                <button
                                    type="button"
                                    className="text-emerald-500 hover:text-emerald-400"
                                    onClick={() => {
                                        setIsEmailSent(false);
                                        setUserEmail('');
                                    }}
                                >
                                    Use different email
                                </button>
                            </p>
                        </div>

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
                ) : (
                    <div className="mt-8 space-y-6">
                        {/* Success State */}
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold mb-2">
                                Password Reset Complete
                            </h3>
                            <p className="text-emerald-400">
                                Your password has been successfully updated. You can now login with your new password.
                            </p>
                        </div>

                        <Button
                            type="button"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => window.location.href = '/login'}
                        >
                            Go to Login
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