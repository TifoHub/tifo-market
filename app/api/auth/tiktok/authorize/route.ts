import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'node:crypto'

const PKCE_COOKIE_NAME = 'tiktok_pkce_verifier'
const PKCE_COOKIE_MAX_AGE = 600 // 10 min

function generateCodeVerifier(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const bytes = randomBytes(64)
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

function generateCodeChallenge(verifier: string): string {
  const digest = createHash('sha256').update(verifier, 'utf8').digest()
  return digest
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

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

  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)
  const state = Math.random().toString(36).slice(2)

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: 'user.info.basic,video.list',
    response_type: 'code',
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  const url = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  const res = NextResponse.redirect(url)
  res.cookies.set(PKCE_COOKIE_NAME, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: PKCE_COOKIE_MAX_AGE,
    path: '/',
  })
  return res
}
