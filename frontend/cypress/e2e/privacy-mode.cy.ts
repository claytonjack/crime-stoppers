describe('Privacy Mode - Calendar Tab', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8100/privacy-mode'); // Adjust based on your actual route
    });
  
    it('should load the Privacy Mode page with the calendar', () => {
      cy.get('app-header').should('contain', 'Calendar'); // Verify header
      cy.get('ion-datetime').should('exist'); // Ensure date picker is present
    });
  
    it('should display events for the default selected date', () => {
        cy.get('.date-heading')
          .invoke('text')
          .then((text) => {
            expect(text).to.include('Events for');
          });
      
        cy.get('.event-card', { timeout: 8000 }) // Wait longer for async data
          .should('have.length.at.least', 1); // Ensure events are listed
      });
      
  
      it('should change the date and update events accordingly', () => {
        const newDate = '2023-11-25';
      
        cy.get('ion-datetime')
          .shadow()
          .find('input') // Target the actual date input inside shadow DOM
          .clear()
          .type(newDate)
          .blur(); // Trigger change event
      
        cy.wait(2000); // Wait for UI update
      
        cy.get('.date-heading', { timeout: 8000 }).should('contain', 'November 25, 2023');
        cy.get('.event-card', { timeout: 8000 }).should('have.length', 1);
        cy.get('.event-card').should('contain', 'Project Deadline');
      });
      
  
    it('should display a no events message for an empty date', () => {
      const noEventDate = '2023-12-31'; // A date with no events
  
      cy.get('ion-datetime').invoke('attr', 'value', noEventDate).trigger('ionChange');
  
      cy.get('.no-events').should('contain', 'No events scheduled for this day');
      cy.get('.event-card').should('not.exist');
    });
  });
  