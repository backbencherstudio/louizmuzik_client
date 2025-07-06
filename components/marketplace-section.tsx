import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MarketplaceSection() {
    return (
        <section className="w-full py-20 bg-black">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
                            Sell your sample packs in our marketplace and earn
                            money today!
                        </h2>
                        <p className="text-gray-300 mb-6 text-center md:text-left">
                            Unlock your earning potential in our dedicated
                            marketplace for music producers. Reach the right
                            audience and maximize your earnings!
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary text-black hover:bg-primary/90 px-8 py-4 text-lg h-auto"
                            >
                                <Link href="#pricing">Get Started Today</Link>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/landing-02-OrMjpypUhYuP2rCU0blZ8WHKdLH3e6.png"
                            alt="MelodyCollab Sample Packs Marketplace"
                            width={600}
                            height={500}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
