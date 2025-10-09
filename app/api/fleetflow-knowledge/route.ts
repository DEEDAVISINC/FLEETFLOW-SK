import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const query = searchParams.get('query');

    // Read the knowledge base file
    const knowledgePath = path.join(
      process.cwd(),
      'FLEETFLOW_COMPREHENSIVE_AI_EXECUTIVE_ASSISTANT_KNOWLEDGE_BASE.md'
    );
    const knowledgeBase = fs.readFileSync(knowledgePath, 'utf8');

    if (section) {
      // Return specific section
      const sections = knowledgeBase.split(/^## /m);
      const requestedSection = sections.find((s) =>
        s.toLowerCase().includes(section.toLowerCase())
      );

      if (requestedSection) {
        return NextResponse.json({
          section: section,
          content: requestedSection.trim(),
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (query) {
      // Simple text search (you can enhance this with semantic search)
      const lines = knowledgeBase.split('\n');
      const relevantLines = lines.filter((line) =>
        line.toLowerCase().includes(query.toLowerCase())
      );

      return NextResponse.json({
        query: query,
        results: relevantLines.slice(0, 20), // Limit results
        totalMatches: relevantLines.length,
        timestamp: new Date().toISOString(),
      });
    }

    // Return full knowledge base
    return NextResponse.json({
      knowledgeBase: knowledgeBase,
      sections: knowledgeBase.split(/^## /m).length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error retrieving knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve knowledge base' },
      { status: 500 }
    );
  }
}

// POST endpoint for structured queries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, staffMember } = body;

    const knowledgePath = path.join(
      process.cwd(),
      'FLEETFLOW_COMPREHENSIVE_AI_EXECUTIVE_ASSISTANT_KNOWLEDGE_BASE.md'
    );
    const knowledgeBase = fs.readFileSync(knowledgePath, 'utf8');

    let results = [];

    // Search by category
    if (category) {
      const categorySection = knowledgeBase.match(
        new RegExp(`## ${category}[\\s\\S]*?(?=## |$)`, 'i')
      );
      if (categorySection) {
        results.push({
          type: 'category',
          category: category,
          content: categorySection[0],
        });
      }
    }

    // Search for specific AI staff member
    if (staffMember) {
      const staffPattern = new RegExp(
        `\\*\\*${staffMember}\\*\\*[\\s\\S]*?(?=\\*\\*[A-Z]|## )`,
        'i'
      );
      const staffInfo = knowledgeBase.match(staffPattern);
      if (staffInfo) {
        results.push({
          type: 'staff',
          name: staffMember,
          content: staffInfo[0],
        });
      }
    }

    // General query search
    if (query && !category && !staffMember) {
      const lines = knowledgeBase.split('\n');
      const relevantLines = lines.filter((line) =>
        line.toLowerCase().includes(query.toLowerCase())
      );

      results.push({
        type: 'search',
        query: query,
        results: relevantLines.slice(0, 15),
        totalMatches: relevantLines.length,
      });
    }

    return NextResponse.json({
      query: body,
      results: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}

