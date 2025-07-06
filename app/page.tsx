import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { CreateProfileCta } from '@/components/create-profile-cta';
import { RevenueSharingSection } from '@/components/revenue-sharing-section';
import { MelodyDatabaseSection } from '@/components/melody-database-section';
import { MarketplaceAnalyticsSection } from '@/components/marketplace-analytics-section';
import { PricingSection } from '@/components/pricing-section';
import { Footer } from '@/components/footer';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-black text-white">
            <Header />
            <HeroSection />

            {/* Comentando las primeras 4 secciones viejas */}
            {/* 
      <ProfileSection />
      <MarketplaceSection />
      <DownloadSection />
      <SamplesSection />
      */}

            <CreateProfileCta />
            <RevenueSharingSection />
            <MelodyDatabaseSection />
            <MarketplaceAnalyticsSection />
            <PricingSection />
            <Footer />
        </main>
    );
}
