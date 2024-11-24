"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment/success`,
                },
            });

            if (error) {
                setErrorMessage(error.message || "支付失败");
            }
        } catch (e) {
            console.error(e);
            setErrorMessage("支付过程中出现错误");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <PaymentElement />
            <Button
                type="submit"
                disabled={!stripe || !elements || isLoading}
                className="w-full"
            >
                {isLoading ? "处理中..." : "立即支付"}
            </Button>
            {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
        </form>
    );
}