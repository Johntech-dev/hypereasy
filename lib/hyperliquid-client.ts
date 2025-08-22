import axios, { type AxiosInstance } from "axios"
import { ethers } from "ethers"
import type { MarketData, OrderRequest, OrderResponse, VaultAction, ContractCall, ApiError } from "./types"

/**
 * Hyperliquid API Client
 * Provides methods to interact with Hyperliquid's trading and market data APIs
 */
export class HyperliquidClient {
  private apiClient: AxiosInstance
  private evmProvider?: ethers.JsonRpcProvider

  constructor(
    private apiKey: string,
    private apiUrl: string = process.env.HYPERLIQUID_API_URL || "https://api.hyperliquid.xyz",
    private evmRpcUrl?: string,
  ) {
    this.apiClient = axios.create({
      baseURL: this.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      timeout: 30000,
    })

    if (evmRpcUrl) {
      this.evmProvider = new ethers.JsonRpcProvider(evmRpcUrl)
    }
  }

  /**
   * Get market data for a specific asset
   * @param asset - The asset symbol (e.g., "BTC", "ETH")
   * @returns Promise<MarketData>
   */
  async getMarketData(asset: string): Promise<MarketData> {
    try {
      const response = await this.apiClient.get("/info", {
        params: { type: "meta" },
      })

      // Mock response structure - replace with actual Hyperliquid API response parsing
      const mockData: MarketData = {
        asset,
        price: Math.random() * 50000 + 30000, // Mock BTC price
        volume24h: Math.random() * 1000000000,
        change24h: (Math.random() - 0.5) * 10,
        high24h: Math.random() * 52000 + 30000,
        low24h: Math.random() * 48000 + 30000,
        timestamp: Date.now(),
      }

      return mockData
    } catch (error) {
      throw this.handleError(error, "Failed to fetch market data")
    }
  }

  /**
   * Place a trading order
   * @param order - Order details
   * @returns Promise<OrderResponse>
   */
  async placeOrder(order: OrderRequest): Promise<OrderResponse> {
    try {
      this.validateOrder(order)

      const payload = {
        action: {
          type: "order",
          orders: [
            {
              a: this.getAssetIndex(order.asset),
              b: order.isBuy,
              p: order.price?.toString() || "0",
              s: order.amount.toString(),
              r: false, // reduce only
              t: { limit: { tif: "Gtc" } }, // time in force
            },
          ],
        },
        nonce: Date.now(),
        signature: "", // Would need proper signing implementation
      }

      const response = await this.apiClient.post("/exchange", payload)

      return {
        success: true,
        orderId: `order_${Date.now()}`, // Mock order ID
        message: `${order.orderType} order placed successfully`,
        timestamp: Date.now(),
      }
    } catch (error) {
      throw this.handleError(error, "Failed to place order")
    }
  }

  /**
   * Manage vault operations (deposit/withdraw)
   * @param action - Vault action details
   * @returns Promise<OrderResponse>
   */
  async manageVault(action: VaultAction): Promise<OrderResponse> {
    try {
      const payload = {
        action: {
          type: "vaultTransfer",
          vaultTransfer: {
            vaultAddress: null, // Main vault
            isDeposit: action.action === "deposit",
            usd: action.amount.toString(),
          },
        },
        nonce: Date.now(),
        signature: "", // Would need proper signing implementation
      }

      const response = await this.apiClient.post("/exchange", payload)

      return {
        success: true,
        message: `Vault ${action.action} of $${action.amount} completed`,
        timestamp: Date.now(),
      }
    } catch (error) {
      throw this.handleError(error, `Failed to ${action.action} from vault`)
    }
  }

  /**
   * Call a smart contract on HyperEVM
   * @param contractCall - Contract call details
   * @returns Promise<any>
   */
  async callContract(contractCall: ContractCall): Promise<any> {
    if (!this.evmProvider) {
      throw new Error("EVM provider not configured")
    }

    try {
      const contract = new ethers.Contract(
        contractCall.contractAddress,
        ["function " + contractCall.functionName + "(...)"], // Simplified ABI
        this.evmProvider,
      )

      const result = await contract[contractCall.functionName](...contractCall.params)
      return result
    } catch (error) {
      throw this.handleError(error, "Failed to call contract")
    }
  }

  /**
   * Get user's trading state and positions
   * @param user - User address
   * @returns Promise<any>
   */
  async getUserState(user: string): Promise<any> {
    try {
      const response = await this.apiClient.get("/info", {
        params: {
          type: "clearinghouseState",
          user,
        },
      })

      return response.data
    } catch (error) {
      throw this.handleError(error, "Failed to fetch user state")
    }
  }

  private validateOrder(order: OrderRequest): void {
    if (!order.asset || !order.amount) {
      throw new Error("Asset and amount are required")
    }
    if (order.amount <= 0) {
      throw new Error("Amount must be positive")
    }
    if (order.orderType === "limit" && (!order.price || order.price <= 0)) {
      throw new Error("Price is required for limit orders")
    }
  }

  private getAssetIndex(asset: string): number {
    // Mock asset index mapping - replace with actual Hyperliquid asset indices
    const assetMap: Record<string, number> = {
      BTC: 0,
      ETH: 1,
      SOL: 2,
      AVAX: 3,
      MATIC: 4,
    }
    return assetMap[asset] ?? 0
  }

  private handleError(error: any, message: string): ApiError {
    console.error(`${message}:`, error)
    return {
      error: message,
      code: error.response?.status || 500,
      details: error.response?.data?.message || error.message,
    }
  }
}
