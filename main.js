// Mobile navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
});
