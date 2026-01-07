
// Smooth scroll for same-page navigation (supports full URLs with hashes)
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href) {
            return;
        }

        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) {
            return;
        }

        const hash = href.slice(hashIndex);
        if (!hash || hash === '#') {
            return;
        }

        const url = new URL(href, window.location.href);
        if (url.pathname !== window.location.pathname) {
            return;
        }

        const target = document.querySelector(hash);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
