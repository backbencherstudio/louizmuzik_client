'use client';

import { Header } from '@/components/header';

export default function TermsPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-8 text-zinc-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                1. Terms and Conditions of Use
                            </h2>
                            <p className="mb-4">
                                By accessing this website, you agree to be bound
                                by these Website Terms and Conditions of Use,
                                all applicable laws and regulations, and agree
                                that you are responsible for compliance with any
                                applicable local laws. If you do not agree with
                                any of these terms, you are prohibited from
                                using or accessing this site. The materials
                                contained on this website are protected by
                                copyright and trademark law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                2. License of Use
                            </h2>
                            <p className="mb-4">
                                Permission is granted to temporarily download
                                one copy of the materials (information or
                                software) on Melody Collab's website for
                                personal, non-commercial transitory viewing
                                only. This is the grant of a license, not a
                                transfer of title, and under this license, you
                                may not:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Modify or copy the materials;</li>
                                <li>
                                    Use the materials for any commercial
                                    purpose, or for any public display
                                    (commercial or non-commercial);
                                </li>
                                <li>
                                    Attempt to decompile or reverse engineer any
                                    software contained on Melody Collab's
                                    website;
                                </li>
                                <li>
                                    Remove any copyright or other proprietary
                                    notations from the materials;
                                </li>
                                <li>
                                    Transfer the materials to another person or
                                    "mirror" the materials on any other server.
                                </li>
                            </ul>
                            <p className="mb-4">
                                This license shall automatically terminate if
                                you violate any of these restrictions and may be
                                terminated by Melody Collab at any time. Upon
                                terminating your viewing of these materials or
                                upon the termination of this license, you must
                                destroy any downloaded materials in your
                                possession whether in electronic or printed
                                format.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                3. Disclaimer
                            </h2>
                            <p className="mb-4">
                                The materials on Melody Collab's website are
                                provided "as is". Melody Collab makes no
                                warranties, expressed or implied, and hereby
                                disclaims and negates all other warranties,
                                including without limitation, implied warranties
                                or conditions of merchantability, fitness for a
                                particular purpose, or non-infringement of
                                intellectual property or other violations of
                                rights. Furthermore, Melody Collab does not
                                warrant or make any representations concerning
                                the accuracy, likely results, or reliability of
                                the use of the materials on its website or
                                otherwise relating to such materials or on any
                                sites linked to this site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                4. Limitations
                            </h2>
                            <p className="mb-4">
                                In no event shall Melody Collab or its suppliers
                                be liable for any damages (including, without
                                limitation, damages for loss of data or profit,
                                or due to business interruption) arising out of
                                the use or inability to use the materials on
                                Melody Collab's website, even if Melody Collab
                                or an authorized representative of Melody Collab
                                has been notified orally or in writing of the
                                possibility of such damage. Because some
                                jurisdictions do not allow limitations on
                                implied warranties, or limitations of liability
                                for consequential or incidental damages, these
                                limitations may not apply to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                5. Revisions and Errata
                            </h2>
                            <p className="mb-4">
                                The materials appearing on Melody Collab's
                                website could include technical, typographical,
                                or photographic errors. Melody Collab does not
                                warrant that any of the materials on its website
                                are accurate, complete, or current. Melody
                                Collab may make changes to the materials
                                contained on its website at any time without
                                notice. However, Melody Collab does not make any
                                commitment to update the materials.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                6. Links
                            </h2>
                            <p className="mb-4">
                                Melody Collab has not reviewed all of the sites
                                linked to its website and is not responsible for
                                the contents of any such linked site. The
                                inclusion of any link does not imply endorsement
                                by Melody Collab of the site. Use of any such
                                linked website is at the user's own risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                7. Terms of Use Modifications
                            </h2>
                            <p className="mb-4">
                                Melody Collab may revise these terms of use for
                                its website at any time without notice. By using
                                this website you are agreeing to be bound by the
                                then-current version of these Terms and
                                Conditions of Use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                8. Governing Law
                            </h2>
                            <p className="mb-4">
                                Any claim related to the Melody Collab website
                                shall be governed by the laws of the State of
                                Puerto Rico, without regard to its conflict of
                                law provisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                9. Privacy Policy
                            </h2>
                            <p className="mb-4">
                                Your privacy is very important to us.
                                Accordingly, we have developed this Policy so
                                that you can understand how we collect, use,
                                communicate, disclose, and make use of personal
                                information.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Before or at the time of collecting personal
                                    information, we will identify the purposes
                                    for which the information is being
                                    collected.
                                </li>
                                <li>
                                    We will collect and use personal information
                                    solely for the purposes specified by us and
                                    for other compatible purposes, unless we
                                    obtain the consent of the individual
                                    concerned or as required by law.
                                </li>
                                <li>
                                    Personal data will only be retained for as
                                    long as necessary to fulfill those purposes.
                                </li>
                                <li>
                                    We collect personal information by
                                    legitimate and fair means, and, where
                                    appropriate, with the knowledge or consent
                                    of the affected individual.
                                </li>
                                <li>
                                    Personal data must be relevant to the
                                    purposes for which it is to be used, and, to
                                    the extent necessary for those purposes,
                                    must be accurate, complete, and up-to-date.
                                </li>
                                <li>
                                    We will protect personal information with
                                    reasonable security safeguards against loss
                                    or theft, as well as unauthorized access,
                                    disclosure, copying, use, or modification.
                                </li>
                                <li>
                                    We will make available to customers
                                    information about our policies and practices
                                    related to the management of personal
                                    information.
                                </li>
                            </ul>
                            <p className="mt-4">
                                We are committed to conducting our business in
                                accordance with these principles in order to
                                ensure that the confidentiality of personal
                                information is protected and maintained.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
