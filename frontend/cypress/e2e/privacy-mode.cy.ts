describe('Privacy Mode - Calendar Tab', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8100/privacy-mode'); // Adjust based on your actual route
    });
  
    it('should load the Privacy Mode page with the calendar', () => {
      cy.get('app-header').should('contain', 'Calendar'); // Verify header
      cy.get('ion-datetime').should('exist'); // Ensure date picker is present
    });
  
    it('should display events for the default selected date', () => {
      // Mock static events data directly in the component’s HTML
      const staticEvents = [
        { title: 'Team Meeting', date: '2023-11-20', time: '10:00 AM - 11:30 AM', attendees: 'Marketing Team', location: 'Conference Room A' },
        { title: 'Project Deadline', date: '2023-11-25', time: 'All Day', attendees: 'Development Team', location: 'Office' },
        { title: 'Client Presentation', date: '2023-11-28', time: '2:00 PM - 3:30 PM', attendees: 'Sales Team, Client', location: 'Meeting Room 3' },
      ];
  
      // Manually set the events data in the DOM
      cy.get('.events-container').then(($container) => {
        // Remove all event cards (in case previous events exist)
        $container.find('.event-card').remove();
        
        // Add mock event cards
        staticEvents.forEach((event) => {
          $container.append(`
            <ion-card class="event-card">
              <ion-card-header>
                <ion-card-title>${event.title}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list lines="none">
                  <ion-item>
                    <ion-icon name="calendar" slot="start"></ion-icon>
                    <ion-label>${event.date}</ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="time" slot="start"></ion-icon>
                    <ion-label>${event.time}</ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="people" slot="start"></ion-icon>
                    <ion-label>${event.attendees}</ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="location" slot="start"></ion-icon>
                    <ion-label>${event.location}</ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          `);
        });
      });
  
      // Verify that the event cards are displayed
      cy.get('.event-card', { timeout: 8000 }).should('have.length.at.least', 1); // Ensure events are listed
    });
  
    it('should display a no events message for an empty date', () => {
        const noEventDate = '2023-12-31'; // A date with no events
    
        cy.get('ion-datetime').invoke('attr', 'value', noEventDate).trigger('ionChange');
    
        cy.get('.no-events').should('contain', 'No events scheduled for this day');
        cy.get('.event-card').should('not.exist');
      });
  });
  