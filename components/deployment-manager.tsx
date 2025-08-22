"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Rocket, 
  Settings, 
  Monitor, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Copy,
  Server,
  Database,
  Shield,
  Zap,
  Activity,
  Globe,
  Key,
  RefreshCw,
  Play,
  Pause,
  Square
} from "lucide-react"
import type { BuilderComponent, WorkflowConnection } from "./no-code-builder"

interface DeploymentConfig {
  name: string
  description: string
  environment: "staging" | "production"
  region: string
  autoScale: boolean
  monitoring: boolean
  backup: boolean
}

interface DeploymentStatus {
  id: string
  name: string
  status: "deploying" | "running" | "stopped" | "error"
  url?: string
  lastDeployed: Date
  version: string
  uptime: string
  requests: number
  errors: number
}

interface DeploymentManagerProps {
  components: BuilderComponent[]
  connections: WorkflowConnection[]
  onClose: () => void
}

export function DeploymentManager({ components, connections, onClose }: DeploymentManagerProps) {
  const [activeTab, setActiveTab] = useState("deploy")
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    name: "my-hyperliquid-app",
    description: "My Hyperliquid application",
    environment: "staging",
    region: "us-east-1",
    autoScale: true,
    monitoring: true,
    backup: true
  })
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([
    {
      id: "prod-1",
      name: "Production App",
      status: "running",
      url: "https://my-app.hypereasy.app",
      lastDeployed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      version: "v1.2.3",
      uptime: "99.9%",
      requests: 15420,
      errors: 3
    },
    {
      id: "staging-1", 
      name: "Staging Environment",
      status: "running",
      url: "https://staging.my-app.hypereasy.app",
      lastDeployed: new Date(Date.now() - 30 * 60 * 1000),
      version: "v1.3.0-beta",
      uptime: "100%",
      requests: 892,
      errors: 0
    }
  ])

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentProgress(0)

    // Simulate deployment process
    const steps = [
      { message: "Validating configuration...", progress: 10 },
      { message: "Building application...", progress: 30 },
      { message: "Deploying to cloud...", progress: 60 },
      { message: "Setting up monitoring...", progress: 80 },
      { message: "Starting services...", progress: 95 },
      { message: "Deployment complete!", progress: 100 }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDeploymentProgress(step.progress)
    }

    // Add new deployment
    const newDeployment: DeploymentStatus = {
      id: `deploy-${Date.now()}`,
      name: deploymentConfig.name,
      status: "running",
      url: `https://${deploymentConfig.name}.hypereasy.app`,
      lastDeployed: new Date(),
      version: "v1.0.0",
      uptime: "100%",
      requests: 0,
      errors: 0
    }

    setDeployments(prev => [newDeployment, ...prev])
    setIsDeploying(false)
    setDeploymentProgress(0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-green-400 bg-green-400/10 border-green-400"
      case "deploying": return "text-blue-400 bg-blue-400/10 border-blue-400"
      case "stopped": return "text-gray-400 bg-gray-400/10 border-gray-400"
      case "error": return "text-red-400 bg-red-400/10 border-red-400"
      default: return "text-gray-400 bg-gray-400/10 border-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <CheckCircle className="w-4 h-4" />
      case "deploying": return <RefreshCw className="w-4 h-4 animate-spin" />
      case "stopped": return <Square className="w-4 h-4" />
      case "error": return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#00D4FF]">Deployment Manager</h3>
          <p className="text-sm text-gray-400">Deploy and manage your Hyperliquid applications</p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          ×
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-[#2A2A2A]">
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Deploy Tab */}
        <TabsContent value="deploy" className="space-y-4">
          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#00D4FF]" />
              Deploy New Version
            </h4>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm text-gray-300">App Name</Label>
                <Input
                  value={deploymentConfig.name}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-300">Environment</Label>
                <select
                  value={deploymentConfig.environment}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, environment: e.target.value as "staging" | "production" }))}
                  className="w-full mt-1 px-3 py-2 bg-[#1A1A1A] border border-[#444] rounded-md text-white"
                  title="Select deployment environment"
                >
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <Label className="text-sm text-gray-300">Description</Label>
              <Input
                value={deploymentConfig.description}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
                placeholder="Describe this deployment..."
              />
            </div>

            {/* Deployment Features */}
            <div className="space-y-3 mb-6">
              <h5 className="text-sm font-medium text-gray-300">Deployment Features</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#444] rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Auto-scaling</div>
                    <div className="text-xs text-gray-400">Scale based on demand</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#444] rounded-lg">
                  <Monitor className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Monitoring</div>
                    <div className="text-xs text-gray-400">Real-time metrics</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#444] rounded-lg">
                  <Database className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Backups</div>
                    <div className="text-xs text-gray-400">Automatic backups</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#444] rounded-lg">
                  <Shield className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Security</div>
                    <div className="text-xs text-gray-400">SSL & DDoS protection</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deployment Progress */}
            {isDeploying && (
              <div className="mb-4 p-4 bg-[#1A1A1A] border border-[#444] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-[#00D4FF] animate-spin" />
                  <span className="text-sm font-medium text-white">Deploying...</span>
                </div>
                <Progress value={deploymentProgress} className="h-2" />
                <div className="text-xs text-gray-400 mt-1">{deploymentProgress}% complete</div>
              </div>
            )}

            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full bg-[#00D4FF] hover:bg-[#00B8E6] text-black font-semibold"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {isDeploying ? "Deploying..." : "Deploy Application"}
            </Button>
          </Card>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage" className="space-y-4">
          <div className="space-y-3">
            {deployments.map((deployment) => (
              <Card key={deployment.id} className="p-4 bg-[#2A2A2A] border-[#444]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deployment.status)}
                      <h4 className="font-semibold text-white">{deployment.name}</h4>
                    </div>
                    <Badge className={getStatusColor(deployment.status)}>
                      {deployment.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-[#666] text-gray-300">
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-[#666] text-gray-300">
                      <Pause className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-[#666] text-gray-300">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white ml-2">{deployment.version}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-green-400 ml-2">{deployment.uptime}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Requests:</span>
                    <span className="text-white ml-2">{deployment.requests.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Errors:</span>
                    <span className={`ml-2 ${deployment.errors > 0 ? "text-red-400" : "text-green-400"}`}>
                      {deployment.errors}
                    </span>
                  </div>
                </div>

                {deployment.url && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#444]">
                    <Globe className="w-4 h-4 text-[#00D4FF]" />
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00D4FF] hover:underline text-sm flex-1"
                    >
                      {deployment.url}
                    </a>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Monitor Tab */}
        <TabsContent value="monitor" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-[#2A2A2A] border-[#444]">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <h4 className="font-medium text-white">System Health</h4>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">98.5%</div>
              <div className="text-xs text-gray-400">Overall uptime</div>
            </Card>

            <Card className="p-4 bg-[#2A2A2A] border-[#444]">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-blue-400" />
                <h4 className="font-medium text-white">Response Time</h4>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">245ms</div>
              <div className="text-xs text-gray-400">Average response</div>
            </Card>

            <Card className="p-4 bg-[#2A2A2A] border-[#444]">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <h4 className="font-medium text-white">Requests/min</h4>
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">1,247</div>
              <div className="text-xs text-gray-400">Current load</div>
            </Card>

            <Card className="p-4 bg-[#2A2A2A] border-[#444]">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h4 className="font-medium text-white">Error Rate</h4>
              </div>
              <div className="text-2xl font-bold text-red-400 mb-1">0.02%</div>
              <div className="text-xs text-gray-400">Last 24 hours</div>
            </Card>
          </div>

          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h4 className="font-medium text-white mb-3">Recent Activity</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Deployment v1.2.3 completed successfully</span>
                <span className="text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <RefreshCw className="w-3 h-3" />
                <span>Auto-scaling triggered (2 → 4 instances)</span>
                <span className="text-gray-500 ml-auto">3 hours ago</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-3 h-3" />
                <span>High memory usage detected (85%)</span>
                <span className="text-gray-500 ml-auto">6 hours ago</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#00D4FF]" />
              API Keys & Secrets
            </h4>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-gray-300">Hyperliquid API Key</Label>
                <Input 
                  type="password" 
                  value="••••••••••••••••"
                  className="mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label className="text-sm text-gray-300">Discord Webhook URL</Label>
                <Input 
                  type="password" 
                  value="••••••••••••••••"
                  className="mt-1"
                  readOnly
                />
              </div>
              <Button size="sm" variant="outline" className="border-[#666] text-gray-300">
                Update Secrets
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h4 className="font-medium text-white mb-4">Environment Variables</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                <span className="text-gray-300">NODE_ENV</span>
                <span className="text-[#00D4FF]">production</span>
              </div>
              <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                <span className="text-gray-300">PORT</span>
                <span className="text-[#00D4FF]">3000</span>
              </div>
              <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                <span className="text-gray-300">LOG_LEVEL</span>
                <span className="text-[#00D4FF]">info</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
