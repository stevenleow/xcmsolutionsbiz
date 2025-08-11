console.log('--- SCRIPT UPDATE CHECK: VERSION 3 ---')

// Main JavaScript for XCM Solutions Website
document.addEventListener('DOMContentLoaded', function() {
    console.log('XCM Solutions website loaded - Starting initialization...');
    
    try {
        // Initialize TypeWriter functionality
        initTypeWriter();
        
        // Initialize back to top button
        initBackToTop();
        
        console.log('XCM Solutions website initialized');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Back to Top Functionality
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// TypeWriter Class
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        // Validate and initialize properties
        try {
            // Validate element
            if (!txtElement || !(txtElement instanceof HTMLElement)) {
                throw new Error('Invalid text element provided to TypeWriter');
            }
            
            // Validate words array
            if (!Array.isArray(words) || words.length === 0) {
                throw new Error('Invalid or empty words array provided to TypeWriter');
            }
            
            // Validate element is in the DOM
            if (!document.body.contains(txtElement)) {
                console.warn('TypeWriter element is not in the DOM');
                return;
            }
            
            // Store references
            this.txtElement = txtElement;
            this.words = words.map(word => String(word)); // Ensure all words are strings
            this.txt = '';
            this.wordIndex = 0;
            this.wait = Math.max(parseInt(wait, 10) || 3000, 1000); // Ensure minimum 1s delay
            this.isDeleting = false;
            this.animationFrame = null;
            this.isActive = false; // Start inactive until fully initialized
            
            // Bind methods
            this.handleResize = this.handleResize.bind(this);
            this.type = this.type.bind(this);
            this.cleanup = this.cleanup.bind(this);
            
            // Initial setup
            try {
                // Store original styles for cleanup
                this.originalStyles = {
                    visibility: txtElement.style.visibility,
                    opacity: txtElement.style.opacity,
                    minHeight: txtElement.style.minHeight
                };
                
                // Apply initial styles
                txtElement.style.visibility = 'visible';
                txtElement.style.opacity = '1';
                txtElement.style.minHeight = '1.2em'; // Prevent layout shifts
                
                // Add event listeners
                window.addEventListener('resize', this.handleResize);
                
                // Mark as active and start typing
                this.isActive = true;
                
                // Start with a small delay to allow the browser to render
                setTimeout(() => {
                    if (this.isActive) {
                        this.type();
                    }
                }, 100);
                
            } catch (e) {
                console.error('Error during TypeWriter initialization:', e);
                this.cleanup();
                throw e; // Re-throw to be caught by the outer try-catch
            }
            
        } catch (e) {
            console.error('Failed to initialize TypeWriter:', e);
            this.cleanup();
        }
    }

    handleResize() {
        if (!this.isActive) return;
        
        try {
            // Recalculate layout on window resize
            this.adjustTextSize();
        } catch (e) {
            console.warn('Error in handleResize:', e);
        }
    }
    
    adjustTextSize() {
        if (!this.isActive || !this.txtElement) return;
        
        try {
            const container = this.txtElement;
            if (!container.offsetParent) return; // Skip if not visible
            
            const text = container.querySelector('.wrap');
            if (!text) return;
            
            // Reset to base size
            text.style.fontSize = '';
            
            // Check if text overflows
            if (text.scrollWidth > container.offsetWidth) {
                const computedStyle = window.getComputedStyle(container);
                const baseSize = parseFloat(computedStyle.fontSize) || 16;
                const scale = Math.max(0.1, Math.min(1, (container.offsetWidth - 20) / text.scrollWidth));
                const newSize = Math.max(baseSize * scale, 12); // 12px minimum font size
                text.style.fontSize = `${newSize}px`;
            }
        } catch (e) {
            console.warn('Error in adjustTextSize:', e);
        }
    }

    type() {
        // Double-check if we should continue
        if (!this.isActive || !this.txtElement || !this.txtElement.isConnected) {
            this.cleanup();
            return;
        }

        try {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];
            
            // Update the text
            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            // Safely update the element with cursor at the end of text
            try {
                if (this.txtElement && this.txtElement.isConnected) {
                    // Create the text with cursor
                    this.txtElement.innerHTML = `
                        <span class="wrap">
                            <span class="text text-gradient">${this.txt}</span>
                            <span class="cursor"></span>
                        </span>
                    `;
                    
                    // Determine typing speed
                    let typeSpeed = this.isDeleting ? 50 : 100; // 20 chars/sec deleting, 10 chars/sec typing

                    // If word is complete
                    if (!this.isDeleting && this.txt === fullTxt) {
                        typeSpeed = this.wait; // Pause at end
                        this.isDeleting = true;
                    } else if (this.isDeleting && this.txt === '') {
                        this.isDeleting = false;
                        this.wordIndex++;
                        typeSpeed = 500; // Pause before new word
                    }
                    
                    // Schedule next frame
                    this.animationFrame = setTimeout(() => this.type(), typeSpeed);

                } else {
                    this.cleanup();
                }
            } catch (e) {
                console.error('Error updating text element:', e);
                this.cleanup();
            }
            
        } catch (e) {
            console.error('Error in TypeWriter animation:', e);
            this.cleanup();
        }
    }
    
    cleanup() {
        try {
            this.isActive = false;
            
            // Clear any pending animation frame
            if (this.animationFrame) {
                clearTimeout(this.animationFrame);
                this.animationFrame = null;
            }
            
            // Remove event listeners
            if (this.handleResize) {
                try {
                    window.removeEventListener('resize', this.handleResize);
                } catch (e) {
                    console.warn('Error removing resize listener:', e);
                }
            }
            
            // Clean up element references
            if (this.txtElement) {
                try {
                    // Remove any inline styles we added
                    this.txtElement.style.visibility = '';
                    this.txtElement.style.opacity = '';
                } catch (e) {
                    console.warn('Error cleaning up text element:', e);
                }
                this.txtElement = null;
            }
            
            // Clear other references
            this.words = [];
            this.txt = '';
            
        } catch (e) {
            console.error('Error during TypeWriter cleanup:', e);
        } finally {
            // Ensure we don't leak memory
            this.animationFrame = null;
            this.txtElement = null;
            this.words = [];
        }
        
        // Clear other references
        this.words = [];
        this.txt = '';
        
    }
}

// Initialize TypeWriter Effect
function initTypeWriter() {
    try {
        console.log('Initializing TypeWriter effect...');
        
        const txtElement = document.querySelector('.typing-text');
        if (!txtElement) {
            console.warn('TypeWriter element (.typing-text) not found in the document');
            return;
        }

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('TypeWriter element is in view. Starting animation.');
                    const wordsAttr = txtElement.getAttribute('data-words');
                    const waitAttr = txtElement.getAttribute('data-wait') || '3000';
                    
                    if (!wordsAttr) {
                        console.warn('TypeWriter: Missing required data-words attribute');
                        return;
                    }
                    
                    let words;
                    try {
                        words = JSON.parse(wordsAttr);
                    } catch (e) {
                        console.error('TypeWriter: Failed to parse data-words attribute as JSON:', e);
                        return;
                    }
                    
                    const wait = Math.max(parseInt(waitAttr, 10) || 3000, 1000);
                    
                    window.currentTypeWriter = new TypeWriter(txtElement, words, wait);
                    
                    // Stop observing once initialized
                    observer.unobserve(txtElement);
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        observer.observe(txtElement);
        
    } catch (e) {
        console.error('Unexpected error in initTypeWriter:', e);
    }
}

// Initialize Services Carousel
let servicesSwiper;
function initServicesCarousel() {
    try {
        console.log('Initializing Services Carousel...');
        servicesSwiper = new Swiper('.services-carousel', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto', // This makes sure slides don't get squished
            initialSlide: 0,
            coverflowEffect: {
                rotate: 30,
                stretch: 50,
                depth: 100,
                modifier: 1,
                slideShadows: true,
                scale: 0.8,
            },
            breakpoints: {
                300: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                },
                900: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                },
            },
            centeredSlides: true,
            loop: true,
            loopedSlides: 5, // Should match the number of slides
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function() {
                    // Force update after initialization to ensure proper rendering
                    setTimeout(() => this.update(), 100);
                },
            },
        });
    } catch (e) {
        console.error('Error initializing services carousel:', e);
    }
}

// Handle service card navigation from footer
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('service-link') || e.target.closest('.service-link')) {
        e.preventDefault();
        const link = e.target.classList.contains('service-link') ? e.target : e.target.closest('.service-link');
        const serviceIndex = parseInt(link.getAttribute('data-service'));
        
        if (!isNaN(serviceIndex) && servicesSwiper) {
            const servicesSection = document.querySelector('#services');
            
            // First, show the services section
            servicesSection.scrollIntoView({ behavior: 'smooth' });
            
            // Calculate the correct slide index considering loop
            const slides = document.querySelectorAll('.swiper-slide');
            const realIndex = serviceIndex % servicesSwiper.slides.length;
            
            // Wait for scroll to complete
            setTimeout(() => {
                // Force update the swiper
                servicesSwiper.update();
                
                // Slide to the specific service with animation
                servicesSwiper.slideToLoop(realIndex, 800, false);
                
                // Force update after animation completes
                setTimeout(() => servicesSwiper.update(), 850);
            }, 100);
        }
    }
});

// Main initialization call
document.addEventListener('DOMContentLoaded', function() {
    console.log('XCM Solutions website loaded - Starting initialization...');
    
    try {
        initTypeWriter();
        initServicesCarousel();
        console.log('XCM Solutions website initialized');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});