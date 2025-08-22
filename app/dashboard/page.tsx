import { TransactionHistory } from "@/components/transaction-history"
import { VaultManager } from "@/components/vault-manager"
import { Header } from "@/components/header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#0A0F1C] to-[#121212]">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Trading Dashboard</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Monitor your trading activity and manage your Hyperliquid vault
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <VaultManager />
          <TransactionHistory />
        </div>
      </main>
    </div>
  )
}
