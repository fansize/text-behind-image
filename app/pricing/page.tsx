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
        <Pricing
            user={user}
            products={products ?? []}
            subscription={subscription}
        />
    );
}
