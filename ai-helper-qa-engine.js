#!/usr/bin/env node

/**
 * AI Helper Q&A Engine
 * Interactive question answering system for FleetFlow and Depointe AI Company Dashboard
 * Usage: node ai-helper-qa-engine.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class AIHelperQAEngine {
  constructor() {
    this.knowledgeBase = null;
    this.qaPairs = [];
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    try {
      const qaPath = path.join(
        __dirname,
        'COMPREHENSIVE_APP_SYSTEMS_QA_KNOWLEDGE_BASE.txt'
      );
      this.knowledgeBase = fs.readFileSync(qaPath, 'utf8');
      this.parseQAPairs();
      console.log('✅ Knowledge base loaded successfully!');
      console.log(`📊 Loaded ${this.qaPairs.length} Q&A pairs`);
    } catch (error) {
      console.error('❌ Error loading knowledge base:', error.message);
    }
  }

  parseQAPairs() {
    const sections = this.knowledgeBase.split(/^=+$/m);
    let currentSection = '';

    for (const section of sections) {
      const lines = section.trim().split('\n');
      if (lines.length > 0) {
        const sectionTitle = lines[0].trim();
        if (
          sectionTitle &&
          !sectionTitle.includes('COMPREHENSIVE_APP_SYSTEMS_QA_KNOWLEDGE_BASE')
        ) {
          currentSection = sectionTitle;
        }

        // Parse Q&A pairs
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (
            line.endsWith('?') &&
            lines[i + 1] &&
            !lines[i + 1].trim().endsWith('?')
          ) {
            // Found a question
            const question = line;
            let answer = '';
            let j = i + 1;

            // Collect answer lines until next question or section
            while (
              j < lines.length &&
              lines[j].trim() &&
              !lines[j].trim().endsWith('?') &&
              !lines[j].trim().match(/^=+$/)
            ) {
              if (lines[j].trim()) {
                answer += lines[j].trim() + ' ';
              }
              j++;
            }

            if (answer.trim()) {
              this.qaPairs.push({
                section: currentSection,
                question: question,
                answer: answer.trim(),
                keywords: this.extractKeywords(question + ' ' + answer),
              });
            }
          }
        }
      }
    }
  }

  extractKeywords(text) {
    const commonWords = [
      'what',
      'how',
      'why',
      'when',
      'where',
      'who',
      'which',
      'are',
      'is',
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'as',
      'can',
      'do',
      'does',
      'will',
      'would',
      'should',
      'could',
      'may',
      'might',
      'must',
      'shall',
    ];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
  }

  findAnswer(question) {
    const query = question.toLowerCase();
    const results = [];

    // Exact question match
    const exactMatch = this.qaPairs.find(
      (qa) => qa.question.toLowerCase() === query
    );
    if (exactMatch) {
      return [exactMatch];
    }

    // Partial question match
    const partialMatches = this.qaPairs.filter(
      (qa) =>
        qa.question.toLowerCase().includes(query) ||
        query.includes(qa.question.toLowerCase().replace('?', ''))
    );
    if (partialMatches.length > 0) {
      return partialMatches.slice(0, 3);
    }

    // Keyword matching
    for (const qa of this.qaPairs) {
      const score = qa.keywords.filter((keyword) =>
        query.includes(keyword)
      ).length;

      if (score > 0) {
        results.push({ qa, score });
      }
    }

    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 5).map((r) => r.qa);
  }

  async askQuestion(question) {
    console.log(`\n🤔 Question: ${question}\n`);

    const answers = this.findAnswer(question);

    if (answers.length === 0) {
      console.log(
        "❓ I couldn't find a specific answer to your question. Here are some related topics I know about:\n"
      );

      // Show available sections
      const sections = [...new Set(this.qaPairs.map((qa) => qa.section))];
      sections.forEach((section) => {
        console.log(`  • ${section}`);
      });

      console.log(
        '\n💡 Try rephrasing your question or ask about one of these topics.'
      );
      return;
    }

    answers.forEach((qa, index) => {
      if (answers.length > 1) {
        console.log(`${index + 1}. ${qa.question}`);
      }
      console.log(`📝 ${qa.answer}\n`);
      if (qa.section) {
        console.log(`📂 Section: ${qa.section}\n`);
      }
    });
  }

  showStats() {
    console.log('\n📊 Knowledge Base Statistics:');
    console.log(`Total Q&A pairs: ${this.qaPairs.length}`);

    const sections = {};
    this.qaPairs.forEach((qa) => {
      sections[qa.section] = (sections[qa.section] || 0) + 1;
    });

    console.log('\n📂 Questions by section:');
    Object.entries(sections).forEach(([section, count]) => {
      console.log(`  ${section}: ${count} questions`);
    });
  }

  showHelp() {
    console.log('\n🤖 AI Helper Q&A Engine');
    console.log('======================');
    console.log('');
    console.log('Commands:');
    console.log('  help          - Show this help');
    console.log('  stats         - Show knowledge base statistics');
    console.log('  sections      - List all available sections');
    console.log('  search <term> - Search for questions containing a term');
    console.log('  exit          - Quit the application');
    console.log('');
    console.log('Examples:');
    console.log('  What is FleetFlow?');
    console.log('  How does task assignment work?');
    console.log('  What AI staff handle sales?');
    console.log('  How do I access the dashboard?');
    console.log('');
  }

  showSections() {
    console.log('\n📂 Available Sections:');
    const sections = [...new Set(this.qaPairs.map((qa) => qa.section))];
    sections.forEach((section) => {
      console.log(`  • ${section}`);
    });
    console.log('');
  }

  searchQuestions(term) {
    const results = this.qaPairs.filter(
      (qa) =>
        qa.question.toLowerCase().includes(term.toLowerCase()) ||
        qa.answer.toLowerCase().includes(term.toLowerCase())
    );

    console.log(`\n🔍 Search results for "${term}":`);
    if (results.length === 0) {
      console.log('No matching questions found.');
    } else {
      results.forEach((qa, index) => {
        console.log(`${index + 1}. ${qa.question}`);
        console.log(`   ${qa.answer.substring(0, 100)}...`);
        console.log(`   📂 ${qa.section}\n`);
      });
    }
  }

  async startInteractiveMode() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('\n🎯 Welcome to the AI Helper Q&A Engine!');
    console.log('========================================');
    console.log(
      'Ask me anything about FleetFlow or the Depointe AI Company Dashboard.'
    );
    console.log('Type "help" for commands, "exit" to quit.\n');

    const askQuestion = () => {
      rl.question('❓ Your question: ', async (input) => {
        const command = input.trim().toLowerCase();

        if (command === 'exit' || command === 'quit') {
          console.log('👋 Goodbye!');
          rl.close();
          return;
        }

        if (command === 'help') {
          this.showHelp();
        } else if (command === 'stats') {
          this.showStats();
        } else if (command === 'sections') {
          this.showSections();
        } else if (command.startsWith('search ')) {
          const term = command.substring(7);
          this.searchQuestions(term);
        } else if (input.trim()) {
          await this.askQuestion(input.trim());
        }

        askQuestion();
      });
    };

    askQuestion();
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const engine = new AIHelperQAEngine();

  if (args.length === 0) {
    // Interactive mode
    engine.startInteractiveMode();
  } else {
    // Command line mode
    const question = args.join(' ');
    engine.askQuestion(question).then(() => {
      process.exit(0);
    });
  }
}

// Export for use as module
module.exports = AIHelperQAEngine;

// Run if called directly
if (require.main === module) {
  main();
}
