// Main JavaScript for XCM Solutions Website
document.addEventListener('DOMContentLoaded', function() {
    console.log('XCM Solutions website loaded - Starting initialization...');
    
    // Initialize TypeWriter functionality
    initTypeWriter();
    
    // Initialize scroll functionality
    initScrollFunctionality();
    
    console.log('XCM Solutions website initialized');
});

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
        
        // Start the typing effect
        this.type();
    }

    handleResize() {
        // Recalculate layout on window resize
        this.adjustTextSize();
    }
    
    adjustTextSize() {
        const container = this.txtElement;
        const text = container.querySelector('.wrap');
        if (!text) return;
        
        // Reset to base size
        text.style.fontSize = '';
        
        // Check if text overflows
        if (text.scrollWidth > container.offsetWidth) {
            const computedStyle = window.getComputedStyle(container);
            const baseSize = parseFloat(computedStyle.fontSize);
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

// Initialize TypeWriter functionality
function initTypeWriter() {
    const txtElements = document.querySelectorAll('.typing-text');
    
    txtElements.forEach(txtElement => {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait') || 3000;
        new TypeWriter(txtElement, words, wait);
    });
}

// Initialize scroll functionality
function initScrollFunctionality() {
    let currentSectionIndex = 0;
    let sections = [];
    
    function updateSections() {
        sections = Array.from(document.querySelectorAll('section')).filter(section => {
            const style = window.getComputedStyle(section);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
        updateCurrentSection();
    }
    
    function updateCurrentSection() {
        const scrollPosition = window.scrollY + (window.innerHeight / 3);
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (currentSectionIndex !== i) {
                    currentSectionIndex = i;
                    const sectionName = sections[currentSectionIndex].id || 'unnamed-section';
                    console.log('Current section:', currentSectionIndex, sectionName);
                    
                    // Update development indicator
                    const devIndicator = document.getElementById('devIndicator');
                    if (devIndicator) {
                        devIndicator.textContent = sectionName;
                    }
                }
                break;
            }
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', updateCurrentSection);
    
    // Initial update
    updateSections();
    
    // Add scroll indicator
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = `
            <div class="scroll-indicator-content">
                <i class="fas fa-chevron-up up-arrow" aria-hidden="true"></i>
                <span class="scroll-text">Scroll to Explore</span>
                <i class="fas fa-chevron-down down-arrow" aria-hidden="true"></i>
            </div>
        `;
        heroSection.appendChild(scrollIndicator);
        
        const upArrow = scrollIndicator.querySelector('.up-arrow');
        const downArrow = scrollIndicator.querySelector('.down-arrow');
        const indicatorText = scrollIndicator.querySelector('.scroll-text');
        
        function updateIndicator() {
            // Hide up arrow on first section
            upArrow.style.display = currentSectionIndex === 0 ? 'none' : 'block';
            // Hide down arrow on last section
            downArrow.style.display = currentSectionIndex >= sections.length - 1 ? 'none' : 'block';
            
            // Update text based on position
            if (currentSectionIndex === 0) {
                indicatorText.textContent = 'Scroll to Explore';
            } else if (currentSectionIndex >= sections.length - 1) {
                indicatorText.textContent = 'Back to Top';
            } else {
                indicatorText.textContent = 'Explore More';
            }
            
            // Update state classes
            scrollIndicator.classList.toggle('at-top', currentSectionIndex === 0);
            scrollIndicator.classList.toggle('at-bottom', currentSectionIndex >= sections.length - 1);
            scrollIndicator.classList.toggle('in-middle', currentSectionIndex > 0 && currentSectionIndex < sections.length - 1);
        }
        
        // Initial update
        updateIndicator();
        
        // Handle scroll events
        window.addEventListener('scroll', () => {
            updateSections();
            updateIndicator();
        });
        
        // Handle indicator clicks
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            updateSections();
            
            // Determine which part was clicked
            const isUpArrow = e.target.classList.contains('up-arrow') || 
                             e.target.closest('.up-arrow');
            const isDownArrow = e.target.classList.contains('down-arrow') || 
                              e.target.closest('.down-arrow');
            
            if (isUpArrow || (currentSectionIndex > 0 && !isDownArrow)) {
                // Scroll up
                if (currentSectionIndex > 0) {
                    const prevSection = sections[currentSectionIndex - 1];
                    if (prevSection) {
                        prevSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                        currentSectionIndex--;
                    }
                }
            } else if (isDownArrow || currentSectionIndex < sections.length - 1) {
                // Scroll down
                const nextSection = sections[currentSectionIndex + 1];
                if (nextSection) {
                    nextSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                    currentSectionIndex++;
                }
            }
            
            updateIndicator();
        });
    }
}
