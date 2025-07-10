// FleetFlow Route Generator - Text Formatting Utilities

/**
 * Convert markdown to HTML for rendering
 * @param {String} markdown - Markdown text
 * @returns {String} - HTML string
 */
export function convertMarkdownToHTML(markdown) {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraphs
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p><br><\/p>/g, '');
  
  // Horizontal rules
  html = html.replace(/---/g, '<hr>');
  
  return html;
}

/**
 * Format route document for different output types
 * @param {String} markdown - Markdown content
 * @param {String} format - Output format ('html', 'plain', 'pdf-ready')
 * @returns {String} - Formatted content
 */
export function formatForOutput(markdown, format = 'html') {
  switch (format) {
    case 'html':
      return convertMarkdownToHTML(markdown);
      
    case 'plain':
      return convertToPlainText(markdown);
      
    case 'pdf-ready':
      return formatForPDF(markdown);
      
    default:
      return markdown;
  }
}

/**
 * Convert markdown to plain text
 * @param {String} markdown - Markdown text
 * @returns {String} - Plain text
 */
function convertToPlainText(markdown) {
  if (!markdown) return '';
  
  let text = markdown;
  
  // Remove markdown formatting
  text = text.replace(/#{1,6}\s*/g, ''); // Headers
  text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
  text = text.replace(/\*(.*?)\*/g, '$1'); // Italic
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
  text = text.replace(/---/g, '────────────────────'); // Horizontal rules
  
  return text;
}

/**
 * Format markdown for PDF generation
 * @param {String} markdown - Markdown text
 * @returns {String} - PDF-ready HTML
 */
function formatForPDF(markdown) {
  const html = convertMarkdownToHTML(markdown);
  
  // Add PDF-specific styling
  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        h2 {
          color: #34495e;
          margin-top: 25px;
        }
        h3 {
          color: #7f8c8d;
        }
        strong {
          color: #2c3e50;
        }
        hr {
          border: none;
          border-top: 1px solid #bdc3c7;
          margin: 20px 0;
        }
        a {
          color: #3498db;
          text-decoration: none;
        }
        .route-header {
          background: #ecf0f1;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;
}

/**
 * Apply syntax highlighting for code blocks
 * @param {String} text - Text with code blocks
 * @returns {String} - Text with highlighted code
 */
export function applySyntaxHighlighting(text) {
  if (!text) return '';
  
  // Highlight phone numbers
  text = text.replace(/(\([0-9]{3}\)\s?[0-9]{3}-[0-9]{4})/g, '<span class="phone-number">$1</span>');
  
  // Highlight money amounts
  text = text.replace(/(\$[0-9,]+\.?[0-9]*)/g, '<span class="currency">$1</span>');
  
  // Highlight time expressions
  text = text.replace(/([0-9]{1,2}:[0-9]{2}\s?(AM|PM))/gi, '<span class="time">$1</span>');
  
  // Highlight addresses (basic pattern)
  text = text.replace(/([0-9]+\s+[A-Za-z\s]+,\s+[A-Za-z\s]+,?\s+[A-Z]{2}\s+[0-9]{5})/g, '<span class="address">$1</span>');
  
  return text;
}

/**
 * Generate table of contents from markdown headers
 * @param {String} markdown - Markdown text
 * @returns {String} - Table of contents HTML
 */
export function generateTableOfContents(markdown) {
  if (!markdown) return '';
  
  const headers = [];
  const lines = markdown.split('\n');
  
  lines.forEach(line => {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2].replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      headers.push({
        level,
        text,
        id
      });
    }
  });
  
  if (headers.length === 0) return '';
  
  let toc = '<div class="table-of-contents">\n<h3>📋 Contents</h3>\n<ul>\n';
  
  headers.forEach(header => {
    const indent = '  '.repeat(header.level - 1);
    toc += `${indent}<li><a href="#${header.id}">${header.text}</a></li>\n`;
  });
  
  toc += '</ul>\n</div>\n';
  
  return toc;
}

/**
 * Add anchor links to headers in markdown
 * @param {String} markdown - Markdown text
 * @returns {String} - Markdown with anchor-ready headers
 */
export function addHeaderAnchors(markdown) {
  if (!markdown) return '';
  
  return markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold
    const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${hashes} <a id="${id}"></a>${text}`;
  });
}

/**
 * Format text for different display contexts
 * @param {String} text - Text to format
 * @param {String} context - Display context ('web', 'mobile', 'print', 'email')
 * @returns {String} - Formatted text
 */
export function formatForContext(text, context = 'web') {
  if (!text) return '';
  
  switch (context) {
    case 'mobile':
      // Shorter lines, larger headers for mobile
      return text
        .replace(/^# /gm, '## ')  // Make headers smaller
        .replace(/^## /gm, '### ')
        .replace(/^### /gm, '#### ');
        
    case 'print':
      // Remove colors, simplify formatting for print
      return text
        .replace(/📍|🚛|💰|📦|⚠️|🏢|📞|🗺️/g, '') // Remove emojis
        .replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold formatting
        
    case 'email':
      // Email-safe formatting
      return convertToPlainText(text)
        .replace(/\n\n\n+/g, '\n\n') // Reduce excessive line breaks
        .replace(/_{3,}/g, '___'); // Simplify horizontal rules
        
    default:
      return text;
  }
}

/**
 * Generate summary from route document
 * @param {String} markdown - Full route document
 * @returns {String} - Summary text
 */
export function generateRouteSummary(markdown) {
  if (!markdown) return '';
  
  const summary = [];
  
  // Extract key information using regex
  const routeMatch = markdown.match(/# Route (\d+): (.+)/);
  if (routeMatch) {
    summary.push(`Route ${routeMatch[1]}: ${routeMatch[2]}`);
  }
  
  const companyMatch = markdown.match(/## 🏢 \*\*(.+)\*\*/);
  if (companyMatch) {
    summary.push(`Company: ${companyMatch[1]}`);
  }
  
  const rateMatch = markdown.match(/\*\*RATE: \$([0-9,.]+)\*\*/);
  if (rateMatch) {
    summary.push(`Rate: $${rateMatch[1]}`);
  }
  
  const milesMatch = markdown.match(/\*\*Miles:\*\* ([0-9,]+)/);
  if (milesMatch) {
    summary.push(`Miles: ${milesMatch[1]}`);
  }
  
  const pickupMatch = markdown.match(/### 🏭 \*\*(.+?)\*\*/);
  if (pickupMatch) {
    summary.push(`Pickup: ${pickupMatch[1]}`);
  }
  
  return summary.join(' | ');
}

/**
 * Validate and clean emoji usage in text
 * @param {String} text - Text with emojis
 * @returns {String} - Text with validated emojis
 */
export function validateEmojis(text) {
  if (!text) return '';
  
  // Map of emoji replacements for consistency
  const emojiMap = {
    '🚚': '🚛', // Standardize truck emoji
    '💵': '💰', // Standardize money emoji
    '📌': '📍', // Standardize location emoji
    '☎️': '📞'  // Standardize phone emoji
  };
  
  let result = text;
  
  Object.entries(emojiMap).forEach(([old, replacement]) => {
    result = result.replace(new RegExp(old, 'g'), replacement);
  });
  
  return result;
}

/**
 * Calculate reading time for document
 * @param {String} text - Document text
 * @param {Number} wordsPerMinute - Reading speed (default 200)
 * @returns {Object} - Reading time information
 */
export function calculateReadingTime(text, wordsPerMinute = 200) {
  if (!text) return { minutes: 0, words: 0 };
  
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return {
    words,
    minutes,
    formatted: `${minutes} min read`
  };
}

/**
 * Generate print-friendly version of route document
 * @param {String} markdown - Markdown document
 * @returns {String} - Print-optimized version
 */
export function generatePrintVersion(markdown) {
  if (!markdown) return '';
  
  return markdown
    .replace(/📍|🚛|💰|📦|⚠️|🏢|📞|🗺️|🏭|🚜|🌾|🏪|⚗️|🏗️|✈️|🚂|🚢/g, '') // Remove emojis
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to plain text
    .replace(/---/g, '────────────────────────────────────────') // ASCII horizontal rules
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/### /g, '') // Remove header markdown
    .replace(/## /g, '')
    .replace(/# /g, '')
    .replace(/\n\n\n+/g, '\n\n'); // Clean up excessive line breaks
}
