export type EventMedia =
  | { type: 'youtube'; videoId: string; title: string }
  | { type: 'image'; src: string; alt: string }

export type TifoEvent = {
  id: string
  title: string
  date: string
  badge: string
  description: string
  thanks?: string
  partner?: string
  media: EventMedia
}

export const events: TifoEvent[] = [
  {
    id: 'kera-world-cup',
    title: 'Interview with KERA: When the World Cup Comes to Texas',
    date: '06.16.2026',
    badge: 'Press',
    description:
      "Football means something different here in Texas — and something else entirely around the world. It's the jerseys, the hats, the giant banners we call tifos. We sat down with KERA for When the World Comes to Texas to talk about the kit swap we built, and the soccer culture already living here. Tom Boyce of London Calling and Crossbar Soccer and Beer joined the conversation too, bringing that energy from across the pond.",
    media: {
      type: 'youtube',
      videoId: 'A-9vfEMWIjI',
      title: 'Interview with KERA: When the World Cup Comes to Texas',
    },
  },
  {
    id: 'tifo-cup',
    title: 'First Ever Tifo Cup Tournament & Kit Swap',
    date: '02.28.2026',
    badge: 'Past Event',
    description:
      'Thanks to everyone who visited us this past weekend as we ventured out of the city for the first time!',
    thanks:
      'Special thanks to the team at @motionindoor for their hospitality & collaboration — the space was amazing 🙌',
    partner: 'Red Bull',
    media: {
      type: 'image',
      src: '/images/TourneyWinners.jpeg',
      alt: 'TIFO Cup Tournament Winners',
    },
  },
]
