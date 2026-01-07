// Team page JavaScript
// Currently placeholder for future interactive features

document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.race-gallery img');

    if (!galleryImages.length) {
        return;
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" type="button" aria-label="Close lightbox">Close</button>
        <figure class="lightbox-content">
            <img class="lightbox-image" alt="">
            <figcaption class="lightbox-caption"></figcaption>
        </figure>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.lightbox-close');

    const openLightbox = (source, caption) => {
        lightboxImage.src = source;
        lightboxImage.alt = caption || 'Race photo';
        lightboxCaption.textContent = caption || '';
        lightbox.classList.add('is-active');
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-active');
        document.body.classList.remove('lightbox-open');
        lightboxImage.src = '';
    };

    document.addEventListener('click', (event) => {
        const galleryItem = event.target.closest('.gallery-image');
        if (!galleryItem) {
            return;
        }

        const image = galleryItem.querySelector('img');
        if (!image) {
            return;
        }

        openLightbox(image.src, image.alt);
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    closeButton.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-active')) {
            closeLightbox();
        }
    });
});
