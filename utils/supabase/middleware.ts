import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 定义一个异步函数 updateSession，用于更新用户会话
export async function updateSession(request: NextRequest) {
  // 初始化 supabaseResponse 为一个新的 NextResponse 对象
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 创建 Supabase 客户端实例
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Supabase 匿名密钥
    {
      cookies: {
        // 获取所有 cookies
        getAll() {
          return request.cookies.getAll()
        },
        // 设置所有 cookies
        setAll(cookiesToSet) {
          // 遍历每个 cookie 并设置
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          // 更新 supabaseResponse 对象
          supabaseResponse = NextResponse.next({
            request,
          })
          // 将 cookies 设置到 supabaseResponse 中
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 从 Supabase 获取当前用户信息
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // 克隆请求的 URL
  const url = request.nextUrl.clone()

  // 如果请求路径以 '/webhook' 开头，直接返回 supabaseResponse
  if (request.nextUrl.pathname.startsWith('/webhook')) {
    return supabaseResponse
  }

  // 如果用户未登录且请求路径不在特定路径中，重定向到登录页面
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/forgot-password') &&
    !request.nextUrl.pathname.startsWith('/pricing') &&
    !request.nextUrl.pathname.startsWith('/app') &&
    !(request.nextUrl.pathname === '/app')
  ) {
    url.pathname = '/login' // 设置重定向路径为 '/login'
    return NextResponse.redirect(url) // 返回重定向响应
  }

  // 如果用户已登录且请求路径为根路径，重定向到仪表板
  // if (user && request.nextUrl.pathname === '/') {
  //     url.pathname = '/' // 设置重定向路径为 '/'
  //     return NextResponse.redirect(url) // 返回重定向响应
  // }

  // 返回 supabaseResponse 对象
  return supabaseResponse
}