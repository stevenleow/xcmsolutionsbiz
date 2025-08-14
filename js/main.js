// Main JavaScript for XCM Solutions Website
// Function to update gradient position based on scroll
function updateGradientPosition() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    
    // Get the hero and CTA sections
    const heroSection = document.getElementById('hero');
    const ctaSection = document.getElementById('cta');
    
    if (!heroSection || !ctaSection) {
        console.log('Sections not found');
        return;
    }
    
    // Calculate the scroll range between hero and CTA sections
    const heroRect = heroSection.getBoundingClientRect();
    const ctaRect = ctaSection.getBoundingClientRect();
    
    const heroEnd = heroRect.top + window.scrollY + heroRect.height;
    const ctaStart = ctaRect.top + window.scrollY;
    
    // Calculate the scroll range where gradient should transition
    const gradientStart = 0; // Start of the page
    const gradientEnd = ctaStart + (ctaRect.height / 2); // Middle of CTA section
    const gradientRange = gradientEnd - gradientStart;
    
    // Calculate the gradient position (0% at hero, 100% at CTA)
    let gradientPosition = 0;
    
    if (scrollPosition <= gradientStart) {
        // Before hero section
        gradientPosition = 0;
    } else if (scrollPosition >= gradientEnd) {
        // Past CTA section
        gradientPosition = 100;
    } else {
        // Between hero and CTA
        const scrollProgress = (scrollPosition - gradientStart) / gradientRange;
        gradientPosition = Math.min(Math.round(scrollProgress * 100), 100);
    }
    
    // Update the gradient overlay position
    const gradientOverlay = document.getElementById('gradient-overlay');
    if (gradientOverlay) {
        gradientOverlay.style.backgroundPosition = `0% ${gradientPosition}%`;
    }
    
    // Log to console for debugging
    console.log('Gradient position updated:', {
        scrollPosition,
        gradientPosition: gradientPosition + '%',
        heroEnd,
        ctaStart,
        gradientRange
    });
    
    // Update debug info if it exists
    if (window.updateDebugInfo) {
        window.updateDebugInfo(scrollPosition, documentHeight, (scrollPosition / documentHeight), gradientPosition);
    }
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

// Create debug element
function createDebugElement() {
    const debugEl = document.createElement('div');
    debugEl.id = 'gradient-debug';
    debugEl.style.position = 'fixed';
    debugEl.style.bottom = '20px';
    debugEl.style.right = '20px';
    debugEl.style.background = 'rgba(0,0,0,0.7)';
    debugEl.style.color = 'white';
    debugEl.style.padding = '10px';
    debugEl.style.borderRadius = '5px';
    debugEl.style.fontFamily = 'monospace';
    debugEl.style.zIndex = '9999';
    debugEl.style.fontSize = '12px';
    debugEl.style.pointerEvents = 'none';
    debugEl.style.maxWidth = '300px';
    debugEl.style.overflow = 'hidden';
    debugEl.style.wordBreak = 'break-all';
    
    // Add a visual indicator of the current gradient position
    const gradientPreview = document.createElement('div');
    gradientPreview.style.height = '10px';
    gradientPreview.style.marginTop = '5px';
    gradientPreview.style.borderRadius = '5px';
    gradientPreview.style.background = 'linear-gradient(to right, var(--primary), var(--primary-dark), var(--accent), var(--secondary))';
    debugEl.appendChild(gradientPreview);
    
    const positionIndicator = document.createElement('div');
    positionIndicator.style.position = 'absolute';
    positionIndicator.style.top = '0';
    positionIndicator.style.width = '2px';
    positionIndicator.style.height = '100%';
    positionIndicator.style.background = 'white';
    positionIndicator.style.transform = 'translateX(-50%)';
    gradientPreview.style.position = 'relative';
    gradientPreview.appendChild(positionIndicator);
    
    document.body.appendChild(debugEl);
    
    // Make updateDebugInfo globally available
    window.updateDebugInfo = (scrollPos, docHeight, scrollPerc, bgPos) => {
        debugEl.innerHTML = `
            <div>Scroll: ${Math.round(scrollPos)}px / ${docHeight}px</div>
            <div>Progress: ${(scrollPerc * 100).toFixed(1)}%</div>
            <div>Gradient: ${bgPos.toFixed(1)}%</div>
        `;
        
        // Re-add the gradient preview and indicator
        debugEl.appendChild(gradientPreview);
        gradientPreview.appendChild(positionIndicator);
        
        // Update the position indicator
        const indicatorPos = (bgPos / 80) * 100; // 80 is our maxPosition
        positionIndicator.style.left = `${indicatorPos}%`;
    };
    
    return debugEl;
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Create debug element
        const debugEl = createDebugElement();
        
        // Initialize TypeWriter functionality
        initTypeWriter();
        
        // Initialize back to top button
        initBackToTop();
        
        // Initialize timeline animation
        initTimelineAnimation();
        
        // Update debug info on scroll
        const updateDebugInfo = () => {
            const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollPercentage = documentHeight > 0 ? Math.min(scrollPosition / documentHeight, 1) : 0;
            const backgroundPosition = Math.round(scrollPercentage * 66.67 * 100) / 100;
            
            debugEl.innerHTML = `
                <div>Scroll: ${Math.round(scrollPosition)}px</div>
                <div>Doc Height: ${documentHeight}px</div>
                <div>Scroll %: ${(scrollPercentage * 100).toFixed(2)}%</div>
                <div>Gradient Pos: ${backgroundPosition}%</div>
            `;
        };
        
        // Create a throttled version of updateGradientPosition
        const throttledUpdateGradient = throttle(updateGradientPosition, 16);
        
        // Add scroll event listener
        window.addEventListener('scroll', () => {
            throttledUpdateGradient();
            updateDebugInfo();
        }, { passive: true });
        
        // Initial setup with a small delay to ensure DOM is ready
        setTimeout(() => {
            updateGradientPosition();
            updateDebugInfo();
            
            // Force a repaint to ensure the gradient is visible
            document.body.style.backgroundImage = 'none';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.backgroundImage = '';
        }, 100);
        
        // Update on resize with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateGradientPosition();
                updateDebugInfo();
            }, 100);
        });
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Also update on window resize to handle any layout changes
window.addEventListener('resize', throttle(updateGradientPosition, 100));

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