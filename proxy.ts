import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-context";

const publicPaths = new Set(["/", "/sign-in", "/sign-up"]);

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const session = await getSession(request.headers);
  const isPublicPath = publicPaths.has(request.nextUrl.pathname);

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/items", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
