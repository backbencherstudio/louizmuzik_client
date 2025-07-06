import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DownloadSection() {
    return (
        <section className="w-full py-20 bg-black">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/landing-03-pWHDnwhKv6cmPmfaokAiQ4FzdJgRpV.png"
                            alt="MelodyCollab Top Producers Directory"
                            width={600}
                            height={500}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Download melodies from top producers and split sales
                            on digital beat stores.
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Access exclusive melodies from top producers,
                            collaborate globally, and earn royalties on digital
                            music stores through our fair revenue sharing model.
                        </p>
                        <Button
                            asChild
                            className="bg-primary text-black hover:bg-primary/90"
                        >
                            <Link href="#pricing">Get Started Today</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
