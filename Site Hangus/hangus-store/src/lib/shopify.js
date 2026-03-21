const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-10'

const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`)
  const { data, errors } = await res.json()
  if (errors) throw new Error(errors[0].message)
  return data
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts({ first = 20, after = null, query = '' } = {}) {
  const data = await shopifyFetch(
    `query GetProducts($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id handle title
            priceRange { minVariantPrice { amount currencyCode } }
            featuredImage { url altText }
            tags
          }
        }
      }
    }`,
    { first, after, query }
  )
  return data.products
}

export async function getProductByHandle(handle) {
  const data = await shopifyFetch(
    `query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id handle title descriptionHtml tags
        images(first: 8) { edges { node { url altText } } }
        variants(first: 10) {
          edges {
            node {
              id title availableForSale
              price { amount currencyCode }
              selectedOptions { name value }
            }
          }
        }
      }
    }`,
    { handle }
  )
  return data.productByHandle
}

export async function getCollections() {
  const data = await shopifyFetch(
    `query GetCollections {
      collections(first: 10) {
        edges {
          node {
            id handle title
            image { url altText }
            description
          }
        }
      }
    }`
  )
  return data.collections.edges.map((e) => e.node)
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export async function createCart() {
  const data = await shopifyFetch(
    `mutation CartCreate {
      cartCreate {
        cart { id checkoutUrl }
      }
    }`
  )
  return data.cartCreate.cart
}

export async function addToCart(cartId, merchandiseId, quantity = 1) {
  const data = await shopifyFetch(
    `mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id checkoutUrl totalQuantity
          cost { totalAmount { amount currencyCode } }
          lines(first: 50) {
            edges {
              node {
                id quantity
                merchandise {
                  ... on ProductVariant {
                    id title
                    price { amount currencyCode }
                    product { title featuredImage { url } }
                  }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ merchandiseId, quantity }] }
  )
  return data.cartLinesAdd.cart
}

export async function getCart(cartId) {
  const data = await shopifyFetch(
    `query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id checkoutUrl totalQuantity
        cost { totalAmount { amount currencyCode } }
        lines(first: 50) {
          edges {
            node {
              id quantity
              merchandise {
                ... on ProductVariant {
                  id title
                  price { amount currencyCode }
                  product { title featuredImage { url } }
                }
              }
            }
          }
        }
      }
    }`,
    { cartId }
  )
  return data.cart
}

export async function removeFromCart(cartId, lineId) {
  const data = await shopifyFetch(
    `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id checkoutUrl totalQuantity
          cost { totalAmount { amount currencyCode } }
          lines(first: 50) {
            edges {
              node {
                id quantity
                merchandise {
                  ... on ProductVariant {
                    id title
                    price { amount currencyCode }
                    product { title featuredImage { url } }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { cartId, lineIds: [lineId] }
  )
  return data.cartLinesRemove.cart
}

// ── Customer Auth ─────────────────────────────────────────────────────────────

export async function customerLogin(email, password) {
  const data = await shopifyFetch(
    `mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code field message }
      }
    }`,
    { input: { email, password } }
  )
  const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreate
  if (customerUserErrors.length) throw new Error(customerUserErrors[0].message)
  return customerAccessToken
}

export async function customerLogout(accessToken) {
  await shopifyFetch(
    `mutation CustomerLogout($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
      }
    }`,
    { customerAccessToken: accessToken }
  )
}

export async function getCustomer(accessToken) {
  const data = await shopifyFetch(
    `query GetCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id firstName lastName email phone
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id orderNumber processedAt financialStatus fulfillmentStatus
              currentTotalPrice { amount currencyCode }
              lineItems(first: 10) {
                edges {
                  node {
                    title quantity
                    variant { image { url } price { amount currencyCode } }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { customerAccessToken: accessToken }
  )
  return data.customer
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(amount, currencyCode = 'EUR') {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: currencyCode }).format(amount)
}
