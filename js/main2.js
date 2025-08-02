document.addEventListener('DOMContentLoaded', function() {

    // Responsive Navigation - Hamburger Menu
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav');
    const navToggle = document.createElement('button');
    navToggle.innerHTML = '<span></span><span></span><span></span>';
    navToggle.setAttribute('class', 'nav-toggle');
    navToggle.setAttribute('aria-label', 'Toggle navigation');
    header.querySelector('.container').appendChild(navToggle);

    navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
        navToggle.classList.toggle('open');
    });

    // Close nav when a link is clicked
    document.querySelectorAll('header nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-open');
            navToggle.classList.remove('open');
        });
    });


    // Scroll-Reveal Animations
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    // Add 'reveal' class to elements you want to animate
    document.querySelectorAll('.hero-text, .service-item, .about-content, .contact form, .testimonial-item, .client-logo').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

});
