// Set global variable to indicate this script has loaded
window.mainJsLoaded = true;
console.log('main.js loaded - Starting initialization...');

// Simple scroll indicator functionality
function initScrollIndicators() {
    console.log('Initializing scroll indicators...');
    
    try {
        // Debug: Check if styles are being applied
        console.log('Checking document styles...');
        console.log('Body styles:', window.getComputedStyle(document.body));
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        console.log(`Found ${sections.length} sections`);
        
        // Add styles for scroll indicators
        const scrollIndicatorStyle = document.createElement('style');
        scrollIndicatorStyle.textContent = `
            .scroll-indicator {
                position: absolute !important;
                bottom: 30px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                text-align: center !important;
                cursor: pointer !important;
                z-index: 9999 !important;
                opacity: 1 !important;
                visibility: visible !important;
                transition: opacity 0.3s ease !important;
            }
            
            .scroll-indicator-content {
                background: rgba(0, 0, 0, 0.9) !important;
                padding: 12px 24px !important;
                border-radius: 30px !important;
                color: white !important;
                display: inline-block !important;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
                backdrop-filter: blur(5px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                transition: all 0.3s ease !important;
            }
            
            .scroll-indicator:hover .scroll-indicator-content {
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35) !important;
            }
            
            .section-counter {
                display: block !important;
                font-size: 12px !important;
                font-weight: 700 !important;
                color: #7fc4fd !important;
                margin-bottom: 5px !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
            }
            
            .scroll-text {
                display: block !important;
                margin: 0 0 5px 0 !important;
                font-size: 14px !important;
                font-weight: 500 !important;
            }
            
            .scroll-indicator i {
                font-size: 16px !important;
                animation: bounce 2s infinite !important;
                color: white !important;
                display: block !important;
                margin-top: 5px !important;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { 
                    transform: translateY(0) !important; 
                }
                40% { 
                    transform: translateY(-5px) !important; 
                }
                60% { 
                    transform: translateY(-3px) !important; 
                }
            }
            
            /* Ensure sections can contain absolute elements */
            section {
                position: relative !important;
                min-height: 100vh !important;
                overflow: visible !important;
            }
        `;
        document.head.appendChild(scrollIndicatorStyle);

        // Debug: Log section details
        sections.forEach((s, i) => {
            console.log(`Section ${i}:`, {
                id: s.id || 'no-id',
                className: s.className,
                position: window.getComputedStyle(s).position,
                height: window.getComputedStyle(s).height,
                hasScrollIndicator: !!s.querySelector('.scroll-indicator')
            });
        });
        
        // Add scroll indicator to each section except the last one
        sections.forEach((section, index) => {
            if (index < sections.length - 1) {
                console.log(`Adding scroll indicator to section ${index} (${section.id || 'no-id'})`);
                
                // Ensure section has relative positioning
                section.style.position = 'relative';
                
                // Create scroll indicator
                const indicator = document.createElement('div');
                indicator.className = 'scroll-indicator';
                indicator.innerHTML = `
                    <div class="scroll-indicator-content">
                        <span class="section-counter">#${index + 1} / ${sections.length - 1}</span>
                        <span class="scroll-text">Scroll to Explore</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                `;
                
                // Add click handler with debug logging
                indicator.addEventListener('click', function(e) {
                    console.log('Scroll indicator clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Log the current section and target section
                    const currentSection = this.closest('section');
                    const currentIndex = Array.from(document.querySelectorAll('section')).indexOf(currentSection);
                    console.log('Current section index:', currentIndex, 'ID:', currentSection?.id);
                    
                    // Manually scroll to the next section
                    const sections = document.querySelectorAll('section');
                    if (sections.length > currentIndex + 1) {
                        const targetSection = sections[currentIndex + 1];
                        console.log('Scrolling to section:', currentIndex + 1, 'ID:', targetSection.id);
                        
                        window.scrollTo({
                            top: targetSection.offsetTop,
                            behavior: 'smooth'
                        });
                    } else {
                        console.log('No next section found');
                    }
                });
                
                // Add to section
                section.appendChild(indicator);
                console.log(`Added scroll indicator to section ${index}`);
            }
        });
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            /* Scroll Indicator Styles */
            .scroll-indicator {
                position: absolute !important;
                bottom: 30px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                text-align: center !important;
                cursor: pointer !important;
                z-index: 9999 !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
                display: block !important;
            }
            
            .scroll-indicator-content {
                background: rgba(0, 0, 0, 0.9) !important;
                padding: 12px 24px !important;
                border-radius: 30px !important;
                color: white !important;
                display: inline-block !important;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
                backdrop-filter: blur(5px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                transition: all 0.3s ease !important;
            }
            
            .scroll-indicator:hover .scroll-indicator-content {
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35) !important;
            }
            
            .section-counter {
                display: block !important;
                font-size: 14px !important;
                font-weight: 700 !important;
                color: #7fc4fd !important;
                margin-bottom: 5px !important;
                text-shadow: none !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
                font-size: 12px !important;
            }
            
            .scroll-text {
                display: block !important;
                margin: 0 0 5px 0 !important;
                font-size: 14px !important;
                font-weight: 500 !important;
            }
            
            .scroll-indicator i {
                font-size: 16px !important;
                animation: bounce 2s infinite !important;
                color: white !important;
                display: block !important;
                margin-top: 5px !important;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { 
                    transform: translateY(0) !important; 
                }
                40% { 
                    transform: translateY(-5px) !important; 
                }
                60% { 
                    transform: translateY(-3px) !important; 
                }
            }
            
            /* Ensure sections can contain absolute elements */
            section {
                position: relative !important;
                min-height: 100vh !important;
                overflow: visible !important;
            }
            
            /* Make sure parent containers don't hide the indicator */
            .hero, .mainpage, .services, .pricing, .cta, .contact {
                overflow: visible !important;
            }
        `;
        
        // Add styles to head
        document.head.appendChild(style);
        console.log('Added scroll indicator styles');
        
    } catch (error) {
        console.error('Error in initScrollIndicators:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded (via event listener)');
        initScrollIndicators();
    });
} else {
    console.log('DOM already loaded');
    initScrollIndicators();
}

console.log('main.js initialization complete');

document.addEventListener('DOMContentLoaded', () => {
    console.log('XCM Solutions website loaded');
    console.log('[DEBUG] DOM fully loaded and parsed');
    
    // Debug: Check sections
    const allSections = document.querySelectorAll('section');
    console.log(`[DEBUG] Found ${allSections.length} sections:`, Array.from(allSections).map((s, i) => `#${i}: ${s.id || 'unnamed'}`).join(', '));
    
    // Initialize typing animation
    const txtElement = document.querySelector('.typing-text');
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
    
    // Function to get all sections
    const sections = Array.from(document.querySelectorAll('section'));
    
    // Function to get current section
    function getCurrentSection() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const element = document.elementFromPoint(centerX, centerY);
        return element ? element.closest('section') : document.querySelector('section');
    }
    
    // Function to scroll to next section
    function scrollToNextSection() {
        console.log('scrollToNextSection called');
        const currentSection = getCurrentSection();
        console.log('Current section:', currentSection ? currentSection.id : 'none');
        
        if (!currentSection) {
            console.log('No current section found, scrolling to first section');
            sections[0]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        
        const currentIndex = sections.findIndex(section => section === currentSection);
        console.log('Current section index:', currentIndex);
        
        if (currentIndex === -1) {
            console.log('Current section not found in sections array');
            return;
        }
        
        const nextIndex = (currentIndex + 1) % sections.length;
        console.log('Scrolling to section index:', nextIndex, 'ID:', sections[nextIndex]?.id);
        
        if (sections[nextIndex]) {
            sections[nextIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Function to scroll to previous section
    function scrollToPrevSection() {
        const currentSection = getCurrentSection();
        const currentIndex = sections.findIndex(section => section === currentSection);
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
        
        sections[prevIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Function to check if background is light
    function isLightBackground(section) {
        // Get computed style of the section
        const style = window.getComputedStyle(section);
        // Get background color (try different properties)
        let bgColor = style.backgroundColor || 
                     style.background || 
                     window.getComputedStyle(document.body).backgroundColor;
        
        // If no background color, check parent elements
        if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
            let parent = section.parentElement;
            while (parent && parent !== document.body) {
                const parentStyle = window.getComputedStyle(parent);
                bgColor = parentStyle.backgroundColor;
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                    break;
                }
                parent = parent.parentElement;
            }
        }

        // Default to dark if we can't determine the color
        if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
            return false;
        }

        // Convert RGB to brightness (0-1)
        const rgb = bgColor.match(/\d+/g);
        if (!rgb) return false;
        
        const brightness = (parseInt(rgb[0]) * 299 + 
                          parseInt(rgb[1]) * 587 + 
                          parseInt(rgb[2]) * 114) / 1000;
        
        // Consider light if brightness is over 50%
        return brightness > 128;
    }

    // Function to add scroll indicator to a section
    function addScrollIndicator(section, index) {
        console.log(`[DEBUG] Adding scroll indicator to section ${index}`, {
            id: section.id || 'no-id',
            classList: section.className,
            textContent: section.textContent.substring(0, 100) + '...'
        });
        // Check if section already has a scroll indicator
        if (!section.querySelector('.scroll-indicator')) {
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            
            // Add dark class if background is light
            if (isLightBackground(section)) {
                scrollIndicator.classList.add('dark-bg');
            }
            
            const totalSections = document.querySelectorAll('section').length - 1; // -1 to exclude the last section
            console.log(`[DEBUG] Creating indicator for section ${index + 1} of ${totalSections}`, {section, index, totalSections});
            
            // Create indicator with inline styles for maximum visibility
            scrollIndicator.innerHTML = `
                <div class="scroll-indicator-content" style="background: rgba(0,0,0,0.8) !important; padding: 15px 25px !important; border-radius: 10px !important; color: white !important;">
                    <span class="section-counter" style="display: block !important; font-size: 16px !important; font-weight: bold !important; color: white !important; background: #0071e3 !important; padding: 5px 10px !important; border-radius: 10px !important; margin-bottom: 8px !important;">
                        #${index + 1} / ${totalSections}
                    </span>
                    <span class="scroll-text" style="display: block !important; font-size: 14px !important; margin-bottom: 5px !important;">
                        Scroll to Explore
                    </span>
                    <i class="fas fa-chevron-down" style="font-size: 16px !important;"></i>
                </div>
            `;
            
            section.appendChild(scrollIndicator);
            
            // Add intersection observer to update on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const isLight = isLightBackground(entry.target);
                        scrollIndicator.classList.toggle('dark-bg', isLight);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(section);
            
            // Add click event
            scrollIndicator.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToNextSection();
            });
        }
    }
    
    // Add scroll indicators to all sections except the last one
    console.log(`[DEBUG] Found ${sections.length} sections`);
    sections.forEach((section, index) => {
        console.log(`[DEBUG] Processing section ${index}`, {
            id: section.id || 'no-id',
            className: section.className,
            nodeName: section.nodeName,
            hasScrollIndicator: !!section.querySelector('.scroll-indicator')
        });
        
        if (index < sections.length - 1) { // Skip last section
            console.log(`[DEBUG] Adding scroll indicator to section ${index}`);
            addScrollIndicator(section, index);
            console.log(`[DEBUG] After adding indicator to section ${index}`, {
                hasScrollIndicator: !!section.querySelector('.scroll-indicator')
            });
        } else {
            console.log(`[DEBUG] Skipping last section (${index})`);
        }
    });
    

    
    // Add click handler for any existing scroll indicators (just in case)
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToNextSection();
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            scrollToNextSection();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            scrollToPrevSection();
        }
    });
    
    // Variables for rubber band effect
    let startY = 0;
    let isScrolling = false;
    const doc = document.documentElement;
    
    // Add styles for the page and scroll indicators
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
            -webkit-overflow-scrolling: touch;
        }
        
        #content {
            position: relative;
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
        }
        
        /* Scroll indicator styles - Added !important to override any conflicting styles */
        .scroll-indicator {
            position: fixed !important;
            bottom: 30px !important;
            left: 0 !important;
            right: 0 !important;
            text-align: center !important;
            cursor: pointer !important;
            z-index: 1000 !important;
            pointer-events: auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            transition: all 0.3s ease !important;
            animation: none !important; /* Remove any conflicting animations */
        }
        
        .scroll-indicator-content {
            background: rgba(0, 0, 0, 0.7) !important;
            padding: 10px 20px !important;
            border-radius: 30px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 6px !important;
            backdrop-filter: blur(5px) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
        }
        
        .scroll-indicator.dark-bg .scroll-indicator-content {
            background: rgba(255, 255, 255, 0.7) !important;
        }
        
        .scroll-indicator .section-counter {
            font-size: 12px !important;
            font-weight: 700 !important;
            color: #fff !important;
            background: linear-gradient(135deg, #0071e3 0%, #004a99 100%) !important;
            padding: 6px 12px !important;
            border-radius: 20px !important;
            margin-bottom: 8px !important;
            display: inline-block !important;
            min-width: 60px !important;
            text-shadow: none !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            position: relative;
            z-index: 1;
        }
        
        .scroll-indicator i {
            margin-top: 6px;
            font-size: 18px;
            color: #7fc4fd;  /* Matching Business Growth blue */
            text-shadow: 0 0 10px rgba(127, 196, 253, 0.3);
            animation: bounce 2s infinite;
        }
        

        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        .scroll-indicator:hover {
            color: white;
            transform: translateX(-50%) translateY(-5px);
        }
        
        /* Ensure sections have relative positioning for absolute children */
        section {
            position: relative;
        }
    `;
    document.head.appendChild(style);
    
    // Wrap content in a scrollable div
    const content = document.createElement('div');
    content.id = 'content';
    while (document.body.firstChild) {
        content.appendChild(document.body.firstChild);
    }
    document.body.appendChild(content);
    
    // Touch start handler
    content.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    // Touch move handler for rubber band effect
    content.addEventListener('touchmove', (e) => {
        if (isScrolling) return;
        
        const y = e.touches[0].clientY;
        const scrollTop = content.scrollTop;
        const scrollHeight = content.scrollHeight;
        const height = content.clientHeight;
        
        // Prevent scrolling past the top
        if (scrollTop <= 0 && y > startY) {
            e.preventDefault();
            isScrolling = true;
            content.style.transform = `translateY(${y - startY}px)`;
            content.style.transition = 'transform 0.1s ease-out';
        }
        // Prevent scrolling past the bottom
        else if (scrollTop + height >= scrollHeight && y < startY) {
            e.preventDefault();
            isScrolling = true;
            content.style.transform = `translateY(${y - startY}px)`;
            content.style.transition = 'transform 0.1s ease-out';
        }
    }, { passive: false });
    
    // Touch end handler to snap back
    content.addEventListener('touchend', () => {
        if (isScrolling) {
            isScrolling = false;
            content.style.transform = 'translateY(0)';
            content.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
        }
    }, { passive: true });
    
    // Mouse wheel handler for desktop
    content.addEventListener('wheel', (e) => {
        const scrollTop = content.scrollTop;
        const scrollHeight = content.scrollHeight;
        const height = content.clientHeight;
        
        // Prevent scrolling past the top
        if (e.deltaY < 0 && scrollTop <= 0) {
            e.preventDefault();
            content.style.transform = 'translateY(10px)';
            content.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            
            // Reset transform after animation
            setTimeout(() => {
                content.style.transform = 'translateY(0)';
            }, 300);
        }
        // Prevent scrolling past the bottom
        else if (e.deltaY > 0 && scrollTop + height >= scrollHeight) {
            e.preventDefault();
            content.style.transform = 'translateY(-10px)';
            content.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            
            // Reset transform after animation
            setTimeout(() => {
                content.style.transform = 'translateY(0)';
            }, 300);
        }
    }, { passive: false });
    
    // Reset transform when transition ends
    content.addEventListener('transitionend', () => {
        content.style.transition = 'none';
    });
});
