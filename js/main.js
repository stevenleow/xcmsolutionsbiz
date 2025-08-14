



// Main JavaScript for XCM Solutions Website
// Section-specific background configurations
const sectionBackgrounds = {
    'hero': {
        start: '#0A2540',  // Deep Blue
        end: '#0D2D4F'     // Slightly lighter blue
    },
    'advantage': {
        start: '#0D2D4F',  // Slightly lighter blue
        end: '#7A52CC'     // Violet
    },
    'services': {
        start: '#7A52CC',  // Violet
        end: '#00D4D4'     // Bright Teal
    },
    'process': {
        start: '#00D4D4',  // Bright Teal
        end: '#0A8B8B'     // Darker Teal
    },
    'cta': {
        start: '#0A8B8B',  // Darker Teal
        end: '#0A2540'     // Back to Deep Blue
    },
    'default': {
        start: '#0A2540',  // Deep Blue
        end: '#0D2D4F'     // Slightly lighter blue
    }
};

// Function to update section backgrounds based on visibility
function updateSectionBackgrounds() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.id || 'default';
        const sectionConfig = sectionBackgrounds[sectionId] || sectionBackgrounds['default'];
        
        // Calculate how much of the section is visible
        const sectionScrollPosition = scrollPosition + (windowHeight / 2);
        const sectionScrollEnd = sectionTop + sectionHeight;
        
        // Only update if section is in or near viewport
        if (sectionScrollPosition >= (sectionTop - windowHeight) && 
            sectionScrollPosition <= (sectionScrollEnd + windowHeight)) {
            
            // Calculate scroll percentage within the section
            let scrollPercent = (sectionScrollPosition - sectionTop) / (sectionHeight + windowHeight);
            scrollPercent = Math.max(0, Math.min(1, scrollPercent)); // Clamp between 0 and 1
            
            // Update the section's background
            section.style.background = `linear-gradient(135deg, 
                ${sectionConfig.start} 0%, 
                ${sectionConfig.end} 100%)`;
        }
    });
}

// Throttle function to limit how often the scroll event fires
function throttle(callback, limit) {
    let waiting = false;
    return function() {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize TypeWriter functionality
        initTypeWriter();
        
        // Initialize back to top button
        initBackToTop();
        
        // Initialize timeline animation
        initTimelineAnimation();
        
        // Add scroll event listener for background transition
        window.addEventListener('scroll', throttle(updateSectionBackgrounds, 50));
        
        // Initial background setup
        updateSectionBackgrounds();
        
    } catch (error) {
        console.error('Initialization error:', error);
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
                ('Error during TypeWriter initialization:', e);
                this.cleanup();
                throw e; // Re-throw to be caught by the outer try-catch
            }
            
        } catch (e) {
            ('Failed to initialize TypeWriter:', e);
            this.cleanup();
        }
    }

    handleResize() {
        if (!this.isActive) return;
        
        try {
            // Recalculate layout on window resize
            this.adjustTextSize();
        } catch (e) {
            ('Error in handleResize:', e);
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
            ('Error in adjustTextSize:', e);
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
                ('Error updating text element:', e);
                this.cleanup();
            }
            
        } catch (e) {
            ('Error in TypeWriter animation:', e);
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
                    ('Error removing resize listener:', e);
                }
            }
            
            // Clean up element references
            if (this.txtElement) {
                try {
                    // Remove any inline styles we added
                    this.txtElement.style.visibility = '';
                    this.txtElement.style.opacity = '';
                } catch (e) {
                    ('Error cleaning up text element:', e);
                }
                this.txtElement = null;
            }
            
            // Clear other references
            this.words = [];
            this.txt = '';
            
        } catch (e) {
            ('Error during TypeWriter cleanup:', e);
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
        const txtElement = document.querySelector('#typing-text');
        const words = [
            "ROI-Focused Solutions",
            "Business-Optimized Technology",
            "Dependable Infrastructure",
            "Intelligent Automation",
            "Comprehensive End-to-End Support"
        ];
        const wait = txtElement.getAttribute('data-wait');
        
        if (txtElement) {
            new TypeWriter(txtElement, words, wait);
        }
    } catch (e) {
        ('Error initializing TypeWriter:', e);
    }
}

// Initialize Services Carousel
let servicesSwiper;
function initServicesCarousel() {
    try {
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
        ('Error initializing services carousel:', e);
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

// Initialize Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a delay based on the item's index to stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200); // 200ms delay between each item
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the item is visible
        rootMargin: '0px 0px -50px 0px' // Trigger a little before it's fully in view
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}


// Main initialization call
document.addEventListener('DOMContentLoaded', function() {
    
    
    try {
        initTypeWriter();
        initServicesCarousel();
        initTimelineAnimation();
        
    } catch (error) {
        
    }
});