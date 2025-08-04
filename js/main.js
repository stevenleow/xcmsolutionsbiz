document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed. Initializing scripts.');

    // --- Retained Features ---

    // Typing animation class
    class TypeWriter {
        constructor(txtElement, words, wait = 3000) {
            this.txtElement = txtElement;
            this.words = JSON.parse(words);
            this.wait = parseInt(wait, 10);
            this.txt = '';
            this.wordIndex = 0;
            this.isDeleting = false;
            this.type();
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.txtElement.innerHTML = `${this.txt}<span class="typing-cursor">|</span>`;

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

    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        try {
            new TypeWriter(typingElement, typingElement.getAttribute('data-words'), typingElement.getAttribute('data-wait'));
        } catch(e) {
            console.error("Could not initialize TypeWriter:", e);
        }
    }

    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        const particlesElement = document.getElementById('particles-js');
        if (particlesElement) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 40, density: { enable: true, value_area: 800 } },
                    color: { value: "#00a0e9" },
                    opacity: { value: 0.3, random: true },
                    line_linked: { enable: true, distance: 150, color: "#00a0e9", opacity: 0.2, width: 1 },
                    shape: { type: "circle" },
                    size: { value: 3, random: true },
                    move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true }
                },
                retina_detect: true
            });
        }
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formContainer = document.querySelector('.contact-form-container');
            if (formContainer) {
                formContainer.classList.add('form-submitted');
            }
            setTimeout(() => {
                contactForm.reset();
                if (formContainer) {
                    formContainer.classList.remove('form-submitted');
                }
            }, 5000);
        });
    }

    // --- Snap Scrolling Implementation ---

    const sections = Array.from(document.querySelectorAll('section'));
    if (sections.length < 2) {
        console.log('Not enough sections for snap scrolling.');
        return;
    }

    let currentSectionIndex = 0;
    let isSnapping = false;

    // On page load, determine which section is currently in view.
    const findInitialSection = () => {
        // If the page is loaded at the very top, we are on the first section.
        if (window.scrollY < 50) {
            return 0;
        }

        // Otherwise, find the section closest to the top of the viewport.
        let closestIndex = 0;
        let minDistance = Infinity;
        sections.forEach((section, index) => {
            const distance = Math.abs(section.getBoundingClientRect().top);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
        return closestIndex;
    };
    
    // Set the initial section index after the page has had a moment to lay out.
    setTimeout(() => {
        currentSectionIndex = findInitialSection();
    }, 100);


    const snapToSection = (index) => {
        if (index < 0 || index >= sections.length || isSnapping) {
            return;
        }

        isSnapping = true;
        currentSectionIndex = index;
        const targetSection = sections[index];

        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Set a timeout to reset the isSnapping flag. This acts as a cooldown.
        setTimeout(() => {
            isSnapping = false;
        }, 1500); // Increased cooldown to prevent race conditions.
    };

    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (isSnapping) return;

        const direction = event.deltaY > 0 ? 'down' : 'up';
        if (direction === 'down') {
            snapToSection(currentSectionIndex + 1);
        } else {
            snapToSection(currentSectionIndex - 1);
        }
    }, { passive: false });

    window.addEventListener('keydown', (event) => {
        if (isSnapping) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            snapToSection(currentSectionIndex + 1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            snapToSection(currentSectionIndex - 1);
        }
    });
});