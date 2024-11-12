'use client';

import React from 'react';
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { HeroImages } from '@/components/hero-images';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { HeroParallaxImages } from '@/components/hero-parallax-images';
import { AdditionalInfo } from '@/components/additional-info';
import { HeroSection } from '@/components/hero-section';
import Link from 'next/link';

const page = () => {
    return (
        <div className='flex flex-col min-h-screen items-center w-full mt-20'>
            <HeroSection />



            <HeroImages />
            <HeroParallaxImages />




            {/* <div className='mt-2 mb-6'>
                <a href="https://www.producthunt.com/posts/text-behind-image?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-text&#0045;behind&#0045;image" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=494264&theme=light&period=daily" alt="Text&#0032;Behind&#0032;Image - Create&#0032;stunning&#0032;text&#0045;behind&#0045;image&#0032;designs&#0032;easily | Product Hunt" width="250" height="54" /></a>
            </div> */}
        </div>
    );
}

export default page;