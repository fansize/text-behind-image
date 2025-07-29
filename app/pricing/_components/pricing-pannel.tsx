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

export default function Pricing({ user, products, subscription }: Props) {
    const router = useRouter();
    const [priceIdLoading, setPriceIdLoading] = useState<string>();
    const currentPath = usePathname();

    // 只保留Pro产品的月付选项
    const proProduct = products.find(product => 
        product.name?.toLowerCase().includes('pro')
    );
    const monthlyProPrice = proProduct?.prices?.find(
        price => price.interval === 'month'
    );

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

    if (!proProduct || !monthlyProPrice) {
        return (
            <section className="px-6">
                <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
                    <p>Monthly Pro subscription plan not found.</p>
                </div>
            </section>
        );
    }

    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: monthlyProPrice.currency!,
        minimumFractionDigits: 0
    }).format((monthlyProPrice?.unit_amount || 0) / 100);

    return (
        <section className="px-6">
            <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
                <div className="sm:flex sm:flex-col sm:align-center">
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white text-center sm:text-5xl">
                        Pricing Plan
                    </h1>
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 text-center">
                        Support us
                    </p>
                </div>

                <div className="mt-8 flex justify-center sm:mt-10">
                    <div
                        className={cn(
                            'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-200 dark:divide-zinc-600 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
                            {
                                'border border-black': subscription
                                    ? proProduct.name === subscription?.prices?.products?.name
                                    : true
                            },
                            'max-w-sm w-full'
                        )}
                    >
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold leading-6 text-zinc-900 dark:text-white">
                                {proProduct.name}
                            </h2>
                            <p className="mt-4 text-zinc-600 dark:text-zinc-300">
                                {proProduct.description}
                            </p>
                            <p className="mt-8">
                                <span className="text-5xl font-extrabold text-zinc-900 dark:text-white">
                                    {priceString}
                                </span>
                                <span className="text-base font-medium text-zinc-500 dark:text-zinc-100 ml-2">
                                    /month
                                </span>
                            </p>
                            <Button
                                variant="slim"
                                type="button"
                                loading={priceIdLoading === monthlyProPrice.id}
                                onClick={() => {
                                    if (monthlyProPrice.unit_amount === 0) {
                                        router.push('/app');
                                    } else if (subscription) {
                                        router.push('/account');
                                    } else {
                                        handleStripeCheckout(monthlyProPrice);
                                    }
                                }}
                                className="block w-full py-2 mt-8 text-sm font-semibold text-center border border-black rounded-md hover:bg-zinc-900"
                            >
                                {monthlyProPrice.unit_amount === 0
                                    ? 'Start Now'
                                    : subscription
                                        ? 'Manage'
                                        : 'Subscribe'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
