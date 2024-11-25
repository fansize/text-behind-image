import Pricing from './_components/pricing-pannel';
import { createClient } from '@/utils/supabase/server';
import {
    getProducts,
    getSubscription,
    getUser
} from '@/utils/supabase/queries';

export default async function PricingPage() {
    const supabase = createClient();
    const [user, products, subscription] = await Promise.all([
        getUser(supabase),
        getProducts(supabase),
        getSubscription(supabase)
    ]);

    return (
        <div>
            <div className="p-4 bg-gray-100">
                <div className="max-w-7xl mx-auto">
                    {user ? (
                        <div className="space-y-4">
                            <div>
                                <p>用户邮箱: {user.email}</p>
                                <p>用户ID: {user.id}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">产品信息:</h3>
                                {products && products.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {products.map((product) => (
                                            <li key={product.id}>
                                                {product.name} - {product.description}
                                                (价格: {product.unit_amount / 100} 元)
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>暂无产品信息</p>
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold">订阅信息:</h3>
                                {subscription ? (
                                    <div>
                                        <p>订阅状态: {subscription.status}</p>
                                        <p>订阅周期: {subscription.interval}</p>
                                        <p>下次付款时间: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                                    </div>
                                ) : (
                                    <p>暂无订阅</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>未登录</p>
                    )}
                </div>
            </div>

            <Pricing
                user={user}
                products={products ?? []}
                subscription={subscription}
            />
        </div>
    );
}
