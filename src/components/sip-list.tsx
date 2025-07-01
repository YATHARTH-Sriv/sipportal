'use client';

import { useEffect, useState } from "react";
import { SipCard } from "./sip-card";
import { Search, Filter, Grid, List, Tags } from "lucide-react";
import { SipCardData } from "@/types/sip";

const CATEGORIES = [
  { id: 'all', label: 'All SIPs', color: 'bg-blue-500/10 text-blue-400' },
  { id: 'core', label: 'Core Protocol', color: 'bg-red-500/10 text-red-400' },
  { id: 'framework', label: 'Framework', color: 'bg-red-500/10 text-red-400' },
  { id: 'gas', label: 'Gas & Fees', color: 'bg-green-500/10 text-green-400' },
  { id: 'staking', label: 'Staking', color: 'bg-purple-500/10 text-purple-400' },
  { id: 'dev', label: 'Developer Tools', color: 'bg-yellow-500/10 text-yellow-400' },
  { id: 'governance', label: 'Governance', color: 'bg-indigo-500/10 text-indigo-400' },
  { id: 'security', label: 'Security', color: 'bg-orange-500/10 text-orange-400' },
  { id: 'networking', label: 'Networking', color: 'bg-blue-500/10 text-blue-400' },
  { id: 'interface', label: 'Interface', color: 'bg-cyan-500/10 text-cyan-400' },
  { id: 'application', label: 'Application', color: 'bg-teal-500/10 text-teal-400' },
];

const STATUS_FILTERS = [
  { id: 'all', label: 'All Status' },
  { id: 'final', label: 'Final' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'review', label: 'In Review' },
  { id: 'draft', label: 'Draft' },
  { id: 'living', label: 'Living' },
  { id: 'stagnant', label: 'Stagnant' },
  { id: 'withdrawn', label: 'Withdrawn' },
];

export function SipList() {
  const [sips, setSips] = useState<SipCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/sips")
      .then((res) => res.json())
      .then((data) => {
        setSips(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const categorizeContent = (content: string): string => {
    const contentLower = content.toLowerCase();
    if (contentLower.includes('staking') || contentLower.includes('validator') || contentLower.includes('delegation')) return 'staking';
    if (contentLower.includes('gas') || contentLower.includes('fee') || contentLower.includes('cost')) return 'gas';
    if (contentLower.includes('security') || contentLower.includes('cryptography') || contentLower.includes('signature') || contentLower.includes('vulnerability')) return 'security';
    if (contentLower.includes('governance') || contentLower.includes('voting') || contentLower.includes('proposal')) return 'governance';
    if (contentLower.includes('networking') || contentLower.includes('network') || contentLower.includes('p2p') || contentLower.includes('mempool')) return 'networking';
    if (contentLower.includes('rpc') || contentLower.includes('api') || contentLower.includes('interface') || contentLower.includes('specification')) return 'interface';
    if (contentLower.includes('framework') || contentLower.includes('move') || contentLower.includes('standard') || contentLower.includes('primitive')) return 'framework';
    if (contentLower.includes('application') || contentLower.includes('dapp') || contentLower.includes('contract')) return 'application';
    if (contentLower.includes('developer') || contentLower.includes('tool') || contentLower.includes('sdk')) return 'dev';
    if (contentLower.includes('core') || contentLower.includes('consensus') || contentLower.includes('protocol')) return 'core';
    return 'core'; // default to core
  };

  const getStatusFromContent = (content: string): string => {
    const statusMatch = content.match(/status:\s*(\w+)/i);
    return statusMatch?.[1]?.toLowerCase() || 'unknown';
  };

  const filteredSips = sips.filter(sip => {
    const matchesSearch = sip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sip.description || sip.content).toLowerCase().includes(searchTerm.toLowerCase());
    
    const sipCategory = sip.category || categorizeContent(sip.content);
    const matchesCategory = selectedCategory === 'all' || sipCategory === selectedCategory;
    
    const sipStatus = sip.status?.toLowerCase() || getStatusFromContent(sip.content);
    const matchesStatus = selectedStatus === 'all' || sipStatus === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return (
      <div id="sips" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Explore SIPs</h2>
          <p className="text-muted-foreground">Loading the latest Sui Improvement Proposals...</p>
        </div>
        
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
              <div className="h-6 bg-muted rounded-md mb-4 w-3/4 shimmer"></div>
              <div className="h-4 bg-muted rounded-md mb-2 w-1/2 shimmer"></div>
              <div className="h-4 bg-muted rounded-md mb-4 w-full shimmer"></div>
              <div className="flex gap-4">
                <div className="h-8 bg-muted rounded-md w-20 shimmer"></div>
                <div className="h-8 bg-muted rounded-md w-20 shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="sips" className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Explore SIPs</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover and understand Sui Improvement Proposals with our AI-powered summaries and categorization
        </p>
      </div>

      {/* Controls */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search SIPs by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Category Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tags className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Categories</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? category.color
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {STATUS_FILTERS.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredSips.length} SIP{filteredSips.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          <div className="flex items-center bg-muted/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SIPs Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
          : "space-y-4"
      }>
        {filteredSips.map((sip) => (
          <SipCard 
            key={sip.filename} 
            sip={sip} 
            viewMode={viewMode}
            category={sip.category || categorizeContent(sip.content)}
          />
        ))}
      </div>

      {filteredSips.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="bg-card rounded-2xl border border-border p-8">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No SIPs found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
          </div>
        </div>
      )}
    </div>
  );
}