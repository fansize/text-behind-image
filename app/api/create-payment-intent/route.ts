import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",  // 使用最新的稳定版本
});

export async function POST(req: Request) {
    try {
        const { amount, currency } = await req.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "创建支付意向时出错" },
            { status: 500 }
        );
    }
}