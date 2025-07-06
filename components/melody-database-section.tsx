import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function MelodyDatabaseSection() {
    return (
        <section className="w-full py-24 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    {/* Animated circles */}
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-primary/20 blur-xl"
                            style={{
                                width: `${Math.random() * 300 + 100}px`,
                                height: `${Math.random() * 300 + 100}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.5 + 0.1,
                                animation: `float ${
                                    Math.random() * 10 + 20
                                }s infinite linear`,
                                animationDelay: `${Math.random() * 10}s`,
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                        <span className="text-primary font-semibold">
                            Free Access
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        Access our{' '}
                        <span className="text-primary">
                            Free melody samples
                        </span>{' '}
                        database from top producers all around the world
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Explore the world's top melody sample database, curated
                        by leading producers. Filter by genre, tempo, key
                        signature, and collaborate instantly.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-primary text-black hover:bg-primary/90 px-8 py-4 text-lg h-auto"
                    >
                        <Link href="#pricing">Explore Database</Link>
                    </Button>
                </div>

                {/* Image of the melody database */}
                <div className="relative max-w-4xl mx-auto">
                    <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/landing-04-buqg26xkmzvlVOqujWbbUDlpsdFTKR.png"
                        alt="MelodyCollab Melody Samples Database"
                        width={1200}
                        height={800}
                        className="rounded-xl shadow-2xl border border-gray-800"
                    />

                    {/* Glow effect */}
                    <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-xl -z-10 opacity-50"></div>
                </div>
            </div>
        </section>
    );
}
