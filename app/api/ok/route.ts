import { NextResponse } from 'next/server';

/**
 * Smoke test endpoint for deployment verification
 * Always returns 200 OK with {ok: true}
 */
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
