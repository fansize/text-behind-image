This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Stripe Workflow

sequenceDiagram
Client->>Server: 1. 请求创建支付
Server->>Stripe API: 2. 创建 PaymentIntent
Stripe API->>Server: 3. 返回 clientSecret
Server->>Client: 4. 发送 clientSecret
Client->>Stripe.js: 5. 使用 clientSecret 确认支付
