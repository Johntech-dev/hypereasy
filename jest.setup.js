"use client"

import "@testing-library/jest-dom"
import { jest } from "@jest/globals"
import { beforeEach } from "@jest/types"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return "/"
  },
}))

// Mock environment variables
process.env.HYPERLIQUID_API_KEY = "test-api-key"
process.env.DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/test"
process.env.DATABASE_URL = "file:./test.db"

// Mock fetch globally
global.fetch = jest.fn()

// Setup for each test
beforeEach(() => {
  jest.clearAllMocks()
})
