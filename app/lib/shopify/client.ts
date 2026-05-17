const SHOPIFY_API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? '2025-10'

function getStoreDomain() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  if (!domain) {
    throw new Error('SHOPIFY_STORE_DOMAIN is not set')
  }
  return domain
}

function getStorefrontToken() {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (!token) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set')
  }
  return token
}

export async function shopifyFetch<TData>({
  query,
  variables,
  cache = 'no-store',
}: {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
}): Promise<TData> {
  const response = await fetch(
    `https://${getStoreDomain()}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': getStorefrontToken(),
      },
      body: JSON.stringify({ query, variables }),
      cache,
    },
  )

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}`)
  }

  const json = await response.json() as {
    data?: TData
    errors?: Array<{ message?: string }>
  }

  if (json.errors?.length) {
    const message = json.errors.map((error) => error.message ?? 'Unknown Shopify error').join('; ')
    throw new Error(message)
  }

  if (!json.data) {
    throw new Error('Shopify response did not include data')
  }

  return json.data
}
