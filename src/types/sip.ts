export interface SIP {
  number: number;
  title: string;
  status: 'draft' | 'review' | 'accepted' | 'final' | 'withdrawn' | 'living' | 'stagnant' | 'unknown';
  type: 'Standard' | 'Informational' | 'Process';
  category?: 'Core' | 'Framework' | 'Networking' | 'Interface' | 'Application' | 'gas' | 'staking' | 'dev' | 'governance' | 'security';
  author: string;
  created: string;
  description: string;
  content: string;
  filename: string;
  githubUrl: string;
  discussions?: string;
  lastModified?: string;
}

export interface SipMetadata {
  number: number;
  title: string;
  author: string;
  status: string;
  type: string;
  category?: string;
  created: string;
  discussions?: string;
  description: string;
}

export interface SipCardData {
  title: string;
  filename: string;
  content: string;
  description?: string;
  status?: string;
  created?: string;
  category?: string;
  type?: string;
  author?: string;
  discussions?: string;
}

export type SipStatus = 'draft' | 'review' | 'accepted' | 'final' | 'withdrawn' | 'living' | 'stagnant' | 'unknown';

export type SipCategory = 'core' | 'framework' | 'networking' | 'interface' | 'application' | 'gas' | 'staking' | 'dev' | 'governance' | 'security' | 'process' | 'informational';

export type ViewMode = 'grid' | 'list';

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}