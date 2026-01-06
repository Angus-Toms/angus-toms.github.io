const thumbs = Array.from(document.querySelectorAll(".gallery-thumb"));
const mainImage = document.getElementById("gallery-main-image");
const riderLabel = document.getElementById("gallery-main-rider");
const raceLabel = document.getElementById("gallery-main-race");
const countLabel = document.getElementById("gallery-count");
const controls = document.querySelectorAll("[data-direction]");

let currentIndex = 0;
const total = thumbs.length;

const getThumbRadius = () => {
    if (window.matchMedia("(max-width: 720px)").matches) return 1;
    if (window.matchMedia("(max-width: 1100px)").matches) return 2;
    return 3;
};

const updateVisibleThumbs = () => {
    if (!total) return;
    const radius = getThumbRadius();
    const orderMap = new Map();

    for (let offset = -radius; offset <= radius; offset += 1) {
        const index = (currentIndex + offset + total) % total;
        orderMap.set(index, offset + radius);
    }

    thumbs.forEach((thumb, index) => {
        const isVisible = orderMap.has(index);
        const order = orderMap.get(index);
        const isEdge = isVisible && (order === 0 || order === radius * 2);
        const isNeighbor = isVisible && index !== currentIndex;
        thumb.classList.toggle("is-visible", isVisible);
        thumb.classList.toggle("is-edge", isEdge);
        thumb.classList.toggle("is-neighbor", isNeighbor);
        thumb.setAttribute("aria-hidden", isVisible ? "false" : "true");

        if (isVisible) {
            thumb.style.order = order;
        } else {
            thumb.style.order = "";
        }
    });
};

const setActive = (nextIndex) => {
    if (!total) return;
    currentIndex = (nextIndex + total) % total;

    const activeThumb = thumbs[currentIndex];
    const { image, rider, race, alt } = activeThumb.dataset;

    mainImage.src = image;
    mainImage.alt = alt;
    riderLabel.textContent = rider;
    raceLabel.textContent = race;
    countLabel.textContent = `${currentIndex + 1} / ${total}`;

    thumbs.forEach((thumb, index) => {
        const isActive = index === currentIndex;
        thumb.classList.toggle("is-active", isActive);
        thumb.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    updateVisibleThumbs();
};

thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => setActive(index));
});

controls.forEach((button) => {
    button.addEventListener("click", () => {
        const direction = button.dataset.direction === "next" ? 1 : -1;
        setActive(currentIndex + direction);
    });
});

window.addEventListener("resize", updateVisibleThumbs);

setActive(0);
