import { GitHubAPI } from './github';
import { parseSIPContent } from './sip-parser';
import { SIP } from '@/types/sip';

export class SIPService {
  private github: GitHubAPI;

  constructor() {
    this.github = new GitHubAPI();
  }

  async getAllSIPs(): Promise<SIP[]> {
    const sips: SIP[] = [];
    
    // Fetch active SIPs
    const activeSIPs = await this.fetchSIPsFromDirectory('sips');
    sips.push(...activeSIPs);
    
    // Fetch withdrawn SIPs
    const withdrawnSIPs = await this.fetchSIPsFromDirectory('withdrawn-sips');
    sips.push(...withdrawnSIPs);
    
    // Sort by SIP number
    return sips.sort((a, b) => a.number - b.number);
  }

  private async fetchSIPsFromDirectory(directory: string): Promise<SIP[]> {
    const files = await this.github.fetchDirectoryContents(directory);
    const sips: SIP[] = [];
    
    // Filter for markdown files
    const sipFiles = files.filter(file => 
      file.type === 'file' && 
      file.name.endsWith('.md') && 
      file.name.match(/sip-\d+\.md$/i)
    );
    
    // Fetch content for each SIP file
    for (const file of sipFiles) {
      const content = await this.github.fetchFileContent(file.path);
      if (content) {
        const githubUrl = this.github.getGitHubUrl(file.path);
        const sip = parseSIPContent(content, file.name, githubUrl);
        if (sip) {
          sips.push(sip);
        }
      }
    }
    
    return sips;
  }

  async getSIPByNumber(number: number): Promise<SIP | null> {
    const allSips = await this.getAllSIPs();
    return allSips.find(sip => sip.number === number) || null;
  }
}