'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type TokenResult = {
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_expires_in: number
  open_id?: string
}

function CallbackContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [tokens, setTokens] = useState<TokenResult | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (error) {
      setApiError(errorDescription || error)
      setStatus('error')
      return
    }
    if (!code) {
      setStatus('idle')
      return
    }
    setStatus('loading')
    fetch('/api/auth/tiktok/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Token exchange failed')
        setTokens(data)
        setStatus('success')
      })
      .catch((err) => {
        setApiError(err.message)
        setStatus('error')
      })
  }, [code, error, errorDescription])

  if (status === 'loading') {
    return (
      <Card className="max-w-xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>TikTok connection</CardTitle>
          <CardDescription>Exchanging code for access token…</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card className="max-w-xl mx-auto mt-12 border-destructive">
        <CardHeader>
          <CardTitle>TikTok connection failed</CardTitle>
          <CardDescription className="text-destructive">
            {apiError}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/api/auth/tiktok/authorize">Try again</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (status === 'success' && tokens) {
    return (
      <Card className="max-w-xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>Tokens received</CardTitle>
          <CardDescription>
            Add these to your .env file. Access token expires in ~24 hours;
            use the refresh token to get a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-1">
              TIKTOK_ACCESS_TOKEN
            </label>
            <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto break-all">
              {tokens.access_token}
            </pre>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-1">
              TIKTOK_REFRESH_TOKEN (optional, for refreshing)
            </label>
            <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto break-all">
              {tokens.refresh_token}
            </pre>
          </div>
          <Button asChild>
            <Link href="/api/auth/tiktok/authorize">Connect again</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-xl mx-auto mt-12">
      <CardHeader>
        <CardTitle>TikTok access token</CardTitle>
        <CardDescription>
          Start the flow to authorize your TikTok account and get an access
          token for the Display API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/api/auth/tiktok/authorize">Connect with TikTok</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function TikTokCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-8">
        <Suspense
          fallback={
            <Card className="max-w-xl mx-auto mt-12">
              <CardHeader>
                <CardTitle>TikTok connection</CardTitle>
                <CardDescription>Loading…</CardDescription>
              </CardHeader>
            </Card>
          }
        >
          <CallbackContent />
        </Suspense>
      </div>
    </div>
  )
}
