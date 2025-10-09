#!/usr/bin/env node

/**
 * FleetFlow Knowledge Base Loader
 * Utility script to load and query the FleetFlow knowledge base
 * Usage: node scripts/load-knowledge-base.js [query|staff|section] [search_term]
 */

const fs = require('fs');
const path = require('path');

class FleetFlowKnowledgeBase {
  constructor() {
    this.markdownPath = path.join(
      __dirname,
      '..',
      'FLEETFLOW_COMPREHENSIVE_AI_EXECUTIVE_ASSISTANT_KNOWLEDGE_BASE.md'
    );
    this.jsonPath = path.join(__dirname, '..', 'fleetflow-knowledge-base.json');
    this.markdown = null;
    this.json = null;
  }

  loadMarkdown() {
    if (!this.markdown) {
      this.markdown = fs.readFileSync(this.markdownPath, 'utf8');
    }
    return this.markdown;
  }

  loadJSON() {
    if (!this.json) {
      this.json = JSON.parse(fs.readFileSync(this.jsonPath, 'utf8'));
    }
    return this.json;
  }

  // Search for AI staff member
  findAIStaff(name) {
    const json = this.loadJSON();
    const allStaff = [
      ...json.aiCapabilities.aiStaff.businessDevelopment,
      ...json.aiCapabilities.aiStaff.operations,
      ...json.aiCapabilities.aiStaff.marketingSales,
      ...json.aiCapabilities.aiStaff.technicalCompliance,
      ...json.aiCapabilities.aiStaff.customerSuccess,
      ...json.aiCapabilities.aiStaff.executiveSupport,
    ];

    return allStaff.find(
      (staff) => staff.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Search for section in markdown
  findSection(sectionName) {
    const markdown = this.loadMarkdown();
    const sections = markdown.split(/^## /m);
    const section = sections.find((s) =>
      s.toLowerCase().includes(sectionName.toLowerCase())
    );

    return section ? section.trim() : null;
  }

  // General text search
  searchText(query) {
    const markdown = this.loadMarkdown();
    const lines = markdown.split('\n');
    const results = lines.filter((line) =>
      line.toLowerCase().includes(query.toLowerCase())
    );

    return results.slice(0, 20); // Limit results
  }

  // Get pricing information
  getPricing(tier = null) {
    const json = this.loadJSON();

    if (tier) {
      // Search for specific tier
      const allTiers = {
        ...json.businessModel.pricingTiers.marketplace,
        ...json.businessModel.pricingTiers.platform,
        ...json.businessModel.pricingTiers.addOns,
        ...json.businessModel.pricingTiers.premium,
      };

      return allTiers[tier] || null;
    }

    return json.businessModel.pricingTiers;
  }

  // Get financial overview
  getFinancials() {
    return this.loadJSON().financials;
  }

  // Get competitive advantages
  getCompetitiveAdvantages() {
    return this.loadJSON().competitiveAdvantages;
  }

  // Get AI capabilities summary
  getAICapabilities() {
    const json = this.loadJSON();
    return {
      automationRate: json.aiCapabilities.automationRate,
      staffCount: json.aiCapabilities.aiStaffCount,
      summary: '94% process automation with 18 specialized AI staff members',
    };
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const kb = new FleetFlowKnowledgeBase();

  if (args.length === 0) {
    console.log('FleetFlow Knowledge Base Loader');
    console.log(
      'Usage: node scripts/load-knowledge-base.js [command] [parameter]'
    );
    console.log('');
    console.log('Commands:');
    console.log('  staff [name]     - Find AI staff member info');
    console.log('  section [name]   - Find section content');
    console.log('  search [query]   - Search for text');
    console.log('  pricing [tier]   - Get pricing information');
    console.log('  financials       - Get financial overview');
    console.log('  advantages       - Get competitive advantages');
    console.log('  ai               - Get AI capabilities summary');
    console.log('  full             - Get full knowledge base');
    return;
  }

  const [command, param] = args;

  try {
    switch (command.toLowerCase()) {
      case 'staff':
        const staff = kb.findAIStaff(param);
        console.log(JSON.stringify(staff, null, 2));
        break;

      case 'section':
        const section = kb.findSection(param);
        console.log(section || 'Section not found');
        break;

      case 'search':
        const results = kb.searchText(param);
        console.log(results.join('\n'));
        break;

      case 'pricing':
        const pricing = param ? kb.getPricing(param) : kb.getPricing();
        console.log(JSON.stringify(pricing, null, 2));
        break;

      case 'financials':
        const financials = kb.getFinancials();
        console.log(JSON.stringify(financials, null, 2));
        break;

      case 'advantages':
        const advantages = kb.getCompetitiveAdvantages();
        console.log(JSON.stringify(advantages, null, 2));
        break;

      case 'ai':
        const ai = kb.getAICapabilities();
        console.log(JSON.stringify(ai, null, 2));
        break;

      case 'full':
        const full = kb.loadJSON();
        console.log(JSON.stringify(full, null, 2));
        break;

      default:
        console.log('Unknown command. Use without parameters to see help.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export for use as module
module.exports = FleetFlowKnowledgeBase;

// Run CLI if called directly
if (require.main === module) {
  main();
}
