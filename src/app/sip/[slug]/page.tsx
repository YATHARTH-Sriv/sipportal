import { notFound } from "next/navigation";
import { marked } from "marked";
import { Suspense } from "react";
import { AISummarySection } from "@/components/ai-summary-section";
import { ArrowLeft, ExternalLink, Calendar, User, Tag, Sparkles } from "lucide-react";
import Link from "next/link";


marked.setOptions({
  breaks: true,
  gfm: true,
});

async function getSipData(slug: string) {
  try {
    
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sips`, {
      cache: 'no-store'
    });
    
    if (apiRes.ok) {
      const sips = await apiRes.json();
      const sip = sips.find((s: any) => s.filename === slug);
      if (sip) {
        return sip;
      }
    }
  } catch (error) {
    console.error('Error fetching from API:', error);
  }

  // Fallback to direct GitHub fetch
  const res = await fetch(`https://raw.githubusercontent.com/sui-foundation/sips/main/sips/${slug}`, {
    cache: 'no-store'
  });

  if (!res.ok) return null;
  
  const content = await res.text();
  return {
    content,
    filename: slug,
    title: extractTitleFromContent(content),
    // Add basic metadata extraction as fallback
    status: content.match(/status:\s*(\w+)/i)?.[1] || 'Unknown',
    author: content.match(/authors?:\s*(.+)/i)?.[1] || 'Unknown',
    created: content.match(/created:\s*(\d{4}-\d{2}-\d{2})/i)?.[1] || null,
    type: content.match(/type:\s*(\w+)/i)?.[1] || 'Standard',
    category: content.match(/category:\s*(\w+)/i)?.[1] || null,
  };
}

function extractTitleFromContent(content: string) {
  const titleMatch = content.match(/(?:^|\n)#\s+(.+)/);
  return titleMatch?.[1] || 'Understanding SIP has never been this easy';
}

export default async function SipDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sipData = await getSipData(slug);

  if (!sipData) return notFound();

  const htmlContent = marked.parse(sipData.content);
  const sipNumber = slug.match(/sip-(\d+)/)?.[1] || '';

  // Get status color for dark theme
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'accepted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'draft': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'review': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'withdrawn': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to SIP Portal</span>
            </Link>
            <a
              href={`https://github.com/sui-foundation/sips/blob/main/sips/${slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* SIP Info Card */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                    SIP-{sipNumber}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(sipData.status || 'Unknown')}`}>
                    {sipData.status || 'Unknown'}
                  </span>
                </div>

                <div className="space-y-4 text-sm">
                  {sipData.author && (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">Author</div>
                        <div className="text-muted-foreground">{sipData.author}</div>
                      </div>
                    </div>
                  )}

                  {sipData.created && (
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">Created</div>
                        <div className="text-muted-foreground">{new Date(sipData.created).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}

                  {sipData.type && (
                    <div className="flex items-start gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">Type</div>
                        <div className="text-muted-foreground">{sipData.type}</div>
                      </div>
                    </div>
                  )}

                  {sipData.category && (
                    <div className="flex items-start gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">Category</div>
                        <div className="text-muted-foreground">{sipData.category}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Quick Navigation
                </h3>
                <nav className="space-y-2 text-sm">
                  <a href="#ai-summary" className="block text-primary hover:text-primary/80 transition-colors">
                    AI Summary
                  </a>
                  <a href="#full-proposal" className="block text-primary hover:text-primary/80 transition-colors">
                    Full Proposal
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Title */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {sipData.title}
              </h1>
              <p className="text-muted-foreground mt-4">
                Understanding this SIP made simple with AI-powered analysis
              </p>
            </div>

            {/* AI Summary */}
            <div id="ai-summary">
              <Suspense fallback={
                <div className="bg-card rounded-2xl border border-border p-8">
                  <div className="animate-pulse">
                    <div className="h-6 bg-muted rounded mb-4 w-1/3 shimmer"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-full shimmer"></div>
                      <div className="h-4 bg-muted rounded w-5/6 shimmer"></div>
                      <div className="h-4 bg-muted rounded w-3/4 shimmer"></div>
                    </div>
                  </div>
                </div>
              }>
                <AISummarySection content={sipData.content} />
              </Suspense>
            </div>

            {/* Full Proposal */}
            <div id="full-proposal" className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6 text-primary" />
                Full Proposal
              </h2>
              <article 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
