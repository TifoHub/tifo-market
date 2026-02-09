export type Size = 'S' | 'M' | 'L' | 'XL' | '2XL'

export interface Product {
  id: string
  name: string
  description: string
  price: number // in cents
  image: string
  category: 'apparel' | 'accessories' | 'collectibles'
  sizes?: Size[] // undefined = no size selection needed (e.g. posters)
}

export const products: Product[] = [
  {
    id: 'tournament-jersey',
    name: 'Tournament Jersey',
    description: 'Official Tifo Market tournament jersey. Breathable fabric, bold design.',
    price: 5500,
    image: '/images/products/Jersey.jpg',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'tournament-day-tee',
    name: 'Tourney Day Tee',
    description: 'Premium cotton tee. Relaxed fit, made for the terraces.',
    price: 3500,
    image: '/images/products/TourneyShirt.png',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'culture-hoodie',
    name: 'Culture Hoodie',
    description: 'Heavyweight cotton hoodie with embroidered Tifo crest.',
    price: 7500,
    image: '/images/products/TifoHoodie.jpg',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'match-day-tee',
    name: 'Match Day Tee',
    description: 'Premium cotton tee. Relaxed fit, made for the terraces.',
    price: 3500,
    image: '/images/placeholder-product.svg',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'tifo-scarf',
    name: 'Supporter Scarf',
    description: 'Knitted scarf with jacquard Tifo Market branding.',
    price: 2500,
    image: '/images/placeholder-product.svg',
    category: 'accessories',
  },
  {
    id: 'tifo-cap',
    name: 'Tifo Cap',
    description: 'Structured snapback with embroidered logo. One size fits all.',
    price: 3000,
    image: '/images/placeholder-product.svg',
    category: 'accessories'
  },
  {
    id: 'match-poster',
    name: 'Tote-Bag',
    description: 'Limited edition Tote-Bag. Perfect buy to hold your jerseys.',
    price: 2000,
    image: '/images/placeholder-product.svg',
    category: 'accessories',
  },
]

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
