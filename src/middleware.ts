import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "pdc_authenticated";
const PUBLIC_PATHS = ["/login", "/registro", "/verificar-email", "/esqueci-senha", "/redefinir-senha"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (pathname.startsWith("/flags/")) {
    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublic && pathname !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/estudar";
    return NextResponse.redirect(url);
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = isAuthenticated ? "/estudar" : "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
