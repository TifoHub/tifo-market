import { NextRequest, NextResponse } from 'next/server'

const PKCE_COOKIE_NAME = 'tiktok_pkce_verifier'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid authorization code' },
        { status: 400 },
      )
    }

    const codeVerifier = request.cookies.get(PKCE_COOKIE_NAME)?.value
    if (!codeVerifier) {
      return NextResponse.json(
        { error: 'Missing code_verifier (PKCE). Try the Connect with TikTok flow again from the start.' },
        { status: 400 },
      )
    }

    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET
    const redirectUri =
      process.env.TIKTOK_REDIRECT_URI ||
      `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/auth/tiktok/callback`

    if (!clientKey || !clientSecret) {
      return NextResponse.json(
        { error: 'TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET must be set in .env' },
        { status: 500 },
      )
    }

    const body = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    })

    const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('TikTok token error:', data)
      return NextResponse.json(
        {
          error: data.error_description || data.error || 'Token exchange failed',
          details: data,
        },
        { status: res.status },
      )
    }

    const response = NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      refresh_expires_in: data.refresh_expires_in,
      open_id: data.open_id,
    })
    // Clear PKCE cookie after successful exchange
    response.cookies.set(PKCE_COOKIE_NAME, '', { maxAge: 0, path: '/' })
    return response
  } catch (error) {
    console.error('TikTok token exchange error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
