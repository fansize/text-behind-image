'use server';

import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@/utils/supabase/server';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import {
  getURL,
  getErrorRedirect,
  calculateTrialEndUnixTimestamp
} from '@/utils/helpers';
import { Tables } from '@/types_db';
import { createNewCustomer } from '@/utils/supabase/admin';

type Price = Tables<'prices'>;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: Price,
  redirectPath: string = '/account'
): Promise<CheckoutResponse> {
  try {
    // 从 Supabase 获取用户信息
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    // 如果获取用户信息失败，抛出错误
    if (error || !user) {
      console.error(error);
      throw new Error('Could not get user session.');
    }

    // 在 Stripe 中检索或创建客户
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });
    } catch (err) {
      console.error('First attempt to get customer failed:', err);

      // 如果第一次获取失败，尝试强制创建新的 customer
      try {
        // 在这里添加一个新的函数调用，强制创建新的 customer
        customer = await createNewCustomer({
          uuid: user?.id || '',
          email: user?.email || ''
        });
      } catch (retryErr) {
        console.error('Retry to create customer failed:', retryErr);
        throw new Error('Unable to access or create customer record.');
      }
    }

    // 设置 Stripe Checkout 会话的参数
    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      // billing_address_collection: 'required', // 可选：要求用户提供账单地址
      customer,
      customer_update: {
        address: 'auto' // 自动更新客户地址
      },
      line_items: [
        {
          price: price.id, // 价格 ID
          quantity: 1 // 数量
        }
      ],
      cancel_url: getURL(), // 取消支付时的重定向 URL
      success_url: getURL(redirectPath) // 支付成功后的重定向 URL
    };

    // 如果价格类型为“recurring”，设置订阅模式和试用期结束时间
    console.log(
      'Trial end:',
      calculateTrialEndUnixTimestamp(price.trial_period_days)
    );
    if (price.type === 'recurring') {
      params = {
        ...params,
        mode: 'subscription',
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
        }
      };
    } else if (price.type === 'one_time') {
      // 如果价格类型为“一次性”，设置支付模式
      params = {
        ...params,
        mode: 'payment'
      };
    }

    // 在 Stripe 中创建 Checkout 会话
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error('Unable to create checkout session.');
    }

    // 返回会话 ID 或错误重定向
    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error('Unable to create checkout session.');
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          'Please try again later or contact a system administrator.'
        )
      };
    } else {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      };
    }
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    // 从 Supabase 获取用户信息
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    // 如果获取用户信息失败，抛出错误
    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error('Could not get user session.');
    }

    // 在 Stripe 中检索或创建客户
    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    // 如果无法获取客户信息，抛出错误
    if (!customer) {
      throw new Error('Could not get customer.');
    }

    // 创建 Stripe 计费门户会话
    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account') // 返回的 URL
      });
      if (!url) {
        throw new Error('Could not create billing portal');
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.'
      );
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      );
    }
  }
}
