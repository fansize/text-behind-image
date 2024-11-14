'use client';

import React from 'react';
import { HeroParallaxImages } from '@/components/hero-parallax-images';
import { HeroSection } from '@/components/hero-section';
import { FAQ } from '@/components/faq';
import Footer from '@/components/footer';

const page = () => {
    return (
        <div className='flex flex-col min-h-screen items-center w-full'>
            <HeroSection />
            <HeroParallaxImages />
            <FAQ />
            <Footer />
        </div>
    );
}

export default page;