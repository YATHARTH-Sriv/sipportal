import { ArrowRight, Github, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Community-driven SIP Hub
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Sui Improvement</span>
            <br />
            <span className="text-foreground">Proposals</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl font-medium text-muted-foreground">
              Made Simple
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Your gateway to understanding the evolution of Sui blockchain. 
            Explore protocol changes, improvements, and the future of Sui with 
            AI-powered summaries and community insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="#sips"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Explore SIPs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://github.com/sui-foundation/sips"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="flex flex-col items-center p-6 bg-card/50 backdrop-blur border border-border rounded-2xl">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground text-center text-sm">
                Complex technical proposals broken down into digestible summaries for everyone
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-card/50 backdrop-blur border border-border rounded-2xl">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Community Focus</h3>
              <p className="text-muted-foreground text-center text-sm">
                Built for the community, by the community. Making SIPs accessible to all
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-card/50 backdrop-blur border border-border rounded-2xl">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground text-center text-sm">
                Stay up-to-date with the latest proposals and protocol changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
