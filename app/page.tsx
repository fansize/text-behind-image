'use client';

import React from 'react';
import { HeroParallaxImages } from '@/components/hero-parallax-images';
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