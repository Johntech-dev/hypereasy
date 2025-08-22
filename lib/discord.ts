import { DISCORD_COLORS } from "./constants"
import type { OrderRequest, OrderResponse, VaultAction, MarketData } from "./types"

export interface DiscordEmbed {
  title: string
  description?: string
  color: number
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  footer?: {
    text: string
    icon_url?: string
  }
  timestamp?: string
  thumbnail?: {
    url: string
  }
}

export interface DiscordWebhookPayload {
  content?: string
  embeds?: DiscordEmbed[]
  username?: string
  avatar_url?: string
}

/**
 * Discord notification service for HyperEasy
 */
export class DiscordNotificationService {
  private webhookUrl: string

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl
  }

  /**
   * Send a trade alert notification
   */
  async sendTradeAlert(order: OrderRequest, result: OrderResponse): Promise<void> {
    const embed: DiscordEmbed = {
      title: "🚀 HyperEasy Trade Alert",
      description: `${order.isBuy ? "**BUY**" : "**SELL**"} order ${result.success ? "executed" : "failed"}`,
      color: result.success ? DISCORD_COLORS.SUCCESS : DISCORD_COLORS.ERROR,
      fields: [
        {
          name: "Asset",
          value: `**${order.asset}**`,
          inline: true,
        },
        {
          name: "Amount",
          value: `$${order.amount.toLocaleString()}`,
          inline: true,
        },
        {
          name: "Order Type",
          value: order.orderType.toUpperCase(),
          inline: true,
        },
        {
          name: "Price",
          value: order.price ? `$${order.price.toLocaleString()}` : "Market Price",
          inline: true,
        },
        {
          name: "Status",
          value: result.success ? "✅ **SUCCESS**" : "❌ **FAILED**",
          inline: true,
        },
        {
          name: "Order ID",
          value: result.orderId || "N/A",
          inline: true,
        },
      ],
      footer: {
        text: "HyperEasy SDK • Powered by Hyperliquid",
      },
      timestamp: new Date().toISOString(),
    }

    if (!result.success) {
      embed.fields?.push({
        name: "Error Details",
        value: result.message || "Unknown error occurred",
        inline: false,
      })
    }

    await this.sendWebhook({
      embeds: [embed],
      username: "HyperEasy Bot",
    })
  }

  /**
   * Send a vault operation notification
   */
  async sendVaultAlert(action: VaultAction, success: boolean, message: string): Promise<void> {
    const embed: DiscordEmbed = {
      title: "💰 Vault Operation",
      description: `**${action.action.toUpperCase()}** ${success ? "completed" : "failed"}`,
      color: success ? DISCORD_COLORS.SUCCESS : DISCORD_COLORS.ERROR,
      fields: [
        {
          name: "Operation",
          value: action.action === "deposit" ? "📥 Deposit" : "📤 Withdraw",
          inline: true,
        },
        {
          name: "Amount",
          value: `$${action.amount.toLocaleString()}`,
          inline: true,
        },
        {
          name: "Status",
          value: success ? "✅ **SUCCESS**" : "❌ **FAILED**",
          inline: true,
        },
      ],
      footer: {
        text: "HyperEasy SDK • Vault Management",
      },
      timestamp: new Date().toISOString(),
    }

    if (!success) {
      embed.fields?.push({
        name: "Error Details",
        value: message,
        inline: false,
      })
    }

    await this.sendWebhook({
      embeds: [embed],
      username: "HyperEasy Bot",
    })
  }

  /**
   * Send market data alert (price alerts, significant changes)
   */
  async sendMarketAlert(
    marketData: MarketData,
    alertType: "price_target" | "significant_change",
    threshold?: number,
  ): Promise<void> {
    const isPositiveChange = marketData.change24h >= 0

    const embed: DiscordEmbed = {
      title: "📊 Market Alert",
      description:
        alertType === "price_target"
          ? `**${marketData.asset}** has reached your target price!`
          : `**${marketData.asset}** has significant price movement!`,
      color: isPositiveChange ? DISCORD_COLORS.SUCCESS : DISCORD_COLORS.WARNING,
      fields: [
        {
          name: "Current Price",
          value: `$${marketData.price.toLocaleString()}`,
          inline: true,
        },
        {
          name: "24h Change",
          value: `${isPositiveChange ? "📈" : "📉"} ${marketData.change24h.toFixed(2)}%`,
          inline: true,
        },
        {
          name: "24h Volume",
          value: `$${(marketData.volume24h / 1000000).toFixed(2)}M`,
          inline: true,
        },
        {
          name: "24h High",
          value: `$${marketData.high24h.toLocaleString()}`,
          inline: true,
        },
        {
          name: "24h Low",
          value: `$${marketData.low24h.toLocaleString()}`,
          inline: true,
        },
      ],
      footer: {
        text: "HyperEasy SDK • Market Data",
      },
      timestamp: new Date().toISOString(),
    }

    if (threshold) {
      embed.fields?.push({
        name: "Alert Threshold",
        value: `${threshold}%`,
        inline: true,
      })
    }

    await this.sendWebhook({
      embeds: [embed],
      username: "HyperEasy Bot",
    })
  }

  /**
   * Send system status notification
   */
  async sendSystemAlert(type: "error" | "warning" | "info", title: string, message: string): Promise<void> {
    const colorMap = {
      error: DISCORD_COLORS.ERROR,
      warning: DISCORD_COLORS.WARNING,
      info: DISCORD_COLORS.INFO,
    }

    const iconMap = {
      error: "🚨",
      warning: "⚠️",
      info: "ℹ️",
    }

    const embed: DiscordEmbed = {
      title: `${iconMap[type]} ${title}`,
      description: message,
      color: colorMap[type],
      footer: {
        text: "HyperEasy SDK • System Alert",
      },
      timestamp: new Date().toISOString(),
    }

    await this.sendWebhook({
      embeds: [embed],
      username: "HyperEasy System",
    })
  }

  /**
   * Send daily trading summary
   */
  async sendDailySummary(stats: {
    totalTrades: number
    successfulTrades: number
    totalVolume: number
    topAsset: string
    pnl?: number
  }): Promise<void> {
    const successRate = stats.totalTrades > 0 ? (stats.successfulTrades / stats.totalTrades) * 100 : 0

    const embed: DiscordEmbed = {
      title: "📈 Daily Trading Summary",
      description: "Your trading activity for today",
      color: DISCORD_COLORS.INFO,
      fields: [
        {
          name: "Total Trades",
          value: stats.totalTrades.toString(),
          inline: true,
        },
        {
          name: "Success Rate",
          value: `${successRate.toFixed(1)}%`,
          inline: true,
        },
        {
          name: "Total Volume",
          value: `$${stats.totalVolume.toLocaleString()}`,
          inline: true,
        },
        {
          name: "Top Asset",
          value: stats.topAsset,
          inline: true,
        },
      ],
      footer: {
        text: "HyperEasy SDK • Daily Summary",
      },
      timestamp: new Date().toISOString(),
    }

    if (stats.pnl !== undefined) {
      embed.fields?.push({
        name: "P&L",
        value: `${stats.pnl >= 0 ? "+" : ""}$${stats.pnl.toLocaleString()}`,
        inline: true,
      })
    }

    await this.sendWebhook({
      embeds: [embed],
      username: "HyperEasy Bot",
    })
  }

  /**
   * Test webhook connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const embed: DiscordEmbed = {
        title: "🧪 HyperEasy Connection Test",
        description: "Discord webhook is working correctly!",
        color: DISCORD_COLORS.SUCCESS,
        fields: [
          {
            name: "Status",
            value: "✅ Connected",
            inline: true,
          },
          {
            name: "Timestamp",
            value: new Date().toLocaleString(),
            inline: true,
          },
        ],
        footer: {
          text: "HyperEasy SDK • Connection Test",
        },
        timestamp: new Date().toISOString(),
      }

      await this.sendWebhook({
        embeds: [embed],
        username: "HyperEasy Bot",
      })

      return { success: true, message: "Discord webhook connection successful" }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  /**
   * Send webhook payload to Discord
   */
  private async sendWebhook(payload: DiscordWebhookPayload): Promise<void> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Discord webhook failed: ${response.status} ${errorText}`)
      }
    } catch (error) {
      console.error("Failed to send Discord notification:", error)
      throw error
    }
  }
}

/**
 * Create a Discord notification service instance
 */
export function createDiscordService(webhookUrl?: string): DiscordNotificationService | null {
  const url = webhookUrl || process.env.DISCORD_WEBHOOK_URL
  if (!url) {
    console.warn("Discord webhook URL not configured")
    return null
  }
  return new DiscordNotificationService(url)
}

/**
 * Utility function to send notifications safely (won't throw errors)
 */
export async function sendDiscordNotificationSafe(
  callback: (service: DiscordNotificationService) => Promise<void>,
): Promise<void> {
  try {
    const service = createDiscordService()
    if (service) {
      await callback(service)
    }
  } catch (error) {
    console.error("Discord notification failed:", error)
    // Don't throw - notifications shouldn't break main functionality
  }
}
