'use client'
import Link from 'next/link'
import { useState } from 'react'

const PROMO_CONFIG = {
    storageKey: 'promoBannerVisible',
    content: {
        emoji: '🛍',
        emojiLabel: 'shopping cart',
        message: 'Help us keep building!',
        linkText: 'Shop Now',
        linkUrl: 'https://wrlmfy.com?utm_source=textbehindimage',
        closeAriaLabel: 'Close banner',
        closeIcon: '×'
    }
} as const

export default function PromoBanner() {
    const [isVisible, setIsVisible] = useState(true)

    const handleClose = () => {
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="bg-orange-600 text-white py-2 px-4 flex items-center justify-between text-sm">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mx-auto">

                <div className='flex items-center gap-2'>
                    <span role="img" aria-label={PROMO_CONFIG.content.emojiLabel}>
                        {PROMO_CONFIG.content.emoji}
                    </span>

                    <span>{PROMO_CONFIG.content.message}</span>
                </div>
                <Link
                    href={PROMO_CONFIG.content.linkUrl}
                    className="underline hover:text-gray-100 ml-1 font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-umami-event="promo-banner-shop-click"
                >
                    {PROMO_CONFIG.content.linkText}
                </Link>
            </div>

            <button
                onClick={handleClose}
                className="hover:text-gray-300 ml-4"
                aria-label={PROMO_CONFIG.content.closeAriaLabel}
                data-umami-event="promo-banner-close"
            >
                {PROMO_CONFIG.content.closeIcon}
            </button>
        </div>
    )
}