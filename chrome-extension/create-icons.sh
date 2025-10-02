#!/bin/bash
# Create placeholder icons (colored squares with text)
# For production, replace with actual designed icons

# Create 16x16 icon
echo '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" fill="#3b82f6"/>
  <text x="8" y="12" font-size="10" fill="white" text-anchor="middle">🚢</text>
</svg>' > icon16.svg

# Create 48x48 icon
echo '<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" fill="#3b82f6"/>
  <text x="24" y="34" font-size="28" fill="white" text-anchor="middle">🚢</text>
</svg>' > icon48.svg

# Create 128x128 icon
echo '<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#3b82f6"/>
  <text x="64" y="90" font-size="72" fill="white" text-anchor="middle">🚢</text>
</svg>' > icon128.svg

echo "✅ Icon SVG files created. To convert to PNG, use an SVG-to-PNG converter."
echo "Or manually create icon16.png, icon48.png, and icon128.png"
