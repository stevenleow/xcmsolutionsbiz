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
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="wrap">${this.txt}</span>`;

        let typeSpeed = 150;

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

    // Add "Scroll to Explore" indicator to all sections except the last
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        // Don't add the button to the last section
        if (index < sections.length - 1) {
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            scrollIndicator.innerHTML = `
                <div class="scroll-indicator-content">
                    <span class="scroll-text">Scroll to Explore</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
            `;
            section.appendChild(scrollIndicator);

            scrollIndicator.addEventListener('click', () => {
                const nextSection = sections[index + 1];
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
});
