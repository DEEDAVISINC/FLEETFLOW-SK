#!/usr/bin/env python3

import sys
import re

# Sensitive patterns to remove from git history
sensitive_patterns = [
    # Twilio credentials
    r'TWILIO_ACCOUNT_SID=AC[a-f0-9]{32}',
    r'TWILIO_AUTH_TOKEN=[a-f0-9]{32}',
    r'TWILIO_PHONE_NUMBER=\+\d{11}',
    r'EXAMPLE_ACCOUNT_SID_PATTERN',
    r'EXAMPLE_AUTH_TOKEN_PATTERN',
    r'EXAMPLE_PHONE_PATTERN',
    # FMCSA API key (if needed)
    r'FMCSA_API_KEY=[a-f0-9]{40}',
    r'7de24c4a0eade12f34685829289e0446daf7880e',
]

def filter_content(content):
    """Remove sensitive content from text"""
    for pattern in sensitive_patterns:
        content = re.sub(pattern, '[REMOVED_SECRET]', content)
    return content

# Read from stdin and write filtered content to stdout
if __name__ == '__main__':
    content = sys.stdin.read()
    filtered_content = filter_content(content)
    sys.stdout.write(filtered_content)
