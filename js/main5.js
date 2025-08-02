document.addEventListener('DOMContentLoaded', function() {

    // --- Typewriter Effect ---
    const typeWriterElement = document.querySelector('.typewriter');
    if (typeWriterElement) {
        const text = typeWriterElement.getAttribute('data-text');
        let i = 0;
        typeWriterElement.innerHTML = ''; // Clear existing text

        function type() {
            if (i < text.length) {
                typeWriterElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 100); // Adjust typing speed here
            } else {
                typeWriterElement.classList.add('completed');
            }
        }
        setTimeout(type, 1000); // Initial delay before typing starts
    }


    // --- Scroll-Reveal Animations ---
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

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

});
