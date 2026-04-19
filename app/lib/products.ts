export type Size = 'S' | 'M' | 'L' | 'XL' | '2XL'

export interface Product {
  id: string
  name: string
  description: string
  details?: string
  images?: string[]
  video?: string
  price: number // in cents
  image: string
  category: 'apparel' | 'accessories' | 'collectibles'
  sizes?: Size[] // undefined = no size selection needed (e.g. posters)
}

export const products: Product[] = [
  {
    id: 'mint-dallas-futbol-tee',
    name: 'Mint - Dallas Futbol Tee',
    description:
      'Premium t-shirt representing the greens of the pitch, getting you as game-ready as you feel—whether you are scoring bangers or grabbing coffee at the Kit Swap.',
    details:
      '- 100% Cotton\n- Machine wash cold with like colors\n- Do not iron on design\n- Tumble dry low, hang dry if possible',
    price: 4000,
    image: '/images/products/Mint1.jpg',
    images: [
      '/images/products/Mint1.jpg',
      '/images/products/Mint2.jpg',
      '/images/products/Mint3.jpg',
    ],
    video: '/images/products/videos/MintShirt.mp4',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'vintage-black-dallas-futbol-tee',
    name: 'Vintage Black - Dallas Futbol Tee',
    description:
      'From the streets to the rooftop, this oversized t-shirt is a solid choice for a vintage feel.',
    details:
      '- 100% Cotton\n- Machine wash cold with like colors\n- Do not iron on design\n- Tumble dry low, hang dry if possible',
    price: 4000,
    image: '/images/products/VintageBlackFront.jpg',
    images: [
      '/images/products/VintageBlackFront.jpg',
      '/images/products/VintageBlackback.jpg',
      '/images/products/BlackLayedout.jpg',
    ],
    video: '/images/products/videos/BlackWashed.mp4',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'washed-red-dallas-futbol-tee',
    name: 'Washed Red - Dallas Futbol Tee',
    description:
      'Oversized t-shirt for the fans of the game who love to show their passion.',
    details:
      '- 100% Cotton\n- Machine wash cold with like colors\n- Do not iron on design\n- Tumble dry low, hang dry if possible',
    price: 4000,
    image: '/images/products/Pink1.jpg',
    images: [
      '/images/products/Pink1.jpg',
      '/images/products/Pink2.jpg',
      '/images/products/Pink3.jpg',
    ],
    video: '/images/products/videos/PinkRender.mp4',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'dallas-tifo-market-tee',
    name: 'Dallas TIFO Market Tee',
    description:
      'Classic t-shirt repping the home team—no matter where you are rocking the shirt, remember that you are Always at Home.',
    details:
      '- 100% Cotton\n- Machine wash cold with like colors\n- Do not iron on design\n- Tumble dry low, hang dry if possible',
    price: 3500,
    image: '/images/products/RegularTeeFront.jpg',
    images: [
      '/images/products/RegularTeeFront.jpg',
      '/images/products/RegularTeeBAck.jpg',
    ],
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'tifo-cup-champions-tee',
    name: 'TIFO Cup Champions Tee',
    description:
      'Built for champions on and off the pitch. TIFO CUP design on premium Shaka Wear Max Heavy t-shirt, preshrunk for a consistent fit.',
    details:
      '- 100% Cotton\n- Machine wash cold with like colors\n- Do not bleach\n- Do not iron on design\n- Tumble dry low, hang dry if possible',
    price: 4500,
    image: '/images/products/Cup3.jpg',
    images: [
      '/images/products/Cup2.jpg',
      '/images/products/Cup1.jpg',
      '/images/products/Cup3.jpg',
    ],
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'dallas-futbol-hoodie',
    name: 'Dallas Futbol Hoodie',
    description:
      'Cozy hoodie repping the Dallas footy culture—for the cold nights on the pitch and those times you need a classic black hoodie to complete the fit.',
    details:
      '- 60% Cotton\n- 40% Polyester\n- Machine wash cold with like colors\n- Do not iron on design\n- Tumble dry low',
    price: 4500,
    image: '/images/products/HoodieFront.jpg',
    images: [
      '/images/products/HoodieFront.jpg',
      '/images/products/HoodieBack.jpg',
    ],
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  // {
  //   id: 'tifo-scarf',
  //   name: 'Supporter Scarf',
  //   description: 'Knitted scarf with jacquard Tifo Market branding.',
  //   price: 2500,
  //   image: '/images/products/placeholder-product.svg',
  //   category: 'accessories',
  // },
  // {
  //   id: 'tifo-cap',
  //   name: 'Tifo Cap',
  //   description: 'Structured snapback with embroidered logo. One size fits all.',
  //   price: 3000,
  //   image: '/images/products/placeholder-product.svg',
  //   category: 'accessories',
  // },
  // {
  //   id: 'match-poster',
  //   name: 'Tote-Bag',
  //   description: 'Limited edition Tote-Bag. Perfect buy to hold your jerseys.',
  //   price: 2000,
  //   image: '/images/products/placeholder-product.svg',
  //   category: 'accessories',
  // },
]

/** Strips inventory lines (e.g. "Available: 2×S, …") from details shown on product cards. */
export function detailsWithoutStockLines(details: string): string {
  return details
    .split('\n')
    .filter((line) => !/^\s*available\s*:/i.test(line))
    .join('\n')
    .trimEnd()
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
