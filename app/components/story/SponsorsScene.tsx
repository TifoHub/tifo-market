'use client'
import React from 'react'
import { Instagram } from 'lucide-react'

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

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/tifo.mrkt/',
    icon: <Instagram size={20} />,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@tifo.mrkt',
    icon: <TikTokIcon className="w-5 h-5" />,
  },
]

const SponsorsScene = () => {
  return (
    <footer
      id="socials"
      className="relative bg-black text-white py-16 px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
        <div className="flex items-center gap-8">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-12 h-12 border border-white/30 flex items-center justify-center
                         font-barlow text-sm font-semibold text-white/60
                         transition-all duration-300
                         hover:border-[#D3AF37] hover:text-[#D3AF37] hover:shadow-[0_0_15px_rgba(211,175,55,0.25)]"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <p className="text-xs text-white/30 font-barlow tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Dallas Tifo Market
        </p>
        <p className="text-[10px] text-white/30 font-barlow tracking-widest uppercase">
          Website by:{' '}
          <a
            href="https://www.osworld.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400"
          >
            Os World
          </a>
        </p>
      </div>
    </footer>
  )
}

export default SponsorsScene
