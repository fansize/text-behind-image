'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Authenticate from '@/components/authenticate';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STRINGS = {
    plans: {
        free: {
            name: "Free",
            description: "Perfect for trying out our services",
            cta: "Get Started"
        },
        pro: {
            name: "Pro",
            description: "For professionals and growing teams",
            cta: "Subscribe"
        },
        enterprise: {
            name: "Enterprise",
            description: "For large organizations with custom needs",
            cta: "Contact Sales"
        }
    },
    billing: {
        perMonth: "/month",
        perYear: "/year"
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
        priceId: "price_free",
        features: ["Feature 1", "Feature 2", "Feature 3"]
    },
    {
        name: STRINGS.plans.pro.name,
        description: STRINGS.plans.pro.description,
        price: 12,
        priceId: "price_hobby_monthly"
    },
    {
        name: STRINGS.plans.enterprise.name,
        description: STRINGS.plans.enterprise.description,
        price: 32,
        priceId: "price_startup_monthly"
    }
];

export default function PricingCards() {
    const router = useRouter();
    const { user } = useUser();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleSubscribe = async (priceId: string) => {
        if (!user) {
            // 显示登录弹窗而不是跳转
            setShowAuthModal(true);
            return;
        }

        // 跳转到对应的Stripe支付页面
        router.push(`/api/checkout?priceId=${priceId}`);
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                {PRICE_PLANS.map((plan) => (
                    <Card key={plan.name} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-baseline text-3xl font-bold">
                                ${plan.price}
                                <span className="ml-1 text-sm font-normal text-muted-foreground">
                                    {STRINGS.billing.perMonth}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleSubscribe(plan.priceId)}
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