import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    // 获取原始请求体，用于验证签名
    const body = await req.text();
    // 获取 Stripe 签名
    const signature = headers().get('stripe-signature') as string;
    const supabase = createClient();

    let event: Stripe.Event;

    // 验证 webhook 请求的真实性
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    try {
        // 根据不同的事件类型处理业务逻辑
        switch (event.type) {
            case 'checkout.session.completed': {
                // 支付成功完成
                const session = event.data.object as Stripe.Checkout.Session;

                // 更新用户的订阅状态
                const { error } = await supabase
                    .from('users')
                    .update({
                        stripe_customer_id: session.customer as string,
                        subscription_status: 'active',
                        subscription_price_id: session.metadata?.priceId,
                        // 记录更新时间
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', session.metadata?.userId);

                if (error) throw error;

                // 可以在这里添加其他逻辑，如：
                // - 发送欢迎邮件
                // - 记录支付日志
                // - 触发其他业务流程
                break;
            }

            case 'customer.subscription.updated': {
                // 订阅更新（如升级、降级、支付方式变更等）
                const subscription = event.data.object as Stripe.Subscription;

                // 获取最新的价格信息
                const priceId = subscription.items.data[0].price.id;

                // 更新订阅状态
                const { error } = await supabase
                    .from('users')
                    .update({
                        subscription_status: subscription.status,
                        subscription_price_id: priceId,
                        subscription_end_date: new Date(subscription.current_period_end * 1000),
                        updated_at: new Date().toISOString()
                    })
                    .eq('stripe_customer_id', subscription.customer as string);

                if (error) throw error;
                break;
            }

            case 'customer.subscription.deleted': {
                // 订阅被取消
                const subscription = event.data.object as Stripe.Subscription;

                // 更新用户状态为已取消
                const { error } = await supabase
                    .from('users')
                    .update({
                        subscription_status: 'canceled',
                        subscription_end_date: new Date(subscription.current_period_end * 1000),
                        updated_at: new Date().toISOString()
                    })
                    .eq('stripe_customer_id', subscription.customer as string);

                if (error) throw error;
                break;
            }

            default: {
                // 记录未处理的事件类型
                console.log(`Unhandled event type: ${event.type}`);
            }
        }

        // 返回 200 表示成功处理
        return new Response(null, { status: 200 });
    } catch (error) {
        // 记录错误并返回 500，Stripe 会重试该 webhook
        console.error('Webhook handler failed:', error);
        return new Response('Webhook handler failed', { status: 500 });
    }
}

// 禁用 Next.js 的默认 body 解析
// 因为我们需要原始请求体来验证 webhook 签名
export const config = {
    api: {
        bodyParser: false,
    },
};