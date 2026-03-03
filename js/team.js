// Team page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize grid and modal
    initializeTeamGrid();

    // Image lightbox functionality (for modal gallery images)
    initializeLightbox();
});

// Team grid with modal functionality
function initializeTeamGrid() {
    const athleteCards = document.querySelectorAll('.athlete-card');
    const teamGridContainer = document.querySelector('.team-grid');

    if (!teamGridContainer || !athleteCards.length) {
        return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'athlete-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" type="button" aria-label="Close profile">Close</button>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalBody = modal.querySelector('.modal-body');
    const closeButton = modal.querySelector('.modal-close');

    // Create grid items from athlete cards
    athleteCards.forEach((card, index) => {
        const name = card.querySelector('.athlete-name')?.textContent || 'Athlete';
        const headshot = card.querySelector('.athlete-headshot');
        const headshotImg = headshot?.querySelector('img');
        const headshotSrc = headshotImg?.src || '';

        // Get rider type for subtitle
        const infoItems = card.querySelectorAll('.info-item');
        let riderType = 'Rider';
        infoItems.forEach(item => {
            const label = item.querySelector('.info-label')?.textContent;
            if (label && label.includes('Type')) {
                riderType = item.querySelector('.info-value')?.textContent || 'Rider';
            }
        });

        // Create grid card
        const gridCard = document.createElement('div');
        gridCard.className = 'grid-athlete-card';
        gridCard.innerHTML = `
            <div class="grid-athlete-photo">
                ${headshotSrc ? `<img src="${headshotSrc}" alt="${name}" draggable="false">` : '<div class="headshot-placeholder">Headshot</div>'}
            </div>
            <h3 class="grid-athlete-name">${name}</h3>
            <p class="grid-athlete-role">${riderType}</p>
        `;

        // Click handler to open modal
        gridCard.addEventListener('click', () => {
            openAthleteModal(card);
        });

        teamGridContainer.appendChild(gridCard);
    });

    // Modal functions
    const openAthleteModal = (athleteCard) => {
        const header = athleteCard.querySelector('.athlete-header').cloneNode(true);
        const info = athleteCard.querySelector('.athlete-info').cloneNode(true);
        const gallery = athleteCard.querySelector('.athlete-gallery')?.cloneNode(true);

        // Build modal content
        let modalHTML = '<div class="modal-athlete-header">';

        // Get headshot
        const headshot = header.querySelector('.athlete-headshot');
        if (headshot) {
            modalHTML += `<div class="modal-athlete-photo">${headshot.innerHTML}</div>`;
        }

        // Get details
        modalHTML += '<div class="modal-athlete-details">';
        const name = header.querySelector('.athlete-name')?.textContent || '';
        modalHTML += `<h2 class="modal-athlete-name">${name}</h2>`;

        // Get social links
        const socialLinks = header.querySelector('.social-links');
        if (socialLinks) {
            modalHTML += `<div class="modal-social-links">${socialLinks.innerHTML}</div>`;
        }

        // Add info
        modalHTML += `<div class="modal-athlete-info">${info.innerHTML}</div>`;
        modalHTML += '</div></div>';

        // Add gallery
        if (gallery) {
            const raceGallery = gallery.querySelector('.race-gallery');
            if (raceGallery) {
                modalHTML += `<div class="modal-athlete-gallery"><div class="modal-race-gallery">${raceGallery.innerHTML}</div></div>`;
            }
        }

        modalBody.innerHTML = modalHTML;
        modal.classList.add('is-active');
        document.body.classList.add('modal-open');

        // Re-initialize lightbox for modal images
        initializeLightbox();
    };

    const closeModal = () => {
        modal.classList.remove('is-active');
        document.body.classList.remove('modal-open');
    };

    // Close handlers
    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });
}

// Carousel lightbox for race gallery images in athlete modal
let lightboxInstance = null;

function initializeLightbox() {
    if (lightboxInstance) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" type="button" aria-label="Close lightbox">CLOSE</button>
        <button class="lightbox-prev" type="button" aria-label="Previous photo">&#8592;</button>
        <figure class="lightbox-content">
            <img class="lightbox-image" alt="">
            <figcaption class="lightbox-caption"></figcaption>
        </figure>
        <button class="lightbox-next" type="button" aria-label="Next photo">&#8594;</button>
    `;

    document.body.appendChild(lightbox);
    lightboxInstance = lightbox;

    const lightboxImage   = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeButton     = lightbox.querySelector('.lightbox-close');
    const prevButton      = lightbox.querySelector('.lightbox-prev');
    const nextButton      = lightbox.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex  = 0;
    let isAnimating   = false;

    const openLightbox = (images, startIndex) => {
        currentImages = images;
        currentIndex  = startIndex;
        lightboxImage.style.transition = 'none';
        lightboxImage.style.opacity    = '1';
        lightboxImage.style.transform  = 'translateX(0)';
        lightboxImage.src = currentImages[currentIndex].src;
        lightboxImage.alt = currentImages[currentIndex].alt;
        lightboxCaption.textContent = currentImages[currentIndex].alt;
        lightboxCaption.style.display = currentImages[currentIndex].alt ? '' : 'none';
        // Show/hide nav based on whether there are multiple images
        prevButton.style.display = currentImages.length > 1 ? '' : 'none';
        nextButton.style.display = currentImages.length > 1 ? '' : 'none';
        lightbox.classList.add('is-active');
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-active');
        document.body.classList.remove('lightbox-open');
        lightboxImage.src = '';
    };

    const slide = (direction) => {
        if (isAnimating || currentImages.length <= 1) return;
        isAnimating = true;

        const nextIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
        const outX = direction > 0 ? '-50px' : '50px';
        const inX  = direction > 0 ? '60px'  : '-60px';

        lightboxImage.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        lightboxImage.style.opacity    = '0';
        lightboxImage.style.transform  = `translateX(${outX})`;

        setTimeout(() => {
            currentIndex = nextIndex;
            lightboxImage.src = currentImages[currentIndex].src;
            lightboxImage.alt = currentImages[currentIndex].alt;
            lightboxCaption.textContent = currentImages[currentIndex].alt;
            lightboxCaption.style.display = currentImages[currentIndex].alt ? '' : 'none';

            lightboxImage.style.transition = 'none';
            lightboxImage.style.transform  = `translateX(${inX})`;
            lightboxImage.offsetHeight; // force reflow

            lightboxImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            lightboxImage.style.opacity    = '1';
            lightboxImage.style.transform  = 'translateX(0)';

            setTimeout(() => { isAnimating = false; }, 310);
        }, 260);
    };

    // Click delegation — collects sibling images for carousel context
    document.addEventListener('click', (event) => {
        if (event.target.closest('.modal-close, .lightbox-close, .lightbox-prev, .lightbox-next')) return;

        const galleryItem = event.target.closest('.gallery-image');
        if (!galleryItem) return;

        const image = galleryItem.querySelector('img');
        if (!image) return;

        // Gather all images from the same race-gallery container
        const gallery = galleryItem.closest('.race-gallery, .modal-race-gallery');
        let images;
        if (gallery) {
            images = Array.from(gallery.querySelectorAll('.gallery-image img'))
                .map(img => ({ src: img.src, alt: img.alt }));
        } else {
            images = [{ src: image.src, alt: image.alt }];
        }

        const startIndex = images.findIndex(i => i.src === image.src);
        event.stopPropagation();
        openLightbox(images, startIndex >= 0 ? startIndex : 0);
    });

    prevButton.addEventListener('click', (e) => { e.stopPropagation(); slide(-1); });
    nextButton.addEventListener('click', (e) => { e.stopPropagation(); slide(1); });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('is-active')) return;
        if (event.key === 'Escape')     closeLightbox();
        if (event.key === 'ArrowRight') slide(1);
        if (event.key === 'ArrowLeft')  slide(-1);
    });
}
