export interface MarketData {
  asset: string
  price: number
  volume24h: number
  change24h: number
  high24h: number
  low24h: number
  timestamp: number
}

export interface OrderRequest {
  asset: string
  amount: number
  price?: number
  isBuy: boolean
  orderType: "market" | "limit"
}

export interface OrderResponse {
  success: boolean
  orderId?: string
  message: string
  timestamp: number
}

export interface VaultAction {
  action: "deposit" | "withdraw"
  amount: number
  asset?: string
}

export interface ContractCall {
  contractAddress: string
  functionName: string
  params: any[]
  value?: string
}

export interface Transaction {
  id: string
  asset: string
  amount: number
  price: number
  isBuy: boolean
  timestamp: Date
  status: "pending" | "completed" | "failed"
}

export interface ApiError {
  error: string
  code: number
  details?: string
}
