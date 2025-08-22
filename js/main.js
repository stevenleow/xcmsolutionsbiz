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

// Debug element functionality (kept in code but not displayed)
function createDebugElement() {
    // Return a mock object with a no-op updatePosition method
    return {
        updatePosition: function() {}
    };
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
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
            
            const debugEl = createDebugElement();
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
        
        const processSection = document.getElementById('process');
        if (!processSection) return;

        // Get the process section's position
        const sectionRect = processSection.getBoundingClientRect();
        const isPartiallyInView = (
            sectionRect.top <= window.innerHeight &&
            sectionRect.bottom >= 0
        );
        const isAboveViewport = sectionRect.bottom < 0;

        // If we're in or above the process section, try to reset any scrolling
        if (isPartiallyInView || isAboveViewport) {
            // Try different elements that might be scrollable
            const elementsToCheck = [
                '.process-content-wrapper',
                '.process-timeline',
                'html, body'
            ];

            let foundScrollable = false;

            elementsToCheck.forEach(selector => {
                const el = document.querySelector(selector);
                if (!el) return;

                const scrollTop = el.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;

                if (scrollTop > 10) {
                    foundScrollable = true;
                    
                    // Smooth scroll to top
                    el.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });

            if (!foundScrollable) {
                // As a last resort, try scrolling the window to the top of the process section
                processSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Original scroll to top behavior
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// TypeWriter Class
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        // Store references
        this.txtElement = txtElement;
        this.words = words.map(word => String(word));
        this.txt = '';
        this.wordIndex = 0;
        this.wait = Math.max(parseInt(wait, 10) || 3000, 1000);
        this.isDeleting = false;
        this.isActive = false;
        this.animationId = null;
        this.lastTime = 0;
        this.typingDelay = 100; // ms per character when typing
        this.erasingDelay = 50; // ms per character when erasing
        this.newTextDelay = 1000; // delay between words
        
        // Create DOM elements
        this.wrap = document.createElement('span');
        this.wrap.className = 'wrap';
        this.textSpan = document.createElement('span');
        this.textSpan.className = 'text text-gradient';
        this.cursor = document.createElement('span');
        this.cursor.className = 'cursor';
        this.wrap.appendChild(this.textSpan);
        this.wrap.appendChild(this.cursor);
        this.txtElement.innerHTML = '';
        this.txtElement.appendChild(this.wrap);
        
        // Initialize
        this.init();
    }
    
    init() {
        this.isActive = true;
        this.txtElement.style.visibility = 'visible';
        this.txtElement.style.opacity = '1';
        this.txtElement.style.minHeight = this.txtElement.offsetHeight + 'px';
        
        // Start the animation loop
        this.animate(0);
    }
    
    animate(timestamp) {
        if (!this.isActive) return;
        
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Get current word and set typing speed
        const currentWord = this.words[this.wordIndex % this.words.length];
        let typeSpeed = this.isDeleting ? this.erasingDelay : this.typingDelay;
        
        // Update text content
        if (this.isDeleting) {
            this.txt = currentWord.substring(0, this.txt.length - 1);
        } else {
            this.txt = currentWord.substring(0, this.txt.length + 1);
        }
        
        // Update DOM
        this.textSpan.textContent = this.txt;
        
        // Determine next step
        if (!this.isDeleting && this.txt === currentWord) {
            // Pause at end of word
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            // Move to next word
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = this.newTextDelay;
        }
        
        // Continue animation loop
        this.animationId = setTimeout(() => {
            requestAnimationFrame(this.animate.bind(this));
        }, typeSpeed);
    }
    
    cleanup() {
        this.isActive = false;
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
        
        if (this.txtElement) {
            this.txtElement.style.visibility = '';
            this.txtElement.style.opacity = '';
            this.txtElement.style.minHeight = '';
            this.txtElement.innerHTML = '';
        }
        
        // Clear references
        this.txtElement = null;
        this.words = [];
        this.txt = '';
    }
}

// Initialize TypeWriter Effect
function initTypeWriter() {
    try {
        const txtElement = document.querySelector('#typing-text');
        const words = [
            "ROI-Focused AI Solutions",
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


// Animate apostrophes in strapline text with breathing effect
function initStraplineAnimation() {
    const strapline = document.querySelector('.strapline');
    if (!strapline) {
        console.log('Strapline element not found');
        return;
    }

    // Get the text content
    const text = strapline.textContent;
    
    // Replace apostrophes with spans for animation
    const html = text.replace(/'/g, '<span class="strapline-quote">\'</span>');
    strapline.innerHTML = html;
    
    const quoteElements = strapline.querySelectorAll('.strapline-quote');
    if (quoteElements.length !== 2) {
        return;
    }
    
    // Start with first quote breathing in, second breathing out
    quoteElements[0].classList.add('breathing-in');
    quoteElements[1].classList.add('breathing-out');
    
    // Breathing cycle duration in milliseconds (20% faster than before)
    const BREATH_DURATION = 3200;
    
    function toggleBreathing() {
        // Toggle breathing states between the two apostrophes
        quoteElements[0].classList.toggle('breathing-in');
        quoteElements[0].classList.toggle('breathing-out');
        
        quoteElements[1].classList.toggle('breathing-in');
        quoteElements[1].classList.toggle('breathing-out');
        
        // Schedule the next toggle
        setTimeout(toggleBreathing, BREATH_DURATION);
    }
    
    // Start the breathing cycle
    setTimeout(toggleBreathing, BREATH_DURATION);
}

// Function to handle process timeline auto-scroll
function initProcessTimelineScroll() {
    const processSection = document.getElementById('process');
    const contentWrapper = document.querySelector('.process-content-wrapper');
    let scrollTimeout;
    let hasScrolled = false;
    
    if (!processSection || !contentWrapper) {
        console.log('Process section or content wrapper not found');
        return;
    }
    
    // Function to reset scroll position
    function resetScroll() {
        if (contentWrapper) {
            contentWrapper.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            hasScrolled = false;
        }
    }
    
    // Create intersection observer to detect when process section is in/out of view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Clear any pending timeouts
                clearTimeout(scrollTimeout);
                
                // Only auto-scroll if we haven't scrolled yet
                if (!hasScrolled) {
                    scrollTimeout = setTimeout(() => {
                        const scrollAmount = contentWrapper.scrollHeight * 0.6;
                        
                        // Make sure the element is scrollable
                        contentWrapper.style.overflowY = 'auto';
                        contentWrapper.style.scrollBehavior = 'smooth';
                        
                        // Smooth scroll the content wrapper
                        contentWrapper.scrollTo({
                            top: scrollAmount,
                            behavior: 'smooth'
                        });
                        
                        hasScrolled = true;
                    }, 2900); // 2.9 seconds delay
                }
            } else {
                // When scrolling out of view, reset the scroll position
                resetScroll();
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Adjust the bottom margin to trigger slightly earlier
    });
    
    // Observe the process section
    observer.observe(processSection);
    
    // Also reset scroll when the page is unloaded
    window.addEventListener('beforeunload', resetScroll);
    
    // Cleanup function
    return () => {
        clearTimeout(scrollTimeout);
        observer.disconnect();
        window.removeEventListener('beforeunload', resetScroll);
    };
}

// Main initialization call
document.addEventListener('DOMContentLoaded', function() {
    try {
        initTypeWriter();
        initProcessTimelineScroll();
        initServicesCarousel();
        initTimelineAnimation();
        initStraplineAnimation();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});