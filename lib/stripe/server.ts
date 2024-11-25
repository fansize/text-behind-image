import { stripe } from './stripe';
import { absoluteUrl } from '@/lib/utils';

// 定义创建结账会话所需的参数接口
interface CreateCheckoutSessionOptions {
    priceId: string;      // Stripe 价格 ID
    userId: string;       // 用户 ID
    userEmail: string;    // 用户邮箱
    customerId?: string;  // 可选的 Stripe 客户 ID
}

export async function createCheckoutSession({
    priceId,
    userId,
    userEmail,
    customerId
}: CreateCheckoutSessionOptions) {
    try {
        // 处理 Stripe 客户 ID
        let finalCustomerId = customerId;
        if (!finalCustomerId) {
            // 如果没有现有的客户 ID，创建新的 Stripe 客户
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    supabaseUserId: userId  // 存储 Supabase 用户 ID 用于关联
                }
            });
            finalCustomerId = customer.id;
        }

        // 创建 Stripe Checkout 会话
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',                    // 设置为订阅模式
            payment_method_types: ['card'],         // 仅接受信用卡支付
            customer: finalCustomerId,              // 关联的客户 ID
            line_items: [
                {
                    price: priceId,                 // 商品价格 ID
                    quantity: 1,                    // 购买数量
                },
            ],
            // 支付成功后的跳转 URL，包含会话 ID
            success_url: absoluteUrl('/app?session_id={CHECKOUT_SESSION_ID}'),
            // 取消支付后的跳转 URL
            cancel_url: absoluteUrl('/pricing'),
            // 可选功能：
            // allow_promotion_codes: true,         // 启用促销码
            // billing_address_collection: 'required', // 要求填写账单地址
            metadata: {
                userId,                             // 存储用户 ID
                priceId                            // 存储价格 ID
            }
        });

        return { session: checkoutSession, customerId: finalCustomerId };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}

// 创建客户门户会话，用于管理订阅
export async function createPortalSession(customerId: string) {
    // 创建 Stripe 客户门户会话
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,                    // 客户 ID
        return_url: absoluteUrl('/account'),     // 退出门户后的返回 URL
    });

    return portalSession;
}