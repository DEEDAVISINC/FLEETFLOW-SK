// Emergency Button Fix Script
console.log('🚨 EMERGENCY BUTTON FIX STARTING...');

function forceButtonFix() {
    console.log('🔍 Searching for buttons...');

    // Find all buttons
    const allButtons = document.querySelectorAll('button');
    console.log(`Found ${allButtons.length} buttons total`);

    let fixed = 0;

    allButtons.forEach((button, index) => {
        const text = button.textContent || button.innerText || '';
        const html = button.innerHTML || '';

        // Check if button should have notification emoji
        if (html.includes('View All') || text.includes('View All') ||
            button.style.fontFamily?.includes('Apple Color Emoji')) {

            console.log(`🔔 FIXING NOTIFICATION BUTTON #${index}:`, text);
            button.innerHTML = '🔔';
            button.style.fontFamily = 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, system-ui, sans-serif';
            button.style.border = '2px solid lime'; // Temporary highlight
            fixed++;
        }

        // Check if button should have emergency emoji
        if (html.includes('Call Now') || text.includes('Call Now') ||
            html.includes('Emergency') || text.includes('Emergency')) {

            console.log(`🚨 FIXING EMERGENCY BUTTON #${index}:`, text);
            button.innerHTML = '🚨';
            button.style.fontFamily = 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, system-ui, sans-serif';
            button.style.border = '2px solid red'; // Temporary highlight
            fixed++;
        }
    });

    console.log(`✅ FIXED ${fixed} BUTTONS`);

    // Remove highlights after 3 seconds
    setTimeout(() => {
        allButtons.forEach(button => {
            if (button.style.border.includes('lime') || button.style.border.includes('red')) {
                button.style.border = button.style.border.replace('2px solid lime', '1px solid rgba(255, 255, 255, 0.3)');
                button.style.border = button.style.border.replace('2px solid red', '2px solid rgba(255, 255, 255, 0.3)');
            }
        });
        console.log('🎯 Highlights removed - buttons should now be fixed');
    }, 3000);
}

// Run immediately
forceButtonFix();

// Run again after React hydration
setTimeout(forceButtonFix, 1000);
setTimeout(forceButtonFix, 3000);

// Run when DOM changes
const observer = new MutationObserver(() => {
    console.log('🔄 DOM changed, re-fixing buttons...');
    forceButtonFix();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('🛡️ Button fix script loaded and monitoring DOM changes');
