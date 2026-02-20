'use client'
import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Instagram, ExternalLink } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

interface IGPost {
  id: string
  caption: string
  media_url: string
  permalink: string
  timestamp: string
}

interface TKVideo {
  id: string
  title: string
  cover_image_url: string
  share_url: string
  create_time: number
}

const SocialFeedScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const igRef = useRef<HTMLDivElement>(null)
  const tkRef = useRef<HTMLDivElement>(null)

  const [igPosts, setIgPosts] = useState<IGPost[]>([])
  const [tkVideos, setTkVideos] = useState<TKVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const [igRes, tkRes] = await Promise.allSettled([
          fetch('/api/social/instagram').then((r) => r.json()),
          fetch('/api/social/tiktok').then((r) => r.json()),
        ])

        if (igRes.status === 'fulfilled' && igRes.value.posts?.length) {
          setIgPosts(igRes.value.posts)
        }
        if (tkRes.status === 'fulfilled' && tkRes.value.videos?.length) {
          setTkVideos(tkRes.value.videos)
        }
      } catch {
        // Feeds are non-critical — fail silently
      } finally {
        setLoading(false)
      }
    }

    fetchFeeds()
  }, [])

  useEffect(() => {
    if (loading) return

    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const shared = {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse' as const,
        },
      }

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ...shared },
      )

      if (igRef.current) {
        gsap.fromTo(
          igRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ...shared },
        )
      }

      if (tkRef.current) {
        gsap.fromTo(
          tkRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ...shared },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading])

  const hasPosts = igPosts.length > 0 || tkVideos.length > 0
  const hidden = !loading && !hasPosts

  return (
    <section
      id="social-feed"
      ref={sectionRef}
      className={`relative bg-black text-white overflow-hidden transition-all duration-300 ${hidden ? 'h-0 py-0 px-0' : 'py-20 px-6'}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-14">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-redzone text-4xl md:text-5xl font-bold text-[#D3AF37] tracking-wider opacity-0"
        >
          ON THE FEED
        </h2>

        {loading && <SkeletonGrid />}

        {/* Instagram */}
        {igPosts.length > 0 && (
          <div ref={igRef} className="w-full opacity-0">
            <PlatformLabel
              icon={<Instagram size={18} />}
              name="Instagram"
              href="https://www.instagram.com/tifo.mrkt/"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {igPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden border border-white/10
                             transition-all duration-300
                             hover:border-[#D3AF37] hover:shadow-[0_0_20px_rgba(211,175,55,0.15)]"
                >
                  <img
                    src={post.media_url}
                    alt={post.caption || 'Instagram post'}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <ExternalLink
                      size={24}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* TikTok */}
        {tkVideos.length > 0 && (
          <div ref={tkRef} className="w-full opacity-0">
            <PlatformLabel
              icon={<TikTokIcon className="w-[18px] h-[18px]" />}
              name="TikTok"
              href="https://www.tiktok.com/@tifo.mrkt"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {tkVideos.map((video) => (
                <a
                  key={video.id}
                  href={video.share_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-9/16 overflow-hidden border border-white/10
                             transition-all duration-300
                             hover:border-[#D3AF37] hover:shadow-[0_0_20px_rgba(211,175,55,0.15)]"
                >
                  <img
                    src={video.cover_image_url}
                    alt={video.title || 'TikTok video'}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3">
                    <p className="text-white text-xs font-barlow line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {video.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function PlatformLabel({
  icon,
  name,
  href,
}: {
  icon: React.ReactNode
  name: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-white/50 font-barlow text-sm uppercase tracking-widest
                 transition-colors duration-300 hover:text-[#D3AF37]"
    >
      {icon}
      {name}
    </a>
  )
}

function SkeletonGrid() {
  return (
    <div className="w-full space-y-10">
      <div>
        <div className="h-4 w-28 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      </div>
      <div>
        <div className="h-4 w-24 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-9/16 bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SocialFeedScene
