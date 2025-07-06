import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Music, Users, Library, Award } from 'lucide-react';

export function CreateProfileCta() {
    return (
        <section className="w-full py-24 bg-gradient-to-br from-black via-black to-[#0f0f0f] relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-primary blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Desktop layout - side by side */}
                <div className="hidden lg:flex flex-row gap-12 items-center mb-16">
                    {/* Left side - Text content */}
                    <div className="w-1/2">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            Create your{' '}
                            <span className="text-primary">free profile</span>{' '}
                            and upload your melodies to collaborate with top
                            producers
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            By creating your profile, you can share your
                            melodies with top producers, and start exciting
                            collaborations.
                        </p>
                        <div className="flex flex-row gap-4 justify-start">
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary text-black hover:bg-primary/90 px-8 py-4 text-lg h-auto"
                            >
                                <Link href="#pricing">Create Free Profile</Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-primary text-white hover:bg-primary/10 px-8 py-4 text-lg h-auto"
                            >
                                <Link href="#pricing">Explore Producers</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right side - Profile Dashboard Image */}
                    <div className="w-1/2">
                        <div className="relative">
                            {/* Laptop frame */}
                            <div className="relative mx-auto w-full max-w-[600px]">
                                {/* Laptop top part (screen) */}
                                <div className="relative bg-[#0f0f0f] rounded-t-xl overflow-hidden pt-[5%] shadow-xl border border-gray-800">
                                    {/* Screen bezel */}
                                    <div className="mx-auto bg-[#0f0f0f] rounded-t-lg overflow-hidden border-t border-x border-gray-800">
                                        {/* Screen content */}
                                        <div className="relative pt-[56.25%]">
                                            {' '}
                                            {/* 16:9 aspect ratio */}
                                            <Image
                                                src="/profilev3.jpg"
                                                alt="MelodyCollab Profile Dashboard"
                                                fill
                                                className="absolute inset-0 object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Laptop bottom part (keyboard area) */}
                                <div className="relative h-[20px] bg-[#0f0f0f] rounded-b-lg border-b border-x border-gray-800">
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[4px] bg-gray-800 rounded-full"></div>
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl -z-10 opacity-30"></div>
                        </div>
                    </div>
                </div>

                {/* Mobile layout - stacked */}
                <div className="flex flex-col lg:hidden gap-8 mb-16">
                    {/* Text content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                            Create your{' '}
                            <span className="text-primary">free profile</span>{' '}
                            and upload your melodies to collaborate with top
                            producers
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            By creating your profile, you can share your
                            melodies with top producers, receive feedback, and
                            start exciting collaborations.
                        </p>
                        <div
                            className="flex flex-col gap-4 justify-center mx-auto"
                            style={{ width: '80%' }}
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary text-black hover:bg-primary/90 px-8 py-4 text-lg h-auto w-full"
                            >
                                <Link href="#pricing">Create Free Profile</Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-primary text-white hover:bg-primary/10 px-8 py-4 text-lg h-auto w-full"
                            >
                                <Link href="#pricing">Explore Producers</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Profile Dashboard Image - Below buttons on mobile */}
                    <div className="mt-8">
                        <div className="relative">
                            {/* Laptop frame */}
                            <div className="relative mx-auto w-full max-w-[500px]">
                                {/* Laptop top part (screen) */}
                                <div className="relative bg-[#0f0f0f] rounded-t-xl overflow-hidden pt-[5%] shadow-xl border border-gray-800">
                                    {/* Screen bezel */}
                                    <div className="mx-auto bg-[#0f0f0f] rounded-t-lg overflow-hidden border-t border-x border-gray-800">
                                        {/* Screen content */}
                                        <div className="relative pt-[56.25%]">
                                            {' '}
                                            {/* 16:9 aspect ratio */}
                                            <Image
                                                src="/profilev3.jpg"
                                                alt="MelodyCollab Profile Dashboard"
                                                fill
                                                className="absolute inset-0 object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Laptop bottom part (keyboard area) */}
                                <div className="relative h-[20px] bg-[#0f0f0f] rounded-b-lg border-b border-x border-gray-800">
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[4px] bg-gray-800 rounded-full"></div>
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl -z-10 opacity-30"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-black p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                            <Music className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Upload Melodies
                        </h3>
                        <p className="text-gray-400">
                            Share your best melodies with the community and get
                            discovered by top producers.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-black p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Connect with Producers
                        </h3>
                        <p className="text-gray-400">
                            Build your network with established producers and
                            collaborate on exciting projects.
                        </p>
                    </div>

                    {/* Feature 3 - UPDATED */}
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-black p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                            <Library className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Create Melody Catalog
                        </h3>
                        <p className="text-gray-400">
                            Build a portfolio of your melodies so other
                            producers can discover your work and collaborate
                            with you.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-black p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                            <Award className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Grow Your Career
                        </h3>
                        <p className="text-gray-400">
                            Turn collaborations into opportunities and advance
                            your music production career.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
