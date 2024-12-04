import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  console.log("Middleware triggered for:", pathname);
  console.log("Token:", token);

  // 静的ファイルや公開パスを認証対象外にする
  if (
    pathname.startsWith("/_next/") || // Next.jsのビルドファイル
    pathname.startsWith("/api/auth/") || // 認証API
    pathname === "/favicon.ico" || // ファビコン
    pathname === "/login" // ログインページ
  ) {
    return NextResponse.next();
  }

  // トークンがない場合、ログインページへリダイレクト
  if (!token) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    console.log("Redirecting to:", loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // トークンがあればリクエストを許可
  return NextResponse.next();
}
