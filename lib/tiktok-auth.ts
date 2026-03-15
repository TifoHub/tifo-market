/**
 * TikTok token refresh and in-memory cache.
 * Access token expires in ~24h; we refresh on 401 and cache so the site can keep fetching.
 */

let cached: {
  accessToken: string
  refreshToken: string
  expiresAt: number
} | null = null

const SKEW_SECONDS = 60 // refresh a bit before expiry

export async function refreshTikTokToken(): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
} | null> {
  const refreshToken =
    cached?.refreshToken ?? process.env.TIKTOK_REFRESH_TOKEN
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET

  if (!refreshToken || !clientKey || !clientSecret) {
    return null
  }

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('TikTok refresh error:', data)
    return null
  }

  const expiresAt = Date.now() + (data.expires_in - SKEW_SECONDS) * 1000
  cached = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresAt,
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresIn: data.expires_in,
  }
}

/** Get current access token (cached or env). Refreshes on 401 in the route. */
export function getTikTokAccessToken(): string | null {
  if (cached && cached.expiresAt > Date.now()) {
    return cached.accessToken
  }
  return process.env.TIKTOK_ACCESS_TOKEN ?? null
}

/** Call after a successful refresh so the route can use the new token. */
export function setTikTokTokensFromRefresh(result: {
  accessToken: string
  refreshToken: string
  expiresIn: number
}) {
  cached = {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt: Date.now() + (result.expiresIn - SKEW_SECONDS) * 1000,
  }
}
