import matter from 'gray-matter';
import { SIP } from '@/types/sip';

export function parseSIPContent(content: string, filename: string, githubUrl: string): SIP | null {
  try {
    const { data: frontmatter, content: markdownContent } = matter(content);
    
    // Extract SIP number from filename (e.g., "sip-6.md" -> 6)
    const sipNumberMatch = filename.match(/sip-(\d+)\.md$/i);
    const sipNumber = sipNumberMatch ? parseInt(sipNumberMatch[1]) : 0;
    
    // Extract description from content (first paragraph after frontmatter)
    const contentLines = markdownContent.trim().split('\n');
    let description = '';
    
    for (const line of contentLines) {
      if (line.trim() && !line.startsWith('#')) {
        description = line.trim();
        break;
      }
    }
    
    return {
      number: sipNumber,
      title: frontmatter.title || `SIP-${sipNumber}`,
      status: frontmatter.status || 'Draft',
      type: frontmatter.type || 'Standard',
      category: frontmatter.category,
      author: frontmatter.author || 'Unknown',
      created: frontmatter.created || '',
      description: description || frontmatter.description || '',
      content: markdownContent,
      githubUrl,
      discussions: frontmatter.discussions
    };
  } catch (error) {
    console.error('Error parsing SIP content:', error);
    return null;
  }
}
