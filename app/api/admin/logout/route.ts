import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Odhlášení bylo úspěšné' },
      { status: 200 }
    );

    // Clear the admin-session cookie
    response.cookies.delete('admin-session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Chyba při zpracování odhlášení' },
      { status: 500 }
    );
  }
}