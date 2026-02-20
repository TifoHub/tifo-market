import { NextResponse } from 'next/server'

interface InstagramPost {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

interface CacheEntry {
  data: InstagramPost[]
  timestamp: number
}

let cache: CacheEntry | null = null
const CACHE_TTL = 60 * 60 * 1000

export async function GET() {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN
    if (!token) {
      const dummy = Array.from({ length: 4 }, (_, i) => ({
        id: `demo-${i}`,
        caption: `Tifo Market preview ${i + 1}`,
        media_url: `https://picsum.photos/seed/tifo-ig-${i}/600/600`,
        permalink: 'https://www.instagram.com/tifo.mrkt/',
        timestamp: new Date().toISOString(),
      }))
      return NextResponse.json({ posts: dummy })
    }

    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ posts: cache.data })
    }

    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}&limit=4`,
      { cache: 'no-store' },
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('Instagram API error:', res.status, text)
      return NextResponse.json({ posts: cache?.data ?? [] })
    }

    const json = await res.json()
    const posts: InstagramPost[] = (json.data ?? []).map(
      (post: InstagramPost) => ({
        id: post.id,
        caption: post.caption ?? '',
        media_type: post.media_type,
        media_url:
          post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp,
      }),
    )

    cache = { data: posts, timestamp: Date.now() }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Instagram fetch error:', error)
    return NextResponse.json({ posts: cache?.data ?? [] })
  }
}
