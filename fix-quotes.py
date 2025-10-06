#!/usr/bin/env python3
import sys

with open('app/services/ShipperAcquisitionKnowledgeBase.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace smart quotes with regular quotes
content = content.replace('\u2018', "'")  # Left single quote
content = content.replace('\u2019', "'")  # Right single quote
content = content.replace('\u201c', '"')  # Left double quote
content = content.replace('\u201d', '"')  # Right double quote

with open('app/services/ShipperAcquisitionKnowledgeBase.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Fixed smart quotes in ShipperAcquisitionKnowledgeBase.ts')
