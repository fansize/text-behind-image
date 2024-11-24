"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeProvider({ children }: { children: React.ReactNode }) {
    const [clientSecret, setClientSecret] = useState<string>();

    useEffect(() => {
        // 组件加载时创建 PaymentIntent
        fetch("/api/webhooks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: 1000,
                currency: "usd",
            }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const options: any = {
        clientSecret,
        appearance: {
            theme: 'stripe',
        },
    };

    return clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    ) : (
        <div>加载中...</div>
    );
}