'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function PricingSection() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: 'What do I get when I sign up for the free trial?',
            answer: 'You will have access to all the benefits of a Pro account for 7 days, allowing you to explore everything the platform has to offer and advance your career as a music producer.',
        },
        {
            question: 'Can I cancel whenever I want?',
            answer: 'Yes, you can cancel your Pro membership with Melody Collab at any time. Just keep in mind that you will lose all the benefits of being a Pro member.',
        },
        {
            question: 'How do I sell my sample pack on Melody Collab?',
            answer: 'You can upload your sample pack to the platform and sell it in the marketplace to earn money from your creations.',
        },
        {
            question: 'How do I receive my payments for selling sample packs?',
            answer: 'Payments are processed through PayPal on the platform.',
        },
        {
            question: 'Do I receive a license when I download a melody?',
            answer: 'Yes! Every time you download a melody from Melody Collab, a license agreement is automatically generated. This license outlines the collaboration terms, including the agreed percentage split and the ownership details. It protects both you and the original creator by clearly stating the conditions for using the melody in your projects.',
        },
        {
            question: 'How many melodies can I upload to collaborate?',
            answer: 'Free users can upload up to 5 melodies, while PRO producers enjoy unlimited uploads. The more melodies you upload, the more opportunities you create to collaborate and connect with other producers around the world!',
        },
    ];

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <section id="pricing" className="w-full py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black to-[#0f0f0f]">
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage: `radial-gradient(#0CCF9F 1px, transparent 1px)`,
                            backgroundSize: '20px 20px',
                        }}
                    ></div>
                </div>
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                        <span className="text-primary font-semibold">
                            Level Up Your Music
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Create your{' '}
                        <span className="text-primary">Free Account</span>{' '}
                        Today!
                    </h2>
                    <p className="text-xl text-gray-300">
                        Choose the plan that's right for you and start
                        collaborating with top producers worldwide.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="flex-1 bg-gradient-to-br from-[#0f0f0f] to-black rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(12,207,159,0.1)]">
                        <div className="p-2 h-full">
                            <div className="bg-black/50 rounded-xl p-8 h-full flex flex-col">
                                <div className="mb-6 pb-6 border-b border-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-bold">
                                            Free
                                        </h3>
                                        <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            STARTER
                                        </span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-extrabold">
                                            $0
                                        </span>
                                        <span className="text-gray-400 ml-1">
                                            /forever
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mt-3">
                                        Access your free account to take
                                        advantage of all the free features.
                                    </p>
                                </div>

                                <div className="flex-grow mb-8">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>
                                                Create Your Personal Profile
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>
                                                Download Melodies From Other
                                                Users
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>
                                                Access All Melodies Library
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>
                                                Upload 5 Melodies To Share
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>
                                                Collab With Other Producers
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-auto">
                                    <Button
                                        asChild
                                        className="w-full bg-white text-black hover:bg-gray-200 py-4 text-lg h-auto"
                                    >
                                        <Link href="/signup">
                                            Create Free Account
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex-1 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(12,207,159,0.2)]">
                        <div className="p-2 h-full">
                            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col relative">
                                <div className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                                    MOST POPULAR
                                </div>

                                <div className="mb-6 pb-6 border-b border-primary/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-bold">
                                            Pro
                                        </h3>
                                        <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                            PREMIUM
                                        </span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-extrabold">
                                            $9.99
                                        </span>
                                        <span className="text-gray-400 ml-1">
                                            /month
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mt-3">
                                        Get all premium access to the full app!
                                    </p>
                                </div>

                                <div className="flex-grow mb-8">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>Everything in Free +</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>
                                                Upload Unlimited Melodies
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>Sell Digital Products</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>Sell Sample Packs</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>
                                                Sell On Premium Marketplace
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span className="flex items-center gap-2">
                                                Producer Verified Badge
                                                <Image
                                                    src="/verified-badge.png"
                                                    alt="Verified Badge"
                                                    width={16}
                                                    height={16}
                                                />
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                                            <span>Pro Analytics Dashboard</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-auto">
                                    <Button
                                        asChild
                                        className="w-full bg-primary text-black hover:bg-primary/90 py-4 text-lg h-auto"
                                    >
                                        <Link href="/signup">Try Pro</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12 text-gray-400 max-w-2xl mx-auto">
                    <p>
                        All plans include access to our community of producers.
                        Upgrade or downgrade at any time. No contracts or hidden
                        fees.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="mt-32">
                    <div className="flex flex-col md:flex-row gap-12 md:gap-24 max-w-6xl mx-auto">
                        <div className="md:w-1/3">
                            <h2 className="text-4xl font-bold mb-4">
                                Frequently
                                <br />
                                Asked
                                <br />
                                Questions
                            </h2>
                        </div>
                        <div className="md:w-2/3">
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border-b border-zinc-800 last:border-b-0"
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                                        >
                                            <span
                                                className={`text-lg transition-colors duration-200 ${
                                                    expandedFaq === index
                                                        ? 'text-primary'
                                                        : 'text-white group-hover:text-primary'
                                                }`}
                                            >
                                                {faq.question}
                                            </span>
                                            <ChevronDown
                                                className={`h-5 w-5 text-primary transition-transform duration-200 ${
                                                    expandedFaq === index
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-200 ${
                                                expandedFaq === index
                                                    ? 'max-h-96 pb-6'
                                                    : 'max-h-0'
                                            }`}
                                        >
                                            <p className="text-zinc-400">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
