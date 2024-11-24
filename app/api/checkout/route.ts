import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const priceId = searchParams.get('priceId');

    if (!priceId) {
        return NextResponse.json({ error: '缺少价格ID' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        return NextResponse.json({ error: '创建支付会话失败' }, { status: 500 });
    }
} 