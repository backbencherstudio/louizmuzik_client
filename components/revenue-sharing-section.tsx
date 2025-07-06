import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, DollarSign, Globe, PieChart } from 'lucide-react';

export function RevenueSharingSection() {
    return (
        <section className="w-full py-24 bg-gradient-to-br from-black via-black to-[#0f0f0f] relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-primary blur-3xl"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-8">
                <div className="bg-gradient-to-r from-[#0f0f0f]/90 to-black/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl">
                    {/* Top section with text and image side by side */}
                    <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                        {/* Left side - Text content */}
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                Download melodies from top producers and{' '}
                                <span className="text-primary">
                                    split sales
                                </span>{' '}
                                on digital beat stores
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Access exclusive melodies from top producers,
                                collaborate globally, and earn royalties on
                                digital music stores through our fair revenue
                                sharing model.
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-primary text-black hover:bg-primary/90 px-8 py-4 text-lg h-auto"
                                >
                                    <Link href="#pricing">
                                        Explore Melodies
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Right side - Image */}
                        <div className="md:w-1/2">
                            <div className="relative">
                                <Image
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/landing-03-pWHDnwhKv6cmPmfaokAiQ4FzdJgRpV.png"
                                    alt="MelodyCollab Top Producers Directory"
                                    width={600}
                                    height={500}
                                    className="rounded-lg shadow-lg border border-gray-800"
                                />
                                <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl -z-10 opacity-30"></div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom section with feature boxes in full width */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {/* Feature box 1 */}
                        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-primary/50 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-all">
                                <Download className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-base font-bold mb-1">
                                Instant Downloads
                            </h3>
                            <p className="text-gray-400 text-xs">
                                Get immediate access to thousands of
                                high-quality melodies
                            </p>
                        </div>

                        {/* Feature box 2 - UPDATED */}
                        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-primary/50 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-all">
                                <DollarSign className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-base font-bold mb-1">
                                Custom Split
                            </h3>
                            <p className="text-gray-400 text-xs">
                                Set your own collaboration percentage
                            </p>
                        </div>

                        {/* Feature box 3 */}
                        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-primary/50 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-all">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-base font-bold mb-1">
                                Global Network
                            </h3>
                            <p className="text-gray-400 text-xs">
                                Connect with producers from around the world
                            </p>
                        </div>

                        {/* Feature box 4 */}
                        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-primary/50 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-all">
                                <PieChart className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-base font-bold mb-1">
                                Collab with Top Producers
                            </h3>
                            <p className="text-gray-400 text-xs">
                                Connect and create with the best producers from
                                around the world.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
