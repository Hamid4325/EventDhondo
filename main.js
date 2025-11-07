document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-icon');
    const mobileNav = document.getElementById('mobile-nav');

    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
});
