/**
 * FleetFlow ImportYeti Scraper - Background Service Worker
 */

console.log('🚢 FleetFlow Scraper Background Service initialized');

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ FleetFlow Scraper installed');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'companiesScraped') {
    // Could trigger notifications here
    chrome.action.setBadgeText({ text: String(request.count) });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
  }

  return true;
});
