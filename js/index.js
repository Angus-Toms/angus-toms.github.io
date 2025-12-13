// Hero gallery auto-pan with parallax
const heroTrack = document.getElementById("hero-track");

if (heroTrack) {
    // Clone images for seamless loop
    const originalImages = Array.from(heroTrack.querySelectorAll('.image-card'));
    originalImages.forEach(card => {
        const clone = card.cloneNode(true);
        heroTrack.appendChild(clone);
    });

    heroTrack.dataset.percentage = "0";
    const panSpeed = 0.003;
    
    // Parallax function for hero images
    const updateHeroParallax = () => {
        const viewportCenter = window.innerWidth / 2;
        for (const card of heroTrack.getElementsByClassName("image-card")) {
            const image = card.querySelector(".image");
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distanceFromCenter = (cardCenter - viewportCenter) / (window.innerWidth / 2);
            const parallaxOffset = distanceFromCenter * 100;
            const objPos = Math.max(0, Math.min(100, 50 - parallaxOffset));
            
            image.style.objectPosition = `${objPos}% center`;
        }
    };
    
    // Auto-pan the hero gallery
    setInterval(() => {
        let currentPercentage = parseFloat(heroTrack.dataset.percentage);
        let nextPercentage = currentPercentage - panSpeed;
        
        const loopWidth = heroTrack.scrollWidth / 2;
        const trackWidth = heroTrack.scrollWidth;
        const nextX = (nextPercentage / 100) * trackWidth;
        
        // Loop seamlessly
        if (nextX <= -loopWidth) {
            nextPercentage = ((nextX + loopWidth) / trackWidth) * 100;
        }
        
        heroTrack.dataset.percentage = nextPercentage;
        heroTrack.style.transform = `translate(${nextPercentage}%, -50%)`;
        updateHeroParallax();
    }, 16);
    
    // Initial parallax
    updateHeroParallax();
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all section content
document.querySelectorAll('.section-content').forEach(section => {
    observer.observe(section);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});