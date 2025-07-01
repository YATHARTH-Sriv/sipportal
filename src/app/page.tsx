import { Suspense } from "react";
import { SipList } from "@/components/sip-list";
import { Hero } from "@/components/hero";
import { StatsOverview } from "@/components/stats-overview";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-background to-purple-900/20 relative">
      {/* Apply the same gradient background to all sections */}
      {/* Hero Section */}
      <Hero />

      {/* Stats Overview */}
      <Suspense fallback={<div className="h-24"></div>}>
        <StatsOverview />
      </Suspense>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium">Loading SIP Portal...</p>
            </div>
          </div>
        }>
          <SipList />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-transparent flex flex-col items-center gap-2 text-xs text-blue-200/80">
        <span>Community SIP Portal</span>
        <span className="opacity-60">SIP Portal &copy; {new Date().getFullYear()}</span>
      </footer>

    </div>
  );
}