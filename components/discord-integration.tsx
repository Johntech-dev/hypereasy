"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MessageSquare, TestTube, Bell, CheckCircle, XCircle } from "lucide-react"

export function DiscordIntegration() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [notifications, setNotifications] = useState({
    tradeAlerts: true,
    vaultOperations: true,
    marketAlerts: false,
    dailySummary: false,
    systemAlerts: true,
  })

  const testWebhook = async () => {
    if (!webhookUrl.trim()) {
      setTestResult({ success: false, message: "Please enter a webhook URL" })
      return
    }

    setIsTestingConnection(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/discord/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setTestResult({ success: true, message: data.message })
      } else {
        setTestResult({ success: false, message: data.error || "Test failed" })
      }
    } catch (error) {
      setTestResult({ success: false, message: "Network error. Please try again." })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const sendTestAlert = async (alertType: string) => {
    try {
      const alertData = {
        type: alertType,
        data: getTestAlertData(alertType),
      }

      const response = await fetch("/api/discord/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setTestResult({ success: true, message: `${alertType} alert sent successfully!` })
      } else {
        setTestResult({ success: false, message: data.error || "Failed to send alert" })
      }
    } catch (error) {
      setTestResult({ success: false, message: "Network error. Please try again." })
    }
  }

  const getTestAlertData = (alertType: string) => {
    switch (alertType) {
      case "daily_summary":
        return { pnl: 150.75 }
      case "market_alert":
        return {
          marketData: {
            asset: "BTC",
            price: 45000,
            change24h: 5.2,
            volume24h: 1200000000,
            high24h: 46000,
            low24h: 43500,
            timestamp: Date.now(),
          },
          alertType: "significant_change",
          threshold: 5,
        }
      case "system_alert":
        return {
          title: "Test System Alert",
          message: "This is a test system notification from HyperEasy",
          alertLevel: "info",
        }
      default:
        return {}
    }
  }

  return (
    <Card className="bg-[#0A0F1C] border-gray-800 hyperliquid-glow">
      <CardHeader>
        <CardTitle className="text-[#00D4FF] flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discord Integration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Get real-time notifications for your trading activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Webhook URL Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-gray-300">
              Discord Webhook URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-[#121212] border-gray-700 text-white placeholder-gray-500 flex-1"
              />
              <Button
                onClick={testWebhook}
                disabled={isTestingConnection}
                variant="outline"
                className="border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-black bg-transparent"
              >
                {isTestingConnection ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Create a webhook in your Discord server settings → Integrations → Webhooks
            </p>
          </div>

          {/* Test Result */}
          {testResult && (
            <Alert
              className={`${testResult.success ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <AlertDescription className={testResult.success ? "text-green-400" : "text-red-400"}>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </h3>

          <div className="space-y-3">
            {[
              {
                key: "tradeAlerts",
                label: "Trade Alerts",
                description: "Get notified when orders are placed or executed",
              },
              {
                key: "vaultOperations",
                label: "Vault Operations",
                description: "Notifications for deposits and withdrawals",
              },
              {
                key: "marketAlerts",
                label: "Market Alerts",
                description: "Price alerts and significant market movements",
              },
              {
                key: "dailySummary",
                label: "Daily Summary",
                description: "Daily trading performance summary",
              },
              {
                key: "systemAlerts",
                label: "System Alerts",
                description: "Important system notifications and errors",
              },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg">
                <div className="space-y-1">
                  <p className="text-white font-medium">{setting.label}</p>
                  <p className="text-sm text-gray-400">{setting.description}</p>
                </div>
                <Switch
                  checked={notifications[setting.key as keyof typeof notifications]}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [setting.key]: checked }))}
                  className="data-[state=checked]:bg-[#00D4FF]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Test Alerts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Test Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => sendTestAlert("daily_summary")}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Daily Summary
            </Button>
            <Button
              onClick={() => sendTestAlert("market_alert")}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Market Alert
            </Button>
            <Button
              onClick={() => sendTestAlert("system_alert")}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              System Alert
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-sm text-gray-500 space-y-2 pt-4 border-t border-gray-800">
          <p className="font-medium text-gray-400">Setup Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to your Discord server settings</li>
            <li>Navigate to Integrations → Webhooks</li>
            <li>Create a new webhook and copy the URL</li>
            <li>Paste the URL above and test the connection</li>
            <li>Configure your notification preferences</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
