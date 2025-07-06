import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SamplesSection() {
    return (
        <section className="w-full py-20 bg-black">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Access our Free melody samples database from top
                            producers all around the world.
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Explore the world's top melody sample database,
                            curated by leading producers. Filter by genre,
                            tempo, key signature, and collaborate instantly.
                        </p>
                        <Button
                            asChild
                            className="bg-primary text-black hover:bg-primary/90"
                        >
                            <Link href="#pricing">Get Started Today</Link>
                        </Button>
                    </div>
                    <div>
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/landing-04-buqg26xkmzvlVOqujWbbUDlpsdFTKR.png"
                            alt="MelodyCollab Melody Samples Database"
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
