import { createClient } from '@/utils/supabase/server';
import {
    getProducts,
    getSubscription,
    getUser
} from '@/utils/supabase/queries';
import NavBarClient from './nav-bar';

export default async function NavBar() {
    const supabase = createClient();
    const [user, products, subscription] = await Promise.all([
        getUser(supabase),
        getProducts(supabase),
        getSubscription(supabase)
    ]);

    return (
        <NavBarClient
            user={user}
            products={products}
            subscription={subscription}
        />
    );
}