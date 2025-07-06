import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ProfileSection() {
    return (
        <section className="w-full py-20 bg-black">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                        <Image
                            src="/profilev2.jpg"
                            alt="MelodyCollab Producer Profile"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-lg"
                            priority
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Create your free profile and upload your melodies to
                            collaborate with top producers.
                        </h2>
                        <p className="text-gray-300 mb-6">
                            By creating your profile, you can share your
                            melodies with top producers and start exciting
                            collaborations.
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
