import Link from 'next/link';
import Image from 'next/image';
import { Instagram, X, Facebook } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full py-12 bg-black border-t border-gray-800">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-RtslSNx4eNvRAL0cKeP7U5KM4sNRt6.png"
                                alt="MelodyCollab Logo"
                                width={140}
                                height={40}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Connecting music producers worldwide. Share your
                            melodies, collaborate on tracks, and grow your
                            network with our innovative platform.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">Explore</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/login"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    Melodies
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    Genres
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#pricing"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">
                            Terms & Conditions
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/refund"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">
                            Follow Us On
                        </h3>
                        <div className="flex space-x-4">
                            <Link
                                href="https://instagram.com"
                                className="text-gray-400 hover:text-primary transition-colors"
                            >
                                <Instagram size={24} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href="https://facebook.com"
                                className="text-gray-400 hover:text-primary transition-colors"
                            >
                                <Facebook size={24} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} MelodyCollab. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
