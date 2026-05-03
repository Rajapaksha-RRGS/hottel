import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  // 1. Header එකෙන් Token එක ලබා ගැනීම
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // "Bearer TOKEN_HERE" -> "TOKEN_HERE"

  // 2. පොදු Path (Public Routes) සඳහා Middleware එක අවශ්‍ය නැතිනම්:
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api/staff")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }
   if (request.nextUrl.pathname.startsWith("/api/rooms")) {
    return NextResponse.next();
  }
  if (!token) {
    // 3. Token එකක් නැතිනම් Error එකක් යැවීම
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 },
    );
  }

  try {
    // 4. Secret Key එක Encode කිරීම (jose සඳහා මෙය අනිවාර්යයි)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // 5. Token එක පරීක්ෂා කිරීම (Verify)
    const { payload } = await jwtVerify(token, secret);

    // 6. User ගේ දත්ත ඊළඟ API එකට යැවීම සඳහා Headers සකස් කිරීම
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', payload.id as string);
    requestHeaders.set('user-role', payload.role as string);

    // සාර්ථක නම් ඊළඟ පියවරට (API/Page) යන්න
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    // Token එක වැරදි නම් හෝ කල් ඉකුත් වී නම් (Expired)
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }
}

// 7. මෙම Middleware එක ක්‍රියාත්මක විය යුතු Path තෝරන්න
export const config = {
  matcher: ["/api/staff/:path*", "/api/admin/:path*", "/api/rooms/:path*"],
};