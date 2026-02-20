import { NextResponse } from 'next/server'

interface TikTokVideo {
  id: string
  title: string
  video_description: string
  cover_image_url: string
  share_url: string
  create_time: number
}

interface CacheEntry {
  data: TikTokVideo[]
  timestamp: number
}

let cache: CacheEntry | null = null
const CACHE_TTL = 60 * 60 * 1000

export async function GET() {
  try {
    const token = process.env.TIKTOK_ACCESS_TOKEN
    if (!token) {
      const dummy = Array.from({ length: 4 }, (_, i) => ({
        id: `demo-${i}`,
        title: `Tifo Market highlight ${i + 1}`,
        cover_image_url: `https://picsum.photos/seed/tifo-tk-${i}/400/710`,
        share_url: 'https://www.tiktok.com/@tifo.mrkt',
        create_time: Math.floor(Date.now() / 1000),
      }))
      return NextResponse.json({ videos: dummy })
    }

    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ videos: cache.data })
    }

    const res = await fetch(
      'https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,cover_image_url,share_url,create_time',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ max_count: 4 }),
        cache: 'no-store',
      },
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('TikTok API error:', res.status, text)
      return NextResponse.json({ videos: cache?.data ?? [] })
    }

    const json = await res.json()
    const videos: TikTokVideo[] = (json.data?.videos ?? []).map(
      (v: TikTokVideo) => ({
        id: v.id,
        title: v.title || v.video_description || '',
        cover_image_url: v.cover_image_url,
        share_url: v.share_url,
        create_time: v.create_time,
      }),
    )

    cache = { data: videos, timestamp: Date.now() }

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('TikTok fetch error:', error)
    return NextResponse.json({ videos: cache?.data ?? [] })
  }
}
