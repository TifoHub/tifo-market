import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const redirectUri =
    process.env.TIKTOK_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/auth/tiktok/callback`

  if (!clientKey) {
    return NextResponse.json(
      { error: 'TIKTOK_CLIENT_KEY must be set in .env' },
      { status: 500 },
    )
  }

  const state = Math.random().toString(36).slice(2)
  const params = new URLSearchParams({
    client_key: clientKey,
    scope: 'user.info.basic,video.list',
    response_type: 'code',
    redirect_uri: redirectUri,
    state,
  })

  const url = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  return NextResponse.redirect(url)
}
