// Set global variable to indicate this script has loaded
window.mainJsLoaded = true;
console.log('main.js loaded - Starting initialization...');

// TypeWriter Class
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        
        // Add event listeners
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
        
        // Initial setup
        this.txtElement.style.visibility = 'visible';
        this.txtElement.style.opacity = '1';
        
        // Check initial layout
        this.checkLayout();
        
        // Start the typing effect
        this.type();
    }

    handleResize() {
        // Check if we need to switch between single and multi-line layout
        this.checkLayout();
        
        // Recalculate text size on window resize
        if (this.txt) {
            this.adjustTextSize();
        }
    }
    
    checkLayout() {
        const container = this.txtElement.parentElement;
        const prefix = container.querySelector('.hero-title-prefix');
        const text = this.txtElement.querySelector('.wrap') || document.createElement('span');
        
        // Temporarily set text to the current word to measure
        const currentWord = this.words[this.wordIndex % this.words.length];
        text.textContent = currentWord;
        
        // Check if text overflows the container
        const containerWidth = container.offsetWidth;
        const textWidth = text.scrollWidth;
        const prefixWidth = prefix ? prefix.offsetWidth : 0;
        const availableWidth = containerWidth - prefixWidth - 40; // 40px for padding/margins
        
        // Toggle multiline class based on available space
        if (textWidth > availableWidth) {
            this.txtElement.classList.add('multiline');
            if (prefix) prefix.style.textAlign = 'center';
        } else {
            this.txtElement.classList.remove('multiline');
            if (prefix) prefix.style.textAlign = 'right';
        }
    }
    
    adjustTextSize() {
        const container = this.txtElement;
        const text = container.querySelector('.wrap');
        if (!text) return;
        
        // Get computed font size from CSS
        const computedStyle = window.getComputedStyle(container);
        const baseSize = parseFloat(computedStyle.fontSize);
        
        // Reset to base size
        text.style.fontSize = '';
        
        // Check if text overflows
        if (text.scrollWidth > container.offsetWidth) {
            // Calculate the scale factor needed to fit the text
            const scale = (container.offsetWidth - 20) / text.scrollWidth;
            const newSize = Math.max(baseSize * scale, 16); // 16px minimum font size
            text.style.fontSize = `${newSize}px`;
        }
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert line breaks for multi-line text
        let displayText = this.txt;
        if (this.txt.includes('\n')) {
            displayText = this.txt.replace(/\n/g, '<br>');
        }
        
        this.txtElement.innerHTML = `<span class="wrap">${displayText}</span>`;
        this.adjustTextSize();

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('XCM Solutions website loaded');
    
    // Initialize typing animation
    const txtElement = document.querySelector('.typing-text');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

    // Original "Explore Our Services" button
    const exploreCta = document.getElementById('explore-cta');
    if (exploreCta) {
        exploreCta.addEventListener('click', () => {
            const mainpageSection = document.getElementById('mainpage');
            if (mainpageSection) {
                mainpageSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Add "Scroll to Explore" indicator only to the hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = `
            <div class="scroll-indicator-content">
                <span class="scroll-text">Scroll to Explore</span>
                <i class="fas fa-chevron-down"></i>
            </div>
        `;
        heroSection.appendChild(scrollIndicator);
        
        scrollIndicator.addEventListener('click', () => {
            const mainpageSection = document.querySelector('.mainpage');
            if (mainpageSection) {
                mainpageSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
