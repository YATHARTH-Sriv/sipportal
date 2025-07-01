import Image from "next/image";
import { Suspense } from "react";
import { SipList } from "@/components/sip-list";
import { Hero } from "@/components/hero";
import { StatsOverview } from "@/components/stats-overview";
// import { StatsOverview } from "@/components/stats-overview";
// import { Hero } from "@/components/hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2540] via-[#1a365d] to-[#0e223a] relative">
      {/* Sui Logo Top Left */}
      <div className="absolute left-4 top-4 z-20">
        <Image src="/sui-logo.svg" alt="Sui Logo" width={48} height={48} className="drop-shadow-lg" />
      </div>
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

      {/* Sui Footer */}
      <footer className="w-full py-6 bg-transparent flex flex-col items-center gap-2 text-xs text-blue-200/80">
        <div className="flex items-center gap-2">
          <Image src="/sui-logo.svg" alt="Sui Logo" width={24} height={24} />
          <span>Powered by Sui</span>
        </div>
        <span className="opacity-60">Community SIP Portal &copy; {new Date().getFullYear()}</span>
      </footer>

      {/* Subtle Sui background shapes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg width="100%" height="100%" className="absolute left-0 top-0 opacity-10" viewBox="0 0 1440 320"><path fill="#6ee7b7" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
      </div>
    </div>
  );
}