export const HYPERLIQUID_ASSETS = ["BTC", "ETH", "SOL", "AVAX", "MATIC", "LINK", "UNI", "AAVE", "SUSHI", "CRV"] as const

export const ORDER_TYPES = ["market", "limit"] as const

export const HYPERLIQUID_ENDPOINTS = {
  MARKET_DATA: "/info",
  PLACE_ORDER: "/exchange",
  CANCEL_ORDER: "/exchange",
  USER_STATE: "/info",
  VAULT_TRANSFER: "/exchange",
} as const

export const DEFAULT_SLIPPAGE = 0.01 // 1%
export const MAX_ORDER_SIZE = 1000000 // $1M
export const MIN_ORDER_SIZE = 1 // $1

export const DISCORD_COLORS = {
  SUCCESS: 0x00d4ff, // Hyperliquid cyan
  ERROR: 0xff4444, // Red
  WARNING: 0xff00a8, // Hyperliquid magenta
  INFO: 0xe0e0e0, // Light gray
} as const
