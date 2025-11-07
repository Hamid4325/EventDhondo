// Sheety API configuration
const SHEETY_API_URL = '__SHEETY_API_URL__';
const eventContainer = document.getElementById('event-container');

// Project data structure for events (compatible with existing modal system)
const projects = [];

// Initialize when page loads
window.onload = () => {
    fetch(SHEETY_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Filter events to only include upcoming ones
            const upcomingEvents = data.publishedEvents.filter(event => {
                const eventDate = new Date(event.startDate);
                return eventDate >= today;
            });

            const events = upcomingEvents;

            // Clear loading state
            eventContainer.innerHTML = '';

            // Populate projects array for modal compatibility
            events.forEach((event, index) => {
                projects.push({
                    title: event.eventName,
                    category: event.eventType,
                    location: event.location || 'Online',
                    year: new Date(event.startDate).getFullYear().toString(),
                    area: event.duration || '1 Day',
                    description: event.description,
                    images: 1,
                    details: {
                        "Date": event.startDate,
                        "Type": event.eventType,
                        "Location": event.location || 'Online',
                        "Duration": event.duration || '1 Day',
                        "Registration": "Open"
                    }
                });

                // Create event card
                const card = document.createElement('div');
                card.className = 'portfolio-item';
                card.setAttribute('data-category', event.eventType.toLowerCase());
                card.setAttribute('data-project', index);

                card.innerHTML = `
                    <div class="portfolio-image-container" style="background: linear-gradient(135deg, ${getGradientColor(event.eventType)})">
                        <div class="portfolio-overlay">
                            <span class="view-project">VIEW DETAILS →</span>
                        </div>
                    </div>
                    <div class="portfolio-info">
                        <div class="portfolio-category">${event.eventType}</div>
                        <h3>${event.eventName}</h3>
                        <p>${event.description}</p>
                        <div class="portfolio-meta">
                            <span>📍 ${event.location || 'Online'}</span>
                            <span>📅 ${event.startDate}</span>
                            <span>⏰ ${event.duration || '1 Day'}</span>
                        </div>
                        <div style="margin-top: 1rem;">
                            <a href="${event.registrationLink}" target="_blank" class="btn btn-primary" style="padding: 0.8rem 1.5rem; font-size: 0.9rem; display: inline-block; text-decoration: none;">Register Now</a>
                        </div>
                    </div>
                `;

                eventContainer.appendChild(card);
            });

            // If no events found
            if (events.length === 0) {
                eventContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: rgba(255,255,255,0.05); border-radius: 20px;">
                        <h3 style="color: var(--white); margin-bottom: 1rem;">No Upcoming Events</h3>
                        <p style="color: rgba(255,255,255,0.7);">Check back soon for new events, or <a href="https://forms.gle/pgJ69FYea6UnuHFLA" target="_blank" style="color: var(--gold);">submit an event</a> yourself!</p>
                    </div>
                `;
            }

            // Re-initialize event listeners for the new cards
            initializeEventListeners();
        })
        .catch(error => {
            console.error('There was a problem fetching the event data:', error);
            eventContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: rgba(255,255,255,0.05); border-radius: 20px;">
                    <h3 style="color: var(--white); margin-bottom: 1rem;">Unable to Load Events</h3>
                    <p style="color: rgba(255,255,255,0.7);">Please check your connection and try again later.</p>
                </div>
            `;
        });
};

// Helper function for gradient colors based on event type
function getGradientColor(eventType) {
    const colors = {
        'hackathon': '#667eea, #764ba2',
        'workshop': '#f093fb, #f5576c',
        'competition': '#4facfe, #00f2fe',
        'conference': '#43e97b, #38f9d7',
        'default': '#667eea, #764ba2'
    };
    
    const type = eventType.toLowerCase();
    return colors[type] || colors.default;
}

// Header scroll effect
const header = document.getElementById('header');
const scrollIndicator = document.querySelector('.scroll-indicator');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    // Header background
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scroll progress
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / scrollHeight) * 100;
    scrollIndicator.style.width = scrollPercent + '%';

    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

// Scroll to top
scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Portfolio filtering (now for events)
function initializeEventListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Event card click handlers
    portfolioItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger modal if clicking the register button
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            const projectIndex = item.getAttribute('data-project');
            if (projects[projectIndex]) {
                // You can implement modal functionality here if needed
                // For now, just open the registration link
                const registerLink = item.querySelector('a[target="_blank"]');
                if (registerLink) {
                    window.open(registerLink.href, '_blank');
                }
            }
        });
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.portfolio-item, .contact-item, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Parallax effect on hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 600);
    }
});
