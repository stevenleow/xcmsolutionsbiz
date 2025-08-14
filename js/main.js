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


// Main initialization call
document.addEventListener('DOMContentLoaded', function() {
    
    
    try {
        initTypeWriter();
        initServicesCarousel();
        initTimelineAnimation();
        
    } catch (error) {
        
    }
});