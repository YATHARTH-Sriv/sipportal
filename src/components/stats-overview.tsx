'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, FileText, GitBranch } from 'lucide-react';

interface SipStats {
  total: number;
  final: number;
  draft: number;
  review: number;
  accepted: number;
}

export function StatsOverview() {
  const [stats, setStats] = useState<SipStats>({
    total: 0,
    final: 0,
    draft: 0,
    review: 0,
    accepted: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/sips');
        const sips = await response.json();
        
        const statsData = sips.reduce((acc: SipStats, sip: any) => {
          acc.total++;
          const status = sip.content.match(/status:\s*(\w+)/i)?.[1]?.toLowerCase() || 'unknown';
          
          switch (status) {
            case 'final':
              acc.final++;
              break;
            case 'draft':
              acc.draft++;
              break;
            case 'review':
              acc.review++;
              break;
            case 'accepted':
              acc.accepted++;
              break;
          }
          
          return acc;
        }, { total: 0, final: 0, draft: 0, review: 0, accepted: 0 });
        
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-2xl border border-border">
                <div className="w-8 h-8 bg-muted rounded-full mx-auto mb-3 shimmer"></div>
                <div className="h-8 bg-muted rounded mb-2 shimmer"></div>
                <div className="h-4 bg-muted rounded shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const statItems = [
    {
      label: 'Total SIPs',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Final',
      value: stats.final,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'In Review',
      value: stats.review,
      icon: GitBranch,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Draft',
      value: stats.draft,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <section className="py-12 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">SIP Overview</h2>
          <p className="text-muted-foreground">Current status of all Sui Improvement Proposals</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="text-center p-6 bg-card rounded-2xl border border-border hover:bg-accent/50 transition-colors duration-200"
              >
                <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {item.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
