// Paste your unique Sheety API endpoint URL here
const SHEETY_API_URL = '__SHEETY_API_URL__';
// This is a reference to the <div> in our HTML where we want to add the event cards
const eventContainer = document.getElementById('event-container');

// This function will run when the webpage loads
window.onload = () => {
    fetch(SHEETY_API_URL)
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // The data from Sheety is nested under a key, usually the sheet name in lowercase.
            // In our case, it's 'publishedEvents'.
            // Get today's date and set the time to the beginning of the day for accurate comparison
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Filter the events to only include those where the start date is today or in the future
            const upcomingEvents = data.publishedEvents.filter(event => {
                const eventDate = new Date(event.startDate);
                return eventDate >= today;
            });

            // We will now use the filtered 'upcomingEvents' array instead of the original one
            const events = upcomingEvents;

            // Loop through each event in the array
            events.forEach(event => {
                // Create a new <div> element for the event card
                const card = document.createElement('div');
                card.className = 'event-card'; // Add the CSS class for styling

                card.innerHTML = `
                  <div class="card-image">
                    <img src="${event.imageURL ? event.imageURL : 'placeholder.png'}" alt="${event.eventName}">
                  </div>
                  <div class="card-content">
                    <h3>${event.eventName}</h3>
                    <div class="event-details">
                      <span class="event-date">${event.startDate}</span>
                      <span class="event-type">${event.eventType}</span>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <div class="card-footer">
                        <a href="${event.registrationLink}" target="_blank">Register & Learn More</a>
                    </div>
                  </div>
                `;

                // Add the newly created card to our container
                eventContainer.appendChild(card);
            });
        })
        .catch(error => {
            // If there's an error (e.g., API is down), log it to the console
            console.error('There was a problem fetching the event data:', error);
            eventContainer.innerHTML = '<p>Sorry, we could not load the events at this time.</p>';
        });

};
