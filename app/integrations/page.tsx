import { Header } from "@/components/header"
import { DiscordIntegration } from "@/components/discord-integration"

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#0A0F1C] to-[#121212]">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Integrations</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect HyperEasy with your favorite tools and services for enhanced trading experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <DiscordIntegration />
        </div>
      </main>
    </div>
  )
}
