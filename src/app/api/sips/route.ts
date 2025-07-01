import { NextResponse } from "next/server";

interface SipMetadata {
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

function extractSipMetadata(content: string, filename: string): SipMetadata {
  // Extract SIP number from filename
  const sipNumber = parseInt(filename.match(/sip-(\d+)/)?.[1] || '0');
  
  // Try to parse metadata table first (more reliable)
  let metadata: any = {};
  const tableMatch = content.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g);
  if (tableMatch) {
    tableMatch.forEach(row => {
      const match = row.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/);
      if (match) {
        const key = match[1].trim().toLowerCase().replace(/[^a-z]/g, '');
        const value = match[2].trim();
        if (key && value && value !== ':---' && value !== '---:') {
          metadata[key] = value;
        }
      }
    });
  }
  
  // Try to parse YAML frontmatter as fallback
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch && Object.keys(metadata).length === 0) {
    const frontmatter = frontmatterMatch[1];
    const lines = frontmatter.split('\n');
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        metadata[key.trim().toLowerCase()] = valueParts.join(':').trim().replace(/['"]/g, '');
      }
    });
  }
  
  // Extract title from metadata or content
  let title = metadata.title || '';
  if (!title) {
    const titleMatch = content.match(/(?:^|\n)#\s+(.+)/) || 
                      content.match(/Title:\s*(.+)/i) ||
                      content.match(/sip:\s*\d+\s*-\s*(.+)/i);
    title = titleMatch?.[1]?.trim() || filename.replace('.md', '');
  }
  
  // Extract and enhance description for better readability
  let description = metadata.description || '';
  
  // Try to get description from Abstract section (most reliable)
  if (!description) {
    const abstractMatch = content.match(/## Abstract\s*\n\n([\s\S]*?)(?:\n\n##|\n\n$|$)/i);
    if (abstractMatch) {
      description = abstractMatch[1]
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }
  
  // Fallback to other sections
  if (!description) {
    const motivationMatch = content.match(/## Motivation\s*\n\n([\s\S]*?)(?:\n\n##|\n\n$|$)/i);
    if (motivationMatch) {
      description = motivationMatch[1]
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }
  
  // If still no description, try first meaningful paragraph
  if (!description) {
    const paragraphs = content.split('\n\n');
    for (const para of paragraphs) {
      const cleanPara = para.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
      if (cleanPara.length > 100 && 
          !cleanPara.startsWith('#') && 
          !cleanPara.includes('|') && 
          !cleanPara.match(/^\w+:\s/) &&
          !cleanPara.startsWith('```')) {
        description = cleanPara;
        break;
      }
    }
  }
  
  // Make description more beginner-friendly and concise
  if (description) {
    description = description
      .replace(/This SIP /gi, 'This proposal ')
      .replace(/SIP-\d+/g, 'this proposal')
      .replace(/\b[A-Z]{3,}\b/g, (match: string) => {
        // Expand common acronyms
        const expansions: {[key: string]: string} = {
          'POS': 'Proof-of-Stake',
          'RPC': 'Remote Procedure Call',
          'API': 'Application Programming Interface',
          'JWK': 'JSON Web Key',
          'JWT': 'JSON Web Token'
        };
        return expansions[match] || match;
      })
      .substring(0, 300);
    
    if (description.length === 300) {
      description += '...';
    }
  }
  
  // Determine category based on content analysis
  let category = metadata.category?.toLowerCase() || '';
  if (!category) {
    const contentLower = content.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Check for specific SIP categories as defined in SIP-1
    if (contentLower.includes('staking') || contentLower.includes('validator') || contentLower.includes('delegation') || titleLower.includes('staking')) {
      category = 'staking';
    } else if (contentLower.includes('gas') || contentLower.includes('fee') || contentLower.includes('cost') || titleLower.includes('gas')) {
      category = 'gas';
    } else if (contentLower.includes('security') || contentLower.includes('cryptography') || contentLower.includes('signature') || contentLower.includes('vulnerability')) {
      category = 'security';
    } else if (contentLower.includes('governance') || contentLower.includes('voting') || contentLower.includes('proposal') || titleLower.includes('governance')) {
      category = 'governance';
    } else if (contentLower.includes('networking') || contentLower.includes('network') || contentLower.includes('p2p') || contentLower.includes('mempool')) {
      category = 'networking';
    } else if (contentLower.includes('rpc') || contentLower.includes('api') || contentLower.includes('interface') || contentLower.includes('specification')) {
      category = 'interface';
    } else if (contentLower.includes('framework') || contentLower.includes('move') || contentLower.includes('standard') || contentLower.includes('primitive')) {
      category = 'framework';
    } else if (contentLower.includes('application') || contentLower.includes('dapp') || contentLower.includes('contract')) {
      category = 'application';
    } else if (contentLower.includes('developer') || contentLower.includes('tool') || contentLower.includes('sdk') || titleLower.includes('tool')) {
      category = 'dev';
    } else if (contentLower.includes('core') || contentLower.includes('consensus') || contentLower.includes('protocol')) {
      category = 'core';
    } else {
      // Default based on SIP type
      const sipType = metadata.type?.toLowerCase() || '';
      if (sipType === 'process') {
        category = 'governance';
      } else if (sipType === 'informational') {
        category = 'informational';
      } else {
        category = 'core'; // Default for Standard SIPs
      }
    }
  }
  
  return {
    number: sipNumber,
    title: title || `SIP-${sipNumber}`,
    author: metadata.author || metadata.authors || content.match(/authors?:\s*(.+)/i)?.[1] || 'Unknown',
    status: metadata.status || content.match(/status:\s*(\w+)/i)?.[1] || 'Unknown',
    type: metadata.type || content.match(/type:\s*(\w+)/i)?.[1] || 'Standard',
    category: category || 'core',
    created: metadata.created || content.match(/created:\s*(\d{4}-\d{2}-\d{2})/i)?.[1] || '',
    discussions: metadata.discussions || metadata.commentsuri || content.match(/discussions?:\s*(.+)/i)?.[1],
    description: description || 'A Sui Improvement Proposal that enhances the Sui blockchain ecosystem.'
  };
}

export async function GET() {
  try {
    // Fetch the repository contents to get all SIP files
    const res = await fetch(
      "https://api.github.com/repos/sui-foundation/sips/contents/sips",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const files = await res.json();
    
    // Filter for markdown files and sort by SIP number
    const markdownFiles = files
      .filter((f: any) => f.name.endsWith(".md") && f.name.startsWith("sip-"))
      .sort((a: any, b: any) => {
        const aNum = parseInt(a.name.match(/sip-(\d+)/)?.[1] || '0');
        const bNum = parseInt(b.name.match(/sip-(\d+)/)?.[1] || '0');
        return bNum - aNum; // Sort by SIP number descending (newest first)
      });

    console.log(`Found ${markdownFiles.length} SIP files`);

    // Fetch content for all SIP files (with concurrency limit to avoid rate limits)
    const batchSize = 5;
    const sips: (SipMetadata & {
      filename: string;
      content: string;
      githubUrl: string;
      lastModified: string;
    })[] = [];
    
    for (let i = 0; i < markdownFiles.length; i += batchSize) {
      const batch = markdownFiles.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (file: any) => {
          try {
            const contentRes = await fetch(file.download_url);
            if (!contentRes.ok) {
              throw new Error(`Failed to fetch ${file.name}: ${contentRes.status}`);
            }
            
            const content = await contentRes.text();
            const metadata = extractSipMetadata(content, file.name);
            
            return {
              ...metadata,
              filename: file.name,
              content: content,
              githubUrl: `https://github.com/sui-foundation/sips/blob/main/sips/${file.name}`,
              lastModified: file.sha
            };
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            // Return a fallback object for failed files
            return {
              number: parseInt(file.name.match(/sip-(\d+)/)?.[1] || '0'),
              title: file.name.replace('.md', ''),
              author: 'Unknown',
              status: 'Unknown',
              type: 'Standard',
              created: '',
              description: 'Failed to load content',
              filename: file.name,
              content: '',
              githubUrl: `https://github.com/sui-foundation/sips/blob/main/sips/${file.name}`,
              lastModified: file.sha
            };
          }
        })
      );
      
      // Add successful results to the sips array
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          sips.push(result.value);
        }
      });
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < markdownFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Successfully processed ${sips.length} SIPs`);
    
    return NextResponse.json(sips);
    
  } catch (error) {
    console.error('Error fetching SIPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SIPs', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}