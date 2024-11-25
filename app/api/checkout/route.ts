import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe/server';

export async function POST(request: Request) {
    try {
        const { priceId, userId, userEmail, stripeCustomerId } = await request.json();

        if (!userId || !userEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { session, customerId } = await createCheckoutSession({
            priceId,
            userId,
            userEmail,
            customerId: stripeCustomerId
        });

        // 检查 Stripe 返回的 customerId 是否与数据库中存储的不同
        if (customerId !== stripeCustomerId) {
            // 创建数据库连接
            const supabase = createClient();
            // 更新用户表中的 stripe_customer_id
            // 这确保我们始终使用最新的 Stripe customer ID
            await supabase
                .from('users')
                .update({ stripe_customer_id: customerId })
                .eq('id', userId);
        }

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
} 