import {
  isKnownSize,
  products as legacyProducts,
  type Category,
  type Product,
  type Size,
  type ProductVariant,
} from '@/app/lib/products'
import { shopifyFetch } from '@/app/lib/shopify/client'
import type {
  ShopifyProductConnectionResponse,
  ShopifyProductNode,
  ShopifyVariantNode,
} from '@/app/lib/shopify/types'

const PRODUCTS_QUERY = `
  query StorefrontProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        id
        handle
        title
        description
        productType
        tags
        featuredImage {
          url
          altText
        }
        images(first: 10) {
          nodes {
            url
            altText
          }
        }
        variants(first: 25) {
          nodes {
            id
            title
            availableForSale
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildLegacyLookup() {
  return new Map(
    legacyProducts.flatMap((product) => [
      [product.id, product],
      [product.handle ?? product.id, product],
      [slugify(product.name), product],
    ]),
  )
}

const legacyLookup = buildLegacyLookup()

function resolveCategory(node: ShopifyProductNode, fallback?: Product): Category {
  const normalizedTags = node.tags.map((tag) => tag.toLowerCase())
  const taggedCategory = normalizedTags.find((tag) =>
    ['apparel', 'accessories', 'collectibles'].includes(tag),
  )

  if (taggedCategory === 'apparel' || taggedCategory === 'accessories' || taggedCategory === 'collectibles') {
    return taggedCategory
  }

  const prefixedTag = normalizedTags.find((tag) => tag.startsWith('category:'))
  if (prefixedTag) {
    const value = prefixedTag.split(':')[1]
    if (value === 'apparel' || value === 'accessories' || value === 'collectibles') {
      return value
    }
  }

  const type = node.productType.toLowerCase()
  if (type.includes('accessor')) return 'accessories'
  if (type.includes('collect')) return 'collectibles'
  if (type.includes('apparel') || type.includes('shirt') || type.includes('hoodie')) {
    return 'apparel'
  }

  return fallback?.category ?? 'apparel'
}

function getVariantSize(variant: ShopifyVariantNode) {
  const sizeOption = variant.selectedOptions.find((option) => option.name.toLowerCase() === 'size')
  if (sizeOption && isKnownSize(sizeOption.value.toUpperCase())) {
    return sizeOption.value.toUpperCase() as Size
  }

  const title = variant.title.toUpperCase()
  return isKnownSize(title) ? title : undefined
}

function mapVariant(variant: ShopifyVariantNode): ProductVariant {
  const size = getVariantSize(variant)

  return {
    id: variant.id,
    title: variant.title,
    size,
    price: Math.round(Number(variant.price.amount) * 100),
    availableForSale: variant.availableForSale,
    image: variant.image?.url ?? undefined,
  }
}

export function mapShopifyProduct(node: ShopifyProductNode): Product {
  const fallback =
    legacyLookup.get(node.handle) ??
    legacyLookup.get(slugify(node.title))

  const variants = node.variants.nodes.map(mapVariant)
  const firstVariant = variants[0] ?? null
  const sizes = variants
    .map((variant) => variant.size)
    .filter((size): size is NonNullable<typeof size> => Boolean(size))

  const imageUrls = node.images.nodes.map((image) => image.url)
  const featuredImage =
    node.featuredImage?.url ??
    imageUrls[0] ??
    fallback?.image ??
    '/images/products/placeholder-product.svg'

  return {
    id: fallback?.id ?? node.handle ?? node.id,
    handle: node.handle,
    name: node.title,
    description: node.description || fallback?.description || '',
    details: fallback?.details,
    price: firstVariant?.price ?? fallback?.price ?? 0,
    image: featuredImage,
    images: imageUrls.length > 0 ? imageUrls : fallback?.images,
    video: fallback?.video,
    category: resolveCategory(node, fallback),
    sizes: sizes.length > 0 ? sizes : undefined,
    availableForSale: variants.some((variant) => variant.availableForSale),
    variants,
  }
}

export async function getStorefrontProducts(first = 24) {
  const data = await shopifyFetch<ShopifyProductConnectionResponse>({
    query: PRODUCTS_QUERY,
    variables: { first },
    cache: 'no-store',
  })

  return data.products.nodes.map(mapShopifyProduct)
}
