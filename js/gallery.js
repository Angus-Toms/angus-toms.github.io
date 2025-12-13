const track = document.getElementById("image-track");

/* Mobile momentum tweaks */
let velocity = 0;
let lastClientX = 0;
let lastTime = 0;
let momentumRAF = null;

// Clone original images for seamless loop
const originalImages = Array.from(track.querySelectorAll('.image-card'));
originalImages.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
});

track.dataset.percentage = "0";
track.dataset.prevPercentage = "0";
let mouseDownAt = 0;

// --- Parallax ---
const updateImagePositions = (duration = 0) => {
    const viewportCenter = window.innerWidth / 2;
    for (const card of track.getElementsByClassName("image-card")) {
        const image = card.querySelector(".image");
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distanceFromCenter = (cardCenter - viewportCenter) / (window.innerWidth / 2);
        const parallaxOffset = distanceFromCenter * 20;
        const objPos = Math.max(0, Math.min(100, 50 - parallaxOffset));

        image.animate(
            { objectPosition: `${objPos}% center` },
            { duration, fill: "forwards", easing: "cubic-bezier(0.25,0.46,0.45,0.94)" }
        );
    }
};

// --- Loop logic ---
const loopWidth = track.scrollWidth / 2; // width of original images

const checkAndLoop = (nextPercentage) => {
    const trackWidth = track.scrollWidth;
    const nextX = (nextPercentage / 100) * trackWidth;
    let correctedX = nextX;

    if (nextX <= -loopWidth) correctedX += loopWidth;
    else if (nextX > 0) correctedX -= loopWidth;

    const correctedPercentage = (correctedX / trackWidth) * 100;
    track.dataset.prevPercentage = correctedPercentage;
    return correctedPercentage;
};

// --- Auto-pan setup ---
let autoPanInterval = null;
let isUserInteracting = false;
let inactivityTimeout = null;
const panSpeed = 0.005; // Adjust for speed
let autoPanDirection = -1;

const startAutoPan = () => {
    if (autoPanInterval) return;
    autoPanInterval = setInterval(() => {
        if (isUserInteracting) return;

        let currentPercentage = parseFloat(track.dataset.percentage);
        let nextPercentage = currentPercentage + panSpeed * autoPanDirection;
        nextPercentage = checkAndLoop(nextPercentage);

        track.dataset.percentage = nextPercentage;
        track.dataset.prevPercentage = nextPercentage;
        track.style.transform = `translate(${nextPercentage}%, -50%)`;
        updateImagePositions(0);
    }, 16); // ~60fps
};

const stopAutoPan = () => {
    if (autoPanInterval) {
        clearInterval(autoPanInterval);
        autoPanInterval = null;
    }
};

const scheduleAutoPanResume = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        isUserInteracting = false;
        startAutoPan();
    }, 5000); // Restart after 5s
};

// --- Interaction ---
const handleMove = (clientX) => {
    if (mouseDownAt === 0) return;
    if (!isUserInteracting) {
        isUserInteracting = true;
        stopAutoPan();
    }

    const delta = mouseDownAt - clientX;
    const maxDelta = window.innerWidth * 100;
    const percentage = (delta / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

    nextPercentage = checkAndLoop(nextPercentage);
    track.dataset.percentage = nextPercentage;

    track.style.transform = `translate(${nextPercentage}%, -50%)`;
    updateImagePositions(0);
};

// Mouse events
window.onmousedown = e => { mouseDownAt = e.clientX; };
window.onmouseup = () => { mouseDownAt = 0; track.dataset.prevPercentage = track.dataset.percentage; scheduleAutoPanResume(); };
window.onmousemove = e => handleMove(e.clientX);

// Touch events, on mobile
track.addEventListener('touchstart', e => { mouseDownAt = e.touches[0].clientX; isUserInteracting = true; stopAutoPan(); });
track.addEventListener('touchend', () => {
    mouseDownAt = 0;
    track.dataset.prevPercentage = track.dataset.percentage;

    startMomentum();
});
track.addEventListener('touchmove', e => {
    e.preventDefault();

    const touchX = e.touches[0].clientX;
    const now = performance.now();

    if (mouseDownAt === 0) {
        mouseDownAt = touchX;
        lastClientX = touchX;
        lastTime = now;
        return;
    }

    const delta = lastClientX - touchX;
    const dt = now - lastTime || 16;

    velocity = delta / dt; // px per ms

    handleMove(touchX);

    lastClientX = touchX;
    lastTime = now;
}, { passive: false });

const startMomentum = () => {
    cancelAnimationFrame(momentumRAF);

    const friction = 0.95;
    const minVelocity = 0.001;

    const step = () => {
        velocity *= friction;

        if (Math.abs(velocity) < minVelocity) {
            velocity = 0;
            scheduleAutoPanResume();
            return;
        }

        let current = parseFloat(track.dataset.percentage);
        let next = current - velocity * 16; // scale for frame time

        next = checkAndLoop(next);

        track.dataset.percentage = next;
        track.dataset.prevPercentage = next;

        track.style.transform = `translate(${next}%, -50%)`;
        updateImagePositions(0);

        momentumRAF = requestAnimationFrame(step);
    };

    step();
};

// Trackpad/scroll
window.addEventListener('wheel', e => {
    e.preventDefault();
    if (!isUserInteracting) { isUserInteracting = true; stopAutoPan(); }

    const scrollAmount = e.deltaX;
    const sensitivity = 0.01;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) - (scrollAmount * sensitivity);
    nextPercentage = checkAndLoop(nextPercentage);

    track.dataset.percentage = nextPercentage;
    track.dataset.prevPercentage = nextPercentage;
    track.style.transform = `translate(${nextPercentage}%, -50%)`;
    updateImagePositions(0);

    scheduleAutoPanResume(); // Restart after scrolling stops
}, { passive: false });

// Initialize parallax
updateImagePositions(0);
startAutoPan(); // Start auto-pan on load
