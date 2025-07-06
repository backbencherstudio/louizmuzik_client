'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout';

export default function SimpleProPage() {
    return (
        <Layout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <h1 className="mb-4 text-4xl font-bold text-white">
                            Start your 7-day free trial
                        </h1>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Get access to all the benefits today for free and
                            take your career to the next level.
                        </p>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className="space-y-6">
                            <Button className="w-full bg-[#ffc439] py-6 text-blue-900 hover:bg-[#f0b82d]">
                                <Image
                                    src="/placeholder.svg?height=24&width=80"
                                    alt="PayPal"
                                    width={80}
                                    height={24}
                                    className="h-6"
                                />
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black px-2 text-zinc-500">
                                        Or pay with card
                                    </span>
                                </div>
                            </div>

                            <Card className="border-0 bg-zinc-900/50 p-6">
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="card"
                                            className="text-zinc-400"
                                        >
                                            Card Number
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="card"
                                                placeholder="1234 1234 1234 1234"
                                                className="border-zinc-800 bg-zinc-900 pl-4 pr-12 text-white placeholder:text-zinc-500"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Image
                                                    src="/placeholder.svg?height=20&width=32"
                                                    alt="Mastercard"
                                                    width={32}
                                                    height={20}
                                                    className="h-5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="expiry"
                                                className="text-zinc-400"
                                            >
                                                Expiration Date
                                            </Label>
                                            <Input
                                                id="expiry"
                                                placeholder="MM / YY"
                                                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="cvc"
                                                className="text-zinc-400"
                                            >
                                                CVC
                                            </Label>
                                            <Input
                                                id="cvc"
                                                placeholder="CVC"
                                                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center justify-between mb-2 text-sm">
                                            <span className="text-zinc-400">
                                                Today's payment
                                            </span>
                                            <span className="font-medium text-white">
                                                $0.00
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mb-4 text-sm">
                                            <span className="text-zinc-400">
                                                Next payment on March 2, 2025
                                            </span>
                                            <span className="font-medium text-white">
                                                $9.99
                                            </span>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-emerald-500 py-6 text-white hover:bg-emerald-600">
                                        Start Pro Trial
                                    </Button>

                                    <p className="text-xs text-zinc-400 text-center mt-4">
                                        By continuing, you agree to our Terms of
                                        Service and Privacy Policy
                                    </p>
                                </form>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
