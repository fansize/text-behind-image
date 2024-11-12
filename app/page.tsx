'use client';

import React from 'react';
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { HeroImages } from '@/components/hero-images';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { HeroParallaxImages } from '@/components/hero-parallax-images';
import { AdditionalInfo } from '@/components/additional-info';
import { HeroSection } from '@/components/hero-section';
import { FAQ } from '@/components/faq';

const page = () => {
    return (
        <div className='flex flex-col min-h-screen items-center w-full'>
            <HeroSection />
            <HeroParallaxImages />
            <FAQ />
        </div>
    );
}

export default page;