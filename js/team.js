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

// Lightbox functionality for race gallery images
let lightboxInstance = null;

function initializeLightbox() {
    // Only create lightbox once
    if (lightboxInstance) {
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
    lightboxInstance = lightbox;

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

    // Use event delegation on document for all gallery images
    document.addEventListener('click', (event) => {
        // Check if click is on or inside a gallery-image
        const galleryItem = event.target.closest('.gallery-image');
        if (!galleryItem) {
            return;
        }

        // Make sure we're not clicking on the modal close button or other controls
        if (event.target.closest('.modal-close, .lightbox-close')) {
            return;
        }

        const image = galleryItem.querySelector('img');
        if (!image) {
            return;
        }

        event.stopPropagation();
        openLightbox(image.src, image.alt);
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-active')) {
            closeLightbox();
        }
    });
}
