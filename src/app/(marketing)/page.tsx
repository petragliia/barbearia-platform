'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Scissors, Star, Zap, Store, Crown, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import GreetingFeature from '@/components/features/GreetingFeature';
import Header from '@/components/marketing/Header';
import HeroSection from '@/components/marketing/HeroSection';
import TemplatesSection from '@/components/marketing/TemplatesSection';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import PricingSection from '@/components/marketing/PricingSection';
import FooterSection from '@/components/marketing/FooterSection';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
            <GreetingFeature />
            {/* 1. Header */}
            {/* 1. Header */}
            {/* 1. Header */}
            <Header />

            <main className="pt-0">
                {/* 2. Hero Section */}
                <HeroSection />

                {/* 3. Features Section (Benefit Cards) */}
                <FeaturesSection />

                {/* 4. Choose Your Style Section */}
                <TemplatesSection />

                <PricingSection />
            </main>

            {/* 4. Footer */}
            <FooterSection />
        </div>
    );
}
