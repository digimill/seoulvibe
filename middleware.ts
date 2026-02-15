import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { detectPreferredLanguage, isLang } from "@/lib/i18n";

const OLIVE_PATTERN = /^\/(?:(en|ko|ja|zh-cn|zh-tw|zh-hk)\/)?olive[-_]?young(?:[-_]?tourist[-_]?guide)?\/?$/i;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const match = pathname.match(OLIVE_PATTERN);
  if (!match) return NextResponse.next();

  const maybeLang = match[1];
  const lang =
    maybeLang && isLang(maybeLang)
      ? maybeLang
      : detectPreferredLanguage(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}/olive-young-tourist-guide`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/olive-young/:path*", "/oliveyoung/:path*", "/olive-young-tourist-guide/:path*", "/oliveyoung-tourist-guide/:path*", "/:lang/olive-young/:path*", "/:lang/oliveyoung/:path*", "/:lang/olive-young-tourist-guide/:path*", "/:lang/oliveyoung-tourist-guide/:path*"],
};

