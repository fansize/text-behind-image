import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { createStripePortal } from '@/utils/stripe/server';
import {
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import NavBar from '@/components/nav';

// 添加 STRINGS 常量对象
const STRINGS = {
  TITLE: 'Account Settings',
  SUBTITLE: 'Manage your personal information and subscription settings',
  PERSONAL_INFO: {
    TITLE: 'Personal Information',
    DESCRIPTION: 'Update your personal profile information',
    EMAIL: {
      LABEL: 'Email',
      HINT: 'Email address cannot be changed'
    }
  },
  SUBSCRIPTION: {
    TITLE: 'Subscription',
    DESCRIPTION: 'Manage your subscription plan and payment method',
    CURRENT_PLAN: 'Current Plan',
    FREE_PLAN: 'Free',
    SUBSCRIBED: 'Pro',
    NEXT_BILLING: 'Next Billing Date',
    MANAGE: 'Manage Subscription',
    UPGRADE: 'Upgrade Plan'
  }
} as const;

export default async function Account() {
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  // 获取 Stripe Portal URL
  const portalUrl = subscription ? await createStripePortal('/account') : null;

  return (
    <div>
      <NavBar />

      <section className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">{STRINGS.TITLE}</h1>
          <p className="text-muted-foreground text-lg">
            {STRINGS.SUBTITLE}
          </p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{STRINGS.PERSONAL_INFO.TITLE}</CardTitle>
              <CardDescription>{STRINGS.PERSONAL_INFO.DESCRIPTION}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{STRINGS.PERSONAL_INFO.EMAIL.LABEL}</Label>
                <Input id="email" type="email" defaultValue={user.email} disabled />
                <p className="text-sm text-muted-foreground">
                  {STRINGS.PERSONAL_INFO.EMAIL.HINT}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{STRINGS.SUBSCRIPTION.TITLE}</CardTitle>
              <CardDescription>{STRINGS.SUBSCRIPTION.DESCRIPTION}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {STRINGS.SUBSCRIPTION.CURRENT_PLAN}: {subscription ? STRINGS.SUBSCRIPTION.SUBSCRIBED : STRINGS.SUBSCRIPTION.FREE_PLAN}
                  </p>
                  {subscription && (
                    <p className="text-sm text-muted-foreground">
                      {STRINGS.SUBSCRIPTION.NEXT_BILLING}: {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {subscription ? (
                // 已订阅用户显示管理订阅按钮，链接到 Stripe Portal
                <Link href={portalUrl ?? '#'} className="w-full">
                  <Button className="w-full mt-4">
                    {STRINGS.SUBSCRIPTION.MANAGE}
                  </Button>
                </Link>
              ) : (
                // 未订阅用户显示升级按钮，链接到定价页面
                <Link href="/pricing" className="w-full">
                  <Button className="w-full mt-4">
                    {STRINGS.SUBSCRIPTION.UPGRADE}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}