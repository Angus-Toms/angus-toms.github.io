// ==============================
// GALLERY IMAGE LIST
// Edit this array to add / remove / reorder photos
// ==============================
const GALLERY_IMAGES = [
    { src: 'imgs/general/general_1.webp',   alt: 'EBF RT' },
    { src: 'imgs/sam_ch/sam_ch_1.webp',     alt: 'Sam — 2025 Scottish Road Race Champion' },
    { src: 'imgs/general/general_2.webp',   alt: 'EBF RT' },
    { src: 'imgs/elijah/elijah_1.webp',     alt: 'Elijah on the attack at the 2025 Tour of Guizhou' },
    { src: 'imgs/general/general_3.webp',   alt: 'EBF RT' },
    { src: 'imgs/craig/craig_1.webp',       alt: 'Craig' },
    { src: 'imgs/general/general_4.webp',   alt: 'EBF RT' },
    { src: 'imgs/matti/matti_3.webp',       alt: 'Matti Dobbins' },
    { src: 'imgs/general/general_5.webp',   alt: 'EBF RT' },
    { src: 'imgs/sam_ca/sam_ca_2.webp',     alt: 'Sam Carrotte' },
    { src: 'imgs/general/general_6.webp',   alt: 'EBF RT' },
    { src: 'imgs/mungo/mungo_1.webp',       alt: 'Mungo' },
    { src: 'imgs/general/general_7.webp',   alt: 'EBF RT' },
    { src: 'imgs/finn/finn_2.webp',         alt: 'Finn' },
    { src: 'imgs/general/general_8.webp',   alt: 'EBF RT' },
    { src: 'imgs/sam_ch/sam_ch_2.webp',     alt: 'Sam wins the 2025 Scottish Road Race Championships' },
    { src: 'imgs/general/general_9.webp',   alt: 'EBF RT' },
    { src: 'imgs/elijah/elijah_2.webp',     alt: 'Elijah at the 2025 Tour of Kosovo' },
    { src: 'imgs/general/general_10.webp',  alt: 'EBF RT' },
    { src: 'imgs/craig/craig_2.webp',       alt: 'Craig' },
    { src: 'imgs/general/general_11.webp',  alt: 'EBF RT' },
    { src: 'imgs/matti/matti_4.webp',       alt: 'Matti Dobbins' },
    { src: 'imgs/general/general_12.webp',  alt: 'EBF RT' },
    { src: 'imgs/sam_ca/sam_ca_3.webp',     alt: 'Sam Carrotte' },
    { src: 'imgs/general/general_13.webp',  alt: 'EBF RT' },
    { src: 'imgs/mungo/mungo_2.webp',       alt: 'Mungo' },
    { src: 'imgs/general/general_14.webp',  alt: 'EBF RT' },
    { src: 'imgs/finn/finn_3.webp',         alt: 'Finn' },
    { src: 'imgs/general/general_15.webp',  alt: 'EBF RT' },
    { src: 'imgs/sam_ch/sam_ch_3.webp',     alt: 'Sam at the 2025 CiCle Classic' },
    { src: 'imgs/general/general_16.webp',  alt: 'EBF RT' },
    { src: 'imgs/elijah/elijah_3.webp',     alt: 'Elijah' },
    { src: 'imgs/general/general_17.webp',  alt: 'EBF RT' },
    { src: 'imgs/craig/craig_3.webp',       alt: 'Craig' },
    { src: 'imgs/general/general_18.webp',  alt: 'EBF RT' },
    { src: 'imgs/sam_ch/sam_ch_4.webp',     alt: 'Sam' },
    { src: 'imgs/elijah/elijah_4.webp',     alt: 'Elijah' },
    { src: 'imgs/sam_ca/sam_ca_4.webp',     alt: 'Sam Carrotte' },
    { src: 'imgs/mungo/mungo_3.webp',       alt: 'Mungo' },
    { src: 'imgs/finn/finn_4.webp',         alt: 'Finn' },
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.photo-columns');

    // Render images from list
    GALLERY_IMAGES.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.dataset.index = index;
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.draggable = false;
        img.loading = 'lazy';
        img.decoding = 'async';
        item.appendChild(img);
        container.appendChild(item);
    });

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
        img.src = GALLERY_IMAGES[currentIndex].src;
        img.alt = GALLERY_IMAGES[currentIndex].alt;
        lightbox.classList.add('is-active');
        document.body.classList.add('lightbox-open');
    };

    const close = () => {
        lightbox.classList.remove('is-active');
        document.body.classList.remove('lightbox-open');
    };

    const slide = (direction) => {
        if (isAnimating || GALLERY_IMAGES.length <= 1) return;
        isAnimating = true;

        const nextIndex = (currentIndex + direction + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
        const outX = direction > 0 ? '-50px' : '50px';
        const inX  = direction > 0 ? '60px' : '-60px';

        img.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        img.style.opacity    = '0';
        img.style.transform  = `translateX(${outX})`;

        setTimeout(() => {
            currentIndex = nextIndex;
            img.src = GALLERY_IMAGES[currentIndex].src;
            img.alt = GALLERY_IMAGES[currentIndex].alt;

            img.style.transition = 'none';
            img.style.transform  = `translateX(${inX})`;
            img.offsetHeight; // force reflow

            img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            img.style.opacity    = '1';
            img.style.transform  = 'translateX(0)';

            setTimeout(() => { isAnimating = false; }, 310);
        }, 260);
    };

    // Open on photo click — index stored on the element
    document.addEventListener('click', (e) => {
        if (e.target.closest('.lightbox-close, .lightbox-prev, .lightbox-next')) return;
        const item = e.target.closest('.photo-item');
        if (!item) return;
        const index = parseInt(item.dataset.index, 10);
        open(isNaN(index) ? 0 : index);
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
