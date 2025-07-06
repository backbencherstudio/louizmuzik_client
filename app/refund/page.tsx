'use client';

import { Header } from '@/components/header';

export default function RefundPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Refund Policy
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Effective Date: October 10, 2024
                        </p>
                    </div>

                    <div className="space-y-8 text-zinc-300">
                        <section>
                            <p className="mb-4">
                                Welcome to Melody Collab. This refund policy is
                                part of our Terms and Conditions and aims to
                                provide clarity regarding payments,
                                subscriptions, and our refund policy. By
                                subscribing to and using Melody Collab, you
                                agree to comply with this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                1. Nature of the Service
                            </h2>
                            <p className="mb-4">
                                Melody Collab is a 100% digital platform that
                                offers music producers the following benefits
                                through a monthly subscription:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>
                                    Access to purchase and download Sample
                                    Packs.
                                </li>
                                <li>
                                    The ability to upload unlimited melodies to
                                    collaborate with other producers and
                                    artists.
                                </li>
                                <li>
                                    Access to our marketplace to sell your
                                    musical creations.
                                </li>
                                <li>
                                    Access to the account statistics dashboard
                                    to manage and analyze your account
                                    performance.
                                </li>
                            </ul>
                            <p className="mb-4">
                                Once subscribed, you gain immediate and
                                continuous access to all of these services and
                                tools as long as your subscription remains
                                active.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                2. No Refund Policy
                            </h2>
                            <p className="mb-4">
                                Since Melody Collab provides a digital service
                                with immediate access to its functionalities and
                                resources, we do not offer refunds for payments
                                made. This includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>
                                    Monthly, quarterly, or annual subscription
                                    payments.
                                </li>
                                <li>
                                    Automatic payments charged through your
                                    registered payment method.
                                </li>
                                <li>
                                    Payments for additional features or upgrades
                                    within the platform.
                                </li>
                            </ul>
                            <p className="mb-4">
                                All subscription fees are non-refundable. By
                                completing a transaction with Melody Collab, you
                                acknowledge and agree that payments cannot be
                                refunded under any circumstances.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                3. Subscription Cancellation
                            </h2>
                            <p className="mb-4">
                                You may cancel your subscription at any time
                                from your account in Melody Collab. Cancellation
                                will take effect at the end of the current
                                billing period. No refunds or credits will be
                                issued for any unused time on an already-paid
                                subscription. After cancellation, you will
                                continue to have access to the service until the
                                end of your billing cycle.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                4. Automatic Renewal
                            </h2>
                            <p className="mb-4">
                                Subscriptions to Melody Collab automatically
                                renew at the end of each billing cycle. By
                                subscribing, you authorize Melody Collab to
                                automatically charge your registered payment
                                method for the applicable subscription fees. You
                                can disable automatic renewal by canceling your
                                subscription before the renewal date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                5. Exceptions
                            </h2>
                            <p className="mb-4">
                                In exceptional cases, such as billing errors
                                attributable to Melody Collab or significant
                                technical issues that prevent access to the
                                service for an extended period, we may review
                                specific requests to assess whether an exception
                                to this policy is warranted. Any such evaluation
                                will be at our sole discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                6. Contact
                            </h2>
                            <p className="mb-4">
                                If you have additional questions or encounter
                                any issues related to the service, you can
                                contact us via info@melodycollab.com. While we
                                do not offer refunds, we are committed to
                                providing support and assistance to ensure that
                                your experience with Melody Collab is as
                                satisfactory as possible.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Final Clause
                            </h2>
                            <p className="mb-4">
                                By subscribing to Melody Collab, you explicitly
                                agree to this refund policy and our subscription
                                terms. Melody Collab reserves the right to
                                modify this policy at any time. Any changes will
                                be communicated promptly through our website
                                and/or by email to our users.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
