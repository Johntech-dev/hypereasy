"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, BookOpen, BarChart3, Settings, Code } from "lucide-react"
import { SDKDocumentation } from "./sdk-documentation"

export function Header() {
  const [showSDKDocs, setShowSDKDocs] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-chart-2 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HyperEasy</span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Builder
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/integrations" className="text-muted-foreground hover:text-primary transition-colors">
                Integrations
              </Link>
              <button 
                onClick={() => setShowSDKDocs(true)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                SDK
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSDKDocs(true)}
                className="text-muted-foreground hover:text-primary"
              >
                <Code className="w-4 h-4 mr-2" />
                SDK Docs
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/docs" className="text-muted-foreground hover:text-primary">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Help
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://github.com/yourusername/hypereasy"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Github className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* SDK Documentation Modal */}
      {showSDKDocs && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl h-[90vh] bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
            <div className="p-6 h-full overflow-y-auto">
              <SDKDocumentation onClose={() => setShowSDKDocs(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
