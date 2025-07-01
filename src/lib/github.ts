import { GitHubFile } from "@/types/sip";

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'sui-foundation';
const REPO_NAME = 'sips';

export class GitHubAPI {
  private headers: Record<string, string>;

  constructor() {
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SIPs-Community-Hub'
    };

    // Add GitHub token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      this.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
  }

  async fetchDirectoryContents(path: string): Promise<GitHubFile[]> {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
    
    try {
      const response = await fetch(url, { 
        headers: this.headers,
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching directory contents:', error);
      return [];
    }
  }

  async fetchFileContent(path: string): Promise<string> {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
    
    try {
      const response = await fetch(url, { 
        headers: this.headers,
        next: { revalidate: 3600 }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Decode base64 content
      if (data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }
      
      return '';
    } catch (error) {
      console.error('Error fetching file content:', error);
      return '';
    }
  }

  getGitHubUrl(path: string): string {
    return `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/${path}`;
  }
}