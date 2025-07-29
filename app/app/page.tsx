import EditorPage from './_components/editor-page';
import { createClient } from '@/utils/supabase/server';
import {
    getProducts,
    getSubscription,
    getUser
} from '@/utils/supabase/queries';
import NavBar from '@/components/nav';

export default async function Page() {
    const supabase = createClient();
    const [user, products, subscription] = await Promise.all([
        getUser(supabase),
        getProducts(supabase),
        getSubscription(supabase)
    ]);

    const isProActive = subscription?.status === 'active' &&
        subscription?.prices?.products?.name === 'Pro';

    return (
        <div>
            <NavBar />
            <EditorPage user={user} subscription={subscription} isProActive={isProActive} />
        </div>
    );
}
