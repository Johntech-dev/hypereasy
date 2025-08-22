import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/**
 * Database utility functions for HyperEasy
 */

export async function logTransaction(data: {
  asset: string
  amount: number
  price: number
  isBuy: boolean
  orderType: string
  status?: string
  orderId?: string
  userId?: string
}) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        asset: data.asset,
        amount: data.amount,
        price: data.price,
        isBuy: data.isBuy,
        orderType: data.orderType,
        status: data.status || "pending",
        orderId: data.orderId,
        userId: data.userId,
      },
    })
    return transaction
  } catch (error) {
    console.error("Failed to log transaction:", error)
    throw error
  }
}

export async function logVaultOperation(data: {
  action: string
  amount: number
  status?: string
  userId?: string
}) {
  try {
    const operation = await prisma.vaultOperation.create({
      data: {
        action: data.action,
        amount: data.amount,
        status: data.status || "pending",
        userId: data.userId,
      },
    })
    return operation
  } catch (error) {
    console.error("Failed to log vault operation:", error)
    throw error
  }
}

export async function logApiUsage(data: {
  endpoint: string
  method: string
  status: number
  userId?: string
}) {
  try {
    const usage = await prisma.apiUsage.create({
      data: {
        endpoint: data.endpoint,
        method: data.method,
        status: data.status,
        userId: data.userId,
      },
    })
    return usage
  } catch (error) {
    console.error("Failed to log API usage:", error)
    // Don't throw error for API usage logging to avoid breaking main functionality
  }
}

export async function getRecentTransactions(limit = 10, userId?: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: userId ? { userId } : {},
      orderBy: { timestamp: "desc" },
      take: limit,
    })
    return transactions
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    throw error
  }
}

export async function getTransactionStats(userId?: string) {
  try {
    const [totalTransactions, completedTransactions, totalVolume] = await Promise.all([
      prisma.transaction.count({
        where: userId ? { userId } : {},
      }),
      prisma.transaction.count({
        where: {
          status: "completed",
          ...(userId ? { userId } : {}),
        },
      }),
      prisma.transaction.aggregate({
        where: {
          status: "completed",
          ...(userId ? { userId } : {}),
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    return {
      totalTransactions,
      completedTransactions,
      totalVolume: totalVolume._sum.amount || 0,
      successRate: totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0,
    }
  } catch (error) {
    console.error("Failed to fetch transaction stats:", error)
    throw error
  }
}

export async function updateTransactionStatus(id: string, status: string, orderId?: string) {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        status,
        ...(orderId ? { orderId } : {}),
      },
    })
    return transaction
  } catch (error) {
    console.error("Failed to update transaction status:", error)
    throw error
  }
}
