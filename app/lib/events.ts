export type EventMedia =
  | { type: 'youtube'; videoId: string; title: string }
  | { type: 'image'; src: string; alt: string; width: number; height: number }
  | { type: 'placeholder' }

export type TifoEvent = {
  id: string
  title: string
  date?: string
  badge: string
  description: string
  thanks?: string
  partner?: string
  media: EventMedia
}

export const events: TifoEvent[] = [
  {
    id: 'tifo-retas-city-futsal',
    title: 'TIFO RETAS',
    badge: 'Event',
    description:
      'Starting in September, TIFO Market is teaming up with City Futsal to host TIFO RETAS twice a month in collaboration with City Futsal. This co-ed pickup is open to all skill levels, with two fields running throughout the night. Come out and ball, connect with the community, and show us who runs Dallas Fútbol. Make sure to register with the link in our bio on Instagram or TikTok bio.',
    partner: 'City Futsal',
    media: {
      type: 'image',
      src: '/events/TIFO-retas.png',
      alt: 'TIFO RETAS at City Futsal',
      width: 1080,
      height: 1350,
    },
  },
  {
    id: 'nike-soccer-vanta-att',
    title: 'Nike Soccer',
    badge: 'Event',
    description:
      'Summer 2026 kicked off with a bang as Vanta hosted TIFO Market at AT&T Stadium ahead of the summer tournament. The event brought together the Dallas Football community to celebrate passion, culture & love for the beautiful game that makes football in this city truly special.',
    partner: 'Vanta',
    media: {
      type: 'image',
      src: '/events/ATT_VANTA_NIKE.jpg',
      alt: 'TIFO Market at AT&T Stadium with Nike Soccer and Vanta',
      width: 1538,
      height: 2048,
    },
  },
  {
    id: 'national-kit-swap-four-corners',
    title: 'NKS',
    badge: 'Event',
    description:
      'First ever two-day football focused event that brought together the top jersey collectors and vendors from across the country. The weekend was historic and Four Corners Brewing Co. was the perfect place to celebrate, the people, stories and jersey that shape the game.',
    partner: 'Four Corners Brewing Co.',
    media: {
      type: 'image',
      src: '/events/NKS.jpg',
      alt: 'National Kit Swap at Four Corners Brewing Co.',
      width: 2048,
      height: 1536,
    },
  },
  {
    id: 'tifo-installation-toca-social',
    title: 'TOCA Social',
    badge: 'Event',
    description:
      'To celebrate the launch of TOCA Social in the U.S., TIFO Market helped bring authenticity, energy, and passion to a brand new footy experience. The event connected the TOCA Social vision with Dallas’ vibrant football community, creating a space where culture, competition & fun came together.',
    partner: 'TOCA Social',
    media: {
      type: 'image',
      src: '/events/TOCA.jpg',
      alt: 'TIFO installation at TOCA Social',
      width: 3464,
      height: 4608,
    },
  },
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
      width: 3024,
      height: 2170,
    },
  },
]
