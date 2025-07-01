'use client';

import { useState, useEffect } from 'react';
import { Brain, Lightbulb, Code, Target, AlertTriangle, Loader2, Sparkles } from 'lucide-react';

interface AISummary {
  summary: string;
  keyPoints: string[];
  technicalDetails: string;
  impact: string;
  category: string;
}

interface AISummarySectionProps {
  content: string;
}

export function AISummarySection({ content }: AISummarySectionProps) {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/ai-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.fallback) {
            setSummary(data.fallback);
            setError(data.error);
          } else {
            throw new Error(data.error || 'Failed to generate summary');
          }
        } else {
          setSummary(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate AI summary');
        setSummary({
          summary: "AI summary temporarily unavailable. Please view the full proposal below.",
          keyPoints: [],
          technicalDetails: "Technical analysis unavailable",
          impact: "Impact analysis unavailable",
          category: "Unknown"
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();
  }, [content]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">AI Analysis</h2>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-foreground font-medium">Analyzing SIP with AI...</p>
            <p className="text-sm text-muted-foreground">Breaking down complex proposals into digestible insights</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">AI Analysis</h2>
        <Sparkles className="w-5 h-5 text-yellow-400" />
        {summary?.category && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {summary.category}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Limited AI Analysis</p>
              <p className="text-sm text-yellow-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Executive Summary */}
        <div className="md:col-span-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Executive Summary
          </h3>
          <p className="text-muted-foreground leading-relaxed">{summary?.summary}</p>
        </div>

        {/* Key Points */}
        {summary?.keyPoints && summary.keyPoints.length > 0 && (
          <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-foreground">Key Points</h3>
            </div>
            <ul className="space-y-3">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Details */}
        <div className="bg-gray-500/10 rounded-xl p-6 border border-gray-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-foreground">Technical Implementation</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{summary?.technicalDetails}</p>
        </div>

        {/* Impact Analysis */}
        <div className="md:col-span-2 bg-orange-500/10 rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-foreground">Ecosystem Impact</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{summary?.impact}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3" />
          AI analysis powered by OpenAI GPT-4. Summary is generated automatically and may not capture all nuances.
        </p>
      </div>
    </div>
  );
}
