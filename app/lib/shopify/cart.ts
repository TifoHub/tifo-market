import { mapShopifyProduct } from '@/app/lib/shopify/products'
import { shopifyFetch } from '@/app/lib/shopify/client'
import type {
  ShopifyCart,
  ShopifyCartConnectionResponse,
  ShopifyCartMutationResponse,
  ShopifyCartNode,
  ShopifyUserError,
} from '@/app/lib/shopify/types'

const CART_FIELDS = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
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
            product {
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
      }
    }
  }
`

const GET_CART_QUERY = `
  ${CART_FIELDS}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`

const CREATE_CART_MUTATION = `
  ${CART_FIELDS}
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const ADD_LINES_MUTATION = `
  ${CART_FIELDS}
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const UPDATE_LINES_MUTATION = `
  ${CART_FIELDS}
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const REMOVE_LINES_MUTATION = `
  ${CART_FIELDS}
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

function assertNoUserErrors(errors: ShopifyUserError[] | undefined) {
  if (!errors?.length) return
  throw new Error(errors.map((error) => error.message).join('; '))
}

export function mapShopifyCart(cart: ShopifyCartNode): ShopifyCart {
  const lines = cart.lines.nodes
    .filter((line) => line.merchandise?.product)
    .map((line) => {
      const merchandise = line.merchandise!
      const product = mapShopifyProduct(merchandise.product)
      const sizeOption = merchandise.selectedOptions.find(
        (option) => option.name.toLowerCase() === 'size',
      )

      return {
        id: line.id,
        quantity: line.quantity,
        merchandiseId: merchandise.id,
        size: sizeOption?.value as ShopifyCart['lines'][number]['size'],
        product,
      }
    })

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalItems: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotalPrice: Math.round(Number(cart.cost.subtotalAmount.amount) * 100),
    totalPrice: Math.round(Number(cart.cost.totalAmount.amount) * 100),
    currencyCode: cart.cost.totalAmount.currencyCode,
    lines,
  }
}

export async function getShopifyCart(cartId: string) {
  const data = await shopifyFetch<ShopifyCartConnectionResponse>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: 'no-store',
  })

  return data.cart ? mapShopifyCart(data.cart) : null
}

export async function createShopifyCart(lines?: Array<{ merchandiseId: string; quantity: number }>) {
  const data = await shopifyFetch<ShopifyCartMutationResponse>({
    query: CREATE_CART_MUTATION,
    variables: {
      lines: lines?.map((line) => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      })),
    },
    cache: 'no-store',
  })

  assertNoUserErrors(data.cartCreate?.userErrors)

  if (!data.cartCreate?.cart) {
    throw new Error('Shopify did not return a cart')
  }

  return mapShopifyCart(data.cartCreate.cart)
}

export async function addShopifyCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
) {
  const data = await shopifyFetch<ShopifyCartMutationResponse>({
    query: ADD_LINES_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  })

  assertNoUserErrors(data.cartLinesAdd?.userErrors)

  if (!data.cartLinesAdd?.cart) {
    throw new Error('Shopify did not return a cart')
  }

  return mapShopifyCart(data.cartLinesAdd.cart)
}

export async function updateShopifyCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
) {
  const data = await shopifyFetch<ShopifyCartMutationResponse>({
    query: UPDATE_LINES_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  })

  assertNoUserErrors(data.cartLinesUpdate?.userErrors)

  if (!data.cartLinesUpdate?.cart) {
    throw new Error('Shopify did not return a cart')
  }

  return mapShopifyCart(data.cartLinesUpdate.cart)
}

export async function removeShopifyCartLines(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<ShopifyCartMutationResponse>({
    query: REMOVE_LINES_MUTATION,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })

  assertNoUserErrors(data.cartLinesRemove?.userErrors)

  if (!data.cartLinesRemove?.cart) {
    throw new Error('Shopify did not return a cart')
  }

  return mapShopifyCart(data.cartLinesRemove.cart)
}
