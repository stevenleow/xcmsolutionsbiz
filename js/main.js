// Typing animation class
class TypeWriter {
    constructor(txtElement, words, wait = 2000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        // Initial Type Speed
        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('XCM Solutions website loaded');
    
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
        return document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('section');
    }
    
    // Function to scroll to next section
    function scrollToNextSection() {
        const currentSection = getCurrentSection();
        const currentIndex = sections.findIndex(section => section === currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        
        sections[nextIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
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
    function addScrollIndicator(section) {
        // Check if section already has a scroll indicator
        if (!section.querySelector('.scroll-indicator')) {
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            
            // Add dark class if background is light
            if (isLightBackground(section)) {
                scrollIndicator.classList.add('dark-bg');
            }
            
            scrollIndicator.innerHTML = `
                <span>Scroll to Explore</span>
                <i class="fas fa-chevron-down"></i>
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
    sections.forEach((section, index) => {
        if (index < sections.length - 1) { // Skip last section
            addScrollIndicator(section);
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
        
        /* Scroll indicator styles */
        .scroll-indicator {
            position: fixed;
            bottom: 30px;
            left: 0;
            right: 0;
            text-align: center;
            cursor: pointer;
            z-index: 1000;
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .scroll-indicator.dark-bg {
            color: #7fc4fd;  /* Matching Business Growth blue */
            text-shadow: 0 0 10px rgba(127, 196, 253, 0.3);
        }
        
        .scroll-indicator span {
            display: block;
            width: 100%;
            text-align: center;
            font-size: 1rem;
            font-weight: 600;
            color: #7fc4fd;  /* Matching Business Growth blue */
            text-shadow: 0 0 10px rgba(127, 196, 253, 0.3);
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
