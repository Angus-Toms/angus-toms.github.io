document.addEventListener('DOMContentLoaded', () => {
    // Collect all gallery images into a navigable array
    const photoItems = Array.from(document.querySelectorAll('.photo-item'));
    const images = photoItems
        .map(item => item.querySelector('img'))
        .filter(Boolean)
        .map(img => ({ src: img.src, alt: img.alt }));

    let currentIndex = 0;
    let isAnimating = false;

    // Build carousel lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" type="button" aria-label="Close">CLOSE</button>
        <button class="lightbox-prev" type="button" aria-label="Previous photo">&#8592;</button>
        <figure class="lightbox-content">
            <img class="lightbox-image" alt="">
        </figure>
        <button class="lightbox-next" type="button" aria-label="Next photo">&#8594;</button>
    `;
    document.body.appendChild(lightbox);

    const img      = lightbox.querySelector('.lightbox-image');
    const prevBtn  = lightbox.querySelector('.lightbox-prev');
    const nextBtn  = lightbox.querySelector('.lightbox-next');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const open = (index) => {
        currentIndex = index;
        img.style.transition = 'none';
        img.style.opacity = '1';
        img.style.transform = 'translateX(0)';
        img.src = images[currentIndex].src;
        img.alt = images[currentIndex].alt;
        lightbox.classList.add('is-active');
        document.body.classList.add('lightbox-open');
    };

    const close = () => {
        lightbox.classList.remove('is-active');
        document.body.classList.remove('lightbox-open');
    };

    const slide = (direction) => {
        if (isAnimating || images.length <= 1) return;
        isAnimating = true;

        const nextIndex = (currentIndex + direction + images.length) % images.length;
        const outX = direction > 0 ? '-50px' : '50px';
        const inX  = direction > 0 ? '60px' : '-60px';

        // Slide current image out
        img.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        img.style.opacity    = '0';
        img.style.transform  = `translateX(${outX})`;

        setTimeout(() => {
            currentIndex = nextIndex;
            img.src = images[currentIndex].src;
            img.alt = images[currentIndex].alt;

            // Reset to entry position without transition, then slide in
            img.style.transition = 'none';
            img.style.transform  = `translateX(${inX})`;
            img.offsetHeight; // force reflow

            img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            img.style.opacity    = '1';
            img.style.transform  = 'translateX(0)';

            setTimeout(() => { isAnimating = false; }, 310);
        }, 260);
    };

    // Open on photo click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.lightbox-close, .lightbox-prev, .lightbox-next')) return;
        const item = e.target.closest('.photo-item');
        if (!item) return;
        const clickedImg = item.querySelector('img');
        if (!clickedImg) return;
        const index = images.findIndex(i => i.src === clickedImg.src);
        open(index >= 0 ? index : 0);
    });

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); slide(-1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); slide(1); });
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-active')) return;
        if (e.key === 'Escape')      close();
        if (e.key === 'ArrowRight')  slide(1);
        if (e.key === 'ArrowLeft')   slide(-1);
    });
});
