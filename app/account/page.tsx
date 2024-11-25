import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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

  return (
    <section className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">账户设置</h1>
        <p className="text-muted-foreground text-lg">
          管理您的个人信息和订阅设置
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>个人信息</CardTitle>
            <CardDescription>更新您的个人资料信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" defaultValue={userDetails?.full_name ?? ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">电子邮箱</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
              <p className="text-sm text-muted-foreground">
                邮箱地址不可更改
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>订阅信息</CardTitle>
            <CardDescription>管理您的订阅计划和支付方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  当前方案: {subscription ? '已订阅' : '免费版'}
                </p>
                {subscription && (
                  <p className="text-sm text-muted-foreground">
                    下次续费日期: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <Button className="w-full">
              {subscription ? '管理订阅' : '升级订阅'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}