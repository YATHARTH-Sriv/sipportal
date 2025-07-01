import Link from "next/link";
import { ExternalLink, FileText, Calendar, Tag, Sparkles } from "lucide-react";
import { SipCardData, ViewMode } from "@/types/sip";

interface SipCardProps {
  sip: SipCardData;
  viewMode?: ViewMode;
  category?: string;
}

const CATEGORY_CONFIG = {
  core: { label: 'Core Protocol', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  framework: { label: 'Framework', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  gas: { label: 'Gas & Fees', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  staking: { label: 'Staking', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  dev: { label: 'Developer Tools', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  governance: { label: 'Governance', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  security: { label: 'Security', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  networking: { label: 'Networking', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  interface: { label: 'Interface', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  application: { label: 'Application', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  process: { label: 'Process', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  informational: { label: 'Informational', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
};

export function SipCard({ sip, viewMode = 'grid', category = 'core' }: SipCardProps) {
  // Extract SIP number from filename (e.g., "sip-1.md" -> "SIP-1")
  const sipNumber = sip.filename.match(/sip-(\d+)/)?.[1] || '';
  
  // Use enhanced metadata from API response
  const createdDate = sip.created ? new Date(sip.created).toLocaleDateString() : null;
  const status = sip.status || 'Unknown';
  const description = sip.description || sip.content.slice(0, 200) + '...';
  const sipCategory = sip.category || category;
  
  // Get status color for dark theme
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'accepted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'draft': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'review': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'withdrawn': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'living': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'stagnant': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const categoryConfig = CATEGORY_CONFIG[sipCategory as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.core;

  if (viewMode === 'list') {
    return (
      <div className="group bg-gradient-to-br from-[#0a2540]/80 to-[#6ee7b7]/10 rounded-2xl border border-blue-700/30 p-6 hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                SIP-{sipNumber}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                {status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryConfig.color}`}>
                {categoryConfig.label}
              </span>
              {createdDate && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {createdDate}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {sip.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{description}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <Link
              href={`/sip/${sip.filename}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              AI Summary
            </Link>
            <a
              href={`https://github.com/sui-foundation/sips/blob/main/sips/${sip.filename}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted/10 border border-border rounded-lg hover:bg-muted/20 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>
            {sip.discussions && (
              <a
                href={sip.discussions}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                Discussion
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-gradient-to-br from-[#0a2540]/80 to-[#6ee7b7]/10 rounded-2xl border border-blue-700/30 p-6 hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
          SIP-{sipNumber}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryConfig.color}`}>
          <Tag className="w-3 h-3" />
          {categoryConfig.label}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {sip.title}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">{description}</p>
      
      {createdDate && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <Calendar className="w-3 h-3" />
          <span>Created {createdDate}</span>
        </div>
      )}
      
      <div className="flex gap-3">
        <Link
          href={`/sip/${sip.filename}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          AI Summary
        </Link>
        <a
          href={`https://github.com/sui-foundation/sips/blob/main/sips/${sip.filename}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground bg-muted/10 border border-border rounded-xl hover:bg-muted/20 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-4 h-4" />
          GitHub
        </a>
        {sip.discussions && (
          <a
            href={sip.discussions}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
            Join Discussion
          </a>
        )}
      </div>
    </div>
  );
}