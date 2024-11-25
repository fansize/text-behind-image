import Pricing from './_components/pricing-pannel';
import { createClient } from '@/utils/supabase/server';
import {
    getProducts,
    getSubscription,
    getUser
} from '@/utils/supabase/queries';
import NavBar from '@/components/nav';

export default async function PricingPage() {
    const supabase = createClient();
    const [user, products, subscription] = await Promise.all([
        getUser(supabase),
        getProducts(supabase),
        getSubscription(supabase)
    ]);

    return (
        <div>
            <NavBar />

            <Pricing
                user={user}
                products={products ?? []}
                subscription={subscription}
            />
        </div>
    );
}
