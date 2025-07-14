'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useOtpMutation } from '@/app/store/api/authApis/authApi';

interface OtpVerificationProps {
    email: string;
    onVerificationSuccess: () => void;
    onBack: () => void;
}

export default function OtpVerification({ email, onVerificationSuccess, onBack }: OtpVerificationProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    
    const [verifyOtp, { isLoading: isOtpLoading }] = useOtpMutation();
    const [resendOtp, { isLoading: isResending }] = useOtpMutation();

    // Timer for resend OTP
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple characters
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            setIsLoading(false);
            return;
        }

        try {
            const response = await verifyOtp({
                email,
                otp: otpString
            }).unwrap();
            
            console.log('OTP verification successful:', response);
            onVerificationSuccess();
        } catch (error: any) {
            console.error('OTP verification failed:', error);
            setError(error?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;
        
        try {
            await resendOtp({ email }).unwrap();
            console.log('OTP resent successfully to:', email);
            setTimeLeft(60);
            setCanResend(false);
            setError('');
        } catch (error: any) {
            console.error('Failed to resend OTP:', error);
            setError(error?.data?.message || 'Failed to resend OTP. Please try again.');
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
                        Verify your email
                    </h2>
                    <p className="mt-2 text-zinc-400">
                        We've sent a 6-digit code to
                    </p>
                    <p className="text-emerald-500 font-medium">{email}</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <Label className="text-zinc-300 text-center block">
                            Enter the 6-digit code
                        </Label>
                        
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-lg font-semibold bg-black/50 border-zinc-800 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                    placeholder=""
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || otp.join('').length !== 6}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    <div className="text-center space-y-4">
                        <p className="text-sm text-zinc-400">
                            Didn't receive the code?{' '}
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isResending}
                                    className="text-emerald-500 hover:text-emerald-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResending ? 'Sending...' : 'Resend'}
                                </button>
                            ) : (
                                <span className="text-zinc-600">
                                    Resend in {timeLeft}s
                                </span>
                            )}
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            className="w-full bg-black/50 border-zinc-800 text-white hover:bg-black/70 hover:border-emerald-500/50"
                        >
                            Back to Sign Up
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 