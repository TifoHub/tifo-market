import type { Product, Size } from '@/app/lib/products'

export interface ShopifyProductConnectionResponse {
  products: {
    nodes: ShopifyProductNode[]
  }
}

export interface ShopifyProductNode {
  id: string
  handle: string
  title: string
  description: string
  productType: string
  tags: string[]
  featuredImage: ShopifyImageNode | null
  images: {
    nodes: ShopifyImageNode[]
  }
  variants: {
    nodes: ShopifyVariantNode[]
  }
}

export interface ShopifyImageNode {
  url: string
  altText: string | null
}

export interface ShopifyVariantNode {
  id: string
  title: string
  availableForSale: boolean
  image: ShopifyImageNode | null
  price: {
    amount: string
    currencyCode: string
  }
  selectedOptions: Array<{
    name: string
    value: string
  }>
}

export interface ShopifyCartConnectionResponse {
  cart: ShopifyCartNode | null
}

export interface ShopifyCartMutationResponse {
  cartCreate?: {
    cart: ShopifyCartNode | null
    userErrors: ShopifyUserError[]
  }
  cartLinesAdd?: {
    cart: ShopifyCartNode | null
    userErrors: ShopifyUserError[]
  }
  cartLinesUpdate?: {
    cart: ShopifyCartNode | null
    userErrors: ShopifyUserError[]
  }
  cartLinesRemove?: {
    cart: ShopifyCartNode | null
    userErrors: ShopifyUserError[]
  }
}

export interface ShopifyUserError {
  field: string[] | null
  message: string
}

export interface ShopifyCartNode {
  id: string
  checkoutUrl: string
  cost: {
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    nodes: ShopifyCartLineNode[]
  }
}

export interface ShopifyCartLineNode {
  id: string
  quantity: number
  merchandise: ShopifyCartMerchandiseNode | null
}

export interface ShopifyCartMerchandiseNode {
  id: string
  title: string
  availableForSale: boolean
  image: ShopifyImageNode | null
  price: {
    amount: string
    currencyCode: string
  }
  selectedOptions: Array<{
    name: string
    value: string
  }>
  product: ShopifyProductNode
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandiseId: string
  size?: Size
  product: Product
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalItems: number
  subtotalPrice: number
  totalPrice: number
  currencyCode: string
  lines: ShopifyCartLine[]
}
