import NavBar from '@/components/nav';
import Footer from '@/components/footer';
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
        <div className='min-h-screen flex flex-col'>
            <NavBar />
            
            <div className='flex-1'>
                <Pricing
                    user={user}
                    products={products ?? []}
                    subscription={subscription}
                />
            </div>
            
            <Footer />
        </div>
    );
}
