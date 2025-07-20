const fs = require('fs');

// Read the current file
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Replace the grid template columns to accommodate smaller items
content = content.replace(
  /gridTemplateColumns: 'repeat\(auto-fit, minmax\(180px, 1fr\)\)'/g,
  "gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))'"
);

// Add conditional styling for small items in the quickLinks map
const oldPattern = /(\{quickLinks\.map\(\(link, index\) => \(\s*<Link[\s\S]*?<div style=\{\{[\s\S]*?padding: )'16px'([\s\S]*?\}\}>)/;
const newPattern = `$1link.size === 'small' ? '12px' : '16px'$2
                  minHeight: link.size === 'small' ? '60px' : '80px',
                  minWidth: link.size === 'small' ? '140px' : '180px',`;

content = content.replace(oldPattern, newPattern);

// Update font sizes to be responsive
content = content.replace(
  /<div style=\{\{ fontSize: '24px'/g,
  "<div style={{ fontSize: link.size === 'small' ? '20px' : '24px'"
);

content = content.replace(
  /marginBottom: '8px'/g,
  "marginBottom: link.size === 'small' ? '6px' : '8px'"
);

content = content.replace(
  /<div style=\{\{ fontSize: '14px'/g,
  "<div style={{ fontSize: link.size === 'small' ? '12px' : '14px'"
);

// Write the fixed content
fs.writeFileSync('app/page.tsx', content);
console.log('Fixed quickLinks rendering for small AI Flow button');
