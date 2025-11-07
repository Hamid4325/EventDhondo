// Sheety API configuration
const SHEETY_API_URL = '__SHEETY_API_URL__';
const eventContainer = document.getElementById('event-container');

// Initialize when page loads
window.addEventListener('load', () => {
    fetch(SHEETY_API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcomingEvents = data.publishedEvents.filter(event => new Date(event.startDate) >= today);
            
            eventContainer.innerHTML = ''; // Clear any loading state

            if (upcomingEvents.length === 0) {
                eventContainer.innerHTML = `
                    <div class="no-events-message">
                        <h3>No Upcoming Events Found</h3>
                        <p>Check back soon, or <a href="https://forms.gle/pgJ69FYea6UnuHFLA" target="_blank">submit an event</a> to the community!</p>
                    </div>`;
                return;
            }

            upcomingEvents.forEach(event => {
                const card = document.createElement('div');
                card.className = 'portfolio-item';
                card.setAttribute('data-category', event.eventType.toLowerCase());

                // Use placeholder if ImageURL is missing
                const imageUrl = event.imageURL ? event.imageURL : 'placeholder.png';

                card.innerHTML = `
                    <div class="portfolio-image-container" style="background-image: url('${imageUrl}');">
                        <div class="portfolio-overlay">
                            <a href="${event.registrationLink}" target="_blank" class="view-project">Register Now →</a>
                        </div>
                    </div>
                    <div class="portfolio-info">
                        <div class="portfolio-category">${event.eventType}</div>
                        <h3>${event.eventName}</h3>
                        <p class="portfolio-description">${event.description}</p>
                        <div class="portfolio-meta">
                            <span>📅 ${new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>
                `;
                eventContainer.appendChild(card);
            });

            // Re-initialize event listeners for the new cards and filters
            initializeEventListeners();
        })
        .catch(error => {
            console.error('There was a problem fetching the event data:', error);
            eventContainer.innerHTML = `<div class="no-events-message"><h3>Unable to Load Events</h3><p>Please check your connection and try again later.</p></div>`;
        });
});
