'use client';

import Button from './Button';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
    prices: Price[];
}
interface PriceWithProduct extends Price {
    products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
    prices: PriceWithProduct | null;
}

interface Props {
    user: User | null | undefined;
    products: ProductWithPrices[];
    subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
    const intervals = Array.from(
        new Set(
            products.flatMap((product) =>
                product?.prices?.map((price) => price?.interval)
            )
        )
    );
    const router = useRouter();
    const [billingInterval, setBillingInterval] =
        useState<BillingInterval>('month');
    const [priceIdLoading, setPriceIdLoading] = useState<string>();
    const currentPath = usePathname();

    const handleStripeCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);

        if (!user) {
            setPriceIdLoading(undefined);
            return router.push('/signin/signup');
        }

        const { errorRedirect, sessionId } = await checkoutWithStripe(
            price,
            currentPath
        );

        if (errorRedirect) {
            setPriceIdLoading(undefined);
            return router.push(errorRedirect);
        }

        if (!sessionId) {
            setPriceIdLoading(undefined);
            return router.push(
                getErrorRedirect(
                    currentPath,
                    'An unknown error occurred.',
                    'Please try again later or contact a system administrator.'
                )
            );
        }

        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });

        setPriceIdLoading(undefined);
    };

    if (!products.length) {
        return (
            <section className="px-6">
                <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
                    <p>No subscription pricing plans found.</p>
                </div>
            </section>
        );
    } else {
        return (
            <section className="px-6">
                <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:flex-col sm:align-center">
                        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white text-center sm:text-5xl">
                            Pricing Plans
                        </h1>
                        <div className="relative self-center mt-12 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-200 dark:border-zinc-800">
                            {intervals.includes('month') && (
                                <button
                                    onClick={() => setBillingInterval('month')}
                                    type="button"
                                    className={`${billingInterval === 'month'
                                        ? 'relative w-1/2 bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-white'
                                        : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-500 dark:text-zinc-400'
                                        } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap sm:w-auto sm:px-8`}
                                >
                                    Monthly
                                </button>
                            )}
                            {intervals.includes('year') && (
                                <button
                                    onClick={() => setBillingInterval('year')}
                                    type="button"
                                    className={`${billingInterval === 'year'
                                        ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                                        : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                                        } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap  sm:w-auto sm:px-8`}
                                >
                                    Yearly
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 space-y-0 sm:mt-10 flex flex-wrap justify-center gap-8 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                        {products.map((product) => {
                            const price = product?.prices?.find(
                                (price) => price.interval === billingInterval
                            );
                            if (!price) return null;
                            const priceString = new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: price.currency!,
                                minimumFractionDigits: 0
                            }).format((price?.unit_amount || 0) / 100);
                            return (
                                <div
                                    key={product.id}
                                    className={cn(
                                        'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-200 dark:divide-zinc-600 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
                                        {
                                            'border border-black': subscription
                                                ? product.name === subscription?.prices?.products?.name
                                                : product.name === 'Freelancer'
                                        },
                                        'flex-1', // This makes the flex item grow to fill the space
                                        'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
                                        'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
                                    )}
                                >
                                    <div className="p-6">
                                        <h2 className="text-2xl font-semibold leading-6 text-zinc-900 dark:text-white">
                                            {product.name}
                                        </h2>
                                        <p className="mt-4 text-zinc-600 dark:text-zinc-300">{product.description}</p>
                                        <p className="mt-8">
                                            <span className="text-5xl font-extrabold text-zinc-900 dark:text-white">
                                                {priceString}
                                            </span>
                                            <span className="text-base font-medium text-zinc-500 dark:text-zinc-100 ml-2">
                                                /{billingInterval}
                                            </span>
                                        </p>
                                        <Button
                                            variant="slim"
                                            type="button"
                                            // disabled
                                            loading={priceIdLoading === price.id}
                                            onClick={() => {
                                                if (price.unit_amount === 0) {
                                                    router.push('/app');
                                                } else if (subscription) {
                                                    router.push('/account');
                                                } else {
                                                    handleStripeCheckout(price);
                                                }
                                            }}
                                            className="block w-full py-2 mt-8 text-sm font-semibold text-center border border-black rounded-md hover:bg-zinc-900"
                                        >
                                            {price.unit_amount === 0
                                                ? 'Start Now'
                                                : subscription
                                                    ? 'Manage'
                                                    : 'Subscribe'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}
