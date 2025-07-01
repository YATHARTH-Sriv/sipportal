import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        fallback: {
          summary: "AI summary unavailable. Please configure OpenAI API key.",
          keyPoints: [],
          technicalDetails: "OpenAI integration not configured.",
          impact: "Unable to analyze impact without AI assistance."
        }
      }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing Sui Improvement Proposals (SIPs). 
          Your task is to break down complex technical proposals into digestible, well-structured summaries.
          
          Respond with a JSON object containing:
          1. "summary" - A 2-3 sentence executive summary for non-technical users
          2. "keyPoints" - An array of 3-5 key points or changes this SIP introduces
          3. "technicalDetails" - A paragraph explaining the technical implementation
          4. "impact" - A paragraph about the potential impact on the Sui ecosystem
          5. "category" - The type of proposal (e.g., "Protocol Enhancement", "Developer Tools", "Governance", etc.)
          
          Make it accessible to both technical and non-technical audiences.`
        },
        {
          role: "user",
          content: `Please analyze this Sui Improvement Proposal and provide a structured breakdown:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(responseText || '{}');
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      // If JSON parsing fails, return a fallback structure
      return NextResponse.json({
        summary: responseText || "Unable to generate summary",
        keyPoints: [],
        technicalDetails: "Technical analysis unavailable",
        impact: "Impact analysis unavailable",
        category: "Unknown"
      });
    }

  } catch (error) {
    console.error('Error generating AI summary:', error);
    return NextResponse.json({ 
      error: 'Failed to generate AI summary',
      fallback: {
        summary: "AI analysis temporarily unavailable. Please try again later.",
        keyPoints: [],
        technicalDetails: "Technical analysis unavailable due to processing error.",
        impact: "Impact analysis unavailable due to processing error.",
        category: "Unknown"
      }
    }, { status: 500 });
  }
}
