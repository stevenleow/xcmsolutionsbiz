// Animate numbers
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Handle decimal numbers for percentage
        if (obj.textContent.includes('.')) {
            obj.textContent = (progress * (end - start) + start).toFixed(1);
        } else {
            obj.textContent = Math.floor(progress * (end - start) + start);
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize counters when in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const countElements = entry.target.querySelectorAll('[data-count]');
            countElements.forEach(el => {
                const target = parseFloat(el.getAttribute('data-count'));
                animateValue(el, 0, target, 2000);
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Initialize particles.js with a more subtle effect for the main page
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: 40, 
                    density: { 
                        enable: true, 
                        value_area: 800 
                    } 
                },
                color: { 
                    value: "#00a0e9" 
                },
                opacity: {
                    value: 0.3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00a0e9",
                    opacity: 0.2,
                    width: 1
                },
                shape: { 
                    type: "circle" 
                },
                size: { 
                    value: 3, 
                    random: true 
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { 
                        enable: true, 
                        mode: "grab" 
                    },
                    onclick: { 
                        enable: true, 
                        mode: "push" 
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    } else {
        // If particles.js fails to load, try again after a delay
        setTimeout(initParticles, 500);
    }
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && menuToggle) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Typing animation for hero section
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.isWaiting = false;
        this.type();
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if we're in waiting state (after typing complete)
        if (this.isWaiting) {
            // After waiting period, start deleting
            this.isWaiting = false;
            this.isDeleting = true;
            return this.type();
        }

        // Check if deleting
        if (this.isDeleting) {
            // Remove a character
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add just one character at a time
            const nextChar = fullTxt[this.txt.length];
            if (nextChar) {
                this.txt += nextChar;
            }
        }

        // Update text content with cursor
        this.txtElement.innerHTML = this.txt + '<span class="typing-cursor">|</span>';

        // Set speeds
        let typeSpeed = 100;    // 100ms per character when typing
        const deleteSpeed = 50;  // 50ms per character when deleting (twice as fast)
        
        // If word is completely typed
        if (!this.isDeleting && this.txt === fullTxt) {
            // Set waiting state before deleting
            this.isWaiting = true;
            // Wait for 2 seconds before starting to delete
            typeSpeed = 2000;
        } 
        // If word is completely deleted
        else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            // Pause for 0.5 seconds before starting next word
            typeSpeed = 500;
        }
        
        // Determine current speed based on state
        const currentSpeed = this.isDeleting ? deleteSpeed : typeSpeed;

        // Set timeout for next character
        setTimeout(() => this.type(), currentSpeed);
    }
}

// Log viewport and header dimensions
function logViewportInfo() {
    const viewportHeight = window.innerHeight;
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const remainingHeight = viewportHeight - headerHeight;
    
    console.log('Viewport height (100vh):', viewportHeight + 'px');
    console.log('Header height:', headerHeight + 'px');
    console.log('100vh - header height:', remainingHeight + 'px');
    console.log('----------------------------------');
}

// Function to log section information
function logSectionHeights() {
    console.log('=== Section Information ===');
    const sections = document.querySelectorAll('section');
    console.log(`Found ${sections.length} sections on the page`);
    
    sections.forEach((section, index) => {
        const sectionId = section.id || 'unnamed-section';
        const sectionClasses = section.className || 'no-classes';
        const rect = section.getBoundingClientRect();
        const height = Math.round(rect.height);
        const width = Math.round(rect.width);
        const top = Math.round(rect.top);
        const left = Math.round(rect.left);
        
        console.group(`Section #${index + 1}: #${sectionId}`);
        console.log(`Classes: ${sectionClasses}`);
        console.log(`Dimensions: ${width}px × ${height}px`);
        console.log(`Position: ${left}px from left, ${top}px from top`);
        console.log(`Element:`, section);
        console.groupEnd();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Log initial viewport info
    logViewportInfo();
    
    // Log section heights after a short delay to ensure all content is loaded
    setTimeout(logSectionHeights, 500);
    
    // Log on window resize
    window.addEventListener('resize', logViewportInfo);
    // Initialize typing animation
    const txtElements = document.querySelectorAll('.typing-text');
    if (txtElements.length > 0) {
        txtElements.forEach(txtEl => {
            const words = JSON.parse(txtEl.getAttribute('data-words') || '[]');
            const wait = txtEl.getAttribute('data-wait') || 3000;
            new TypeWriter(txtEl, words, wait);
        });
    }

    // Initialize particles
    initParticles();
    
    // Observe elements with data-count for counting animation
    document.querySelectorAll('.counter-section').forEach(section => {
        observer.observe(section);
    });
    
    // Show all elements immediately (no scroll animation)
    document.querySelectorAll('.service-card, .about-content, .section-header').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const subject = this.querySelector('#subject').value.trim();
            const message = this.querySelector('#message').value.trim();
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const submitBtnText = submitBtn.querySelector('span');
            const originalBtnText = submitBtnText.textContent;
            
            submitBtn.disabled = true;
            submitBtnText.textContent = 'Sending...';
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                const formContainer = document.querySelector('.contact-form-container');
                if (formContainer) {
                    formContainer.classList.add('form-submitted');
                }
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtnText.textContent = originalBtnText;
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    if (formContainer) {
                        formContainer.classList.remove('form-submitted');
                    }
                }, 5000);
            }, 1500);
        });
    }
    
    // Initialize particles.js
    initParticles();
    
    // Initial animations
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Observe elements with counters
    const counterSection = document.querySelector('.counter-section');
    if (counterSection) {
        observer.observe(counterSection);
    }
});
