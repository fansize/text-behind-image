'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Authenticate from '@/components/authenticate';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStripe } from '@/lib/stripe/client';

const STRINGS = {
    plans: {
        free: {
            name: "Free",
            description: "For personal use",
            cta: "Get Started"
        },
        pro: {
            name: "Pro",
            description: "For professional use",
            cta: "Subscribe"
        }
    },
    billing: {
        perMonth: "/mo",
        perYear: "/yr",
        yearly: "Yearly",
        monthly: "Monthly"
    },
    auth: {
        signInRequired: "Sign in required"
    }
} as const;

const PRICE_PLANS = [
    {
        name: STRINGS.plans.free.name,
        description: STRINGS.plans.free.description,
        price: 0,
        priceId: 'free',
        features: ["Feature 1", "Feature 2", "Feature 3"]
    },
    {
        name: STRINGS.plans.pro.name,
        description: STRINGS.plans.pro.description,
        monthlyPrice: 12,
        yearlyPrice: 99,
        monthlyPriceId: 'price_1QOk9CAR1SVnrS2qPokODNi8',
        yearlyPriceId: 'price_1QOk9CAR1SVnrS2qdN9H2noW',
        features: ["Pro Feature 1", "Pro Feature 2", "Pro Feature 3"]
    }
];

export default function PricingCards() {
    const router = useRouter();
    const { user } = useUser();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

    // 处理订阅按钮点击事件
    const handleSubscribe = async (plan: typeof PRICE_PLANS[number]) => {
        // 如果是免费计划，直接跳转到应用页面
        if (plan.name === STRINGS.plans.free.name) {
            router.push('/app');
            return;
        }

        // 如果用户未登录，显示登录模态框
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        try {
            // 根据选择的计费周期（月付/年付）获取对应的价格ID
            const priceId = billingInterval === 'monthly' ? plan.monthlyPriceId : plan.yearlyPriceId;

            console.log('Submitting checkout with priceId:', priceId);

            // 调用后端API创建支付会话
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    email: user?.email
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Checkout failed');
            }

            const { sessionId } = await response.json();

            console.log('Got sessionId:', sessionId);

            const stripe = await getStripe();
            if (!stripe) {
                throw new Error('Stripe not initialized');
            }

            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    return (
        <>
            <div className="mb-8 flex justify-center">
                <div className="relative flex w-fit rounded-full bg-muted p-1">
                    <button
                        onClick={() => setBillingInterval('monthly')}
                        className={`relative px-4 py-2 text-sm transition-all ${billingInterval === 'monthly'
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground'
                            }`}
                    >
                        {STRINGS.billing.monthly}
                    </button>
                    <button
                        onClick={() => setBillingInterval('yearly')}
                        className={`relative px-4 py-2 text-sm transition-all ${billingInterval === 'yearly'
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground'
                            }`}
                    >
                        {STRINGS.billing.yearly}
                    </button>
                    <div
                        className={`absolute inset-y-1 w-1/2 rounded-full bg-primary transition-transform ${billingInterval === 'yearly' ? 'translate-x-full' : ''
                            }`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                {PRICE_PLANS.map((plan) => (
                    <Card key={plan.name} className="flex flex-col min-w-[300px]">
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-baseline text-3xl font-bold">
                                {plan.price !== undefined ? (
                                    <>
                                        ¥{plan.price}
                                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                                            {STRINGS.billing.perMonth}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        ¥{billingInterval === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                                            {billingInterval === 'monthly'
                                                ? STRINGS.billing.perMonth
                                                : STRINGS.billing.perYear}
                                        </span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleSubscribe(plan)}
                            >
                                {plan.name === STRINGS.plans.free.name
                                    ? STRINGS.plans.free.cta
                                    : STRINGS.plans.pro.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {showAuthModal && (
                <Authenticate
                    show={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </>
    );
} 