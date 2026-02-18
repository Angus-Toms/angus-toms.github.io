const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

toggle.addEventListener('click', () => {
    toggle.classList.toggle('is-active');
    nav.classList.toggle('is-open');
});

nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        toggle.classList.remove('is-active');
        nav.classList.remove('is-open');
    }
});
