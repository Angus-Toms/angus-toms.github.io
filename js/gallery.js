document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" type="button" aria-label="Close">Close</button>
        <figure class="lightbox-content">
            <img class="lightbox-image" alt="">
            <figcaption class="lightbox-caption"></figcaption>
        </figure>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');

    const open = (src, caption) => {
        lightboxImage.src = src;
        lightboxCaption.textContent = caption || '';
        lightbox.classList.add('is-active');
        document.body.classList.add('lightbox-open');
    };

    const close = () => {
        lightbox.classList.remove('is-active');
        document.body.classList.remove('lightbox-open');
        lightboxImage.src = '';
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('.lightbox-close')) return;
        const item = e.target.closest('.photo-item');
        if (!item) return;
        const img = item.querySelector('img');
        if (!img) return;
        open(img.src, img.alt);
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-active')) close();
    });
});
