describe('Event Details Page', () => {
    beforeEach(() => {
        // Intercept the API call to return the fixture
        cy.intercept(
            'GET',
            'https://codeagainstcrime.com/api/events/def456?populate=*',
            { fixture: 'events-detail.json' }
        ).as('getEvent');

        // Visit the event details page
        cy.visit('/event-details/def456');

        // Wait for the API call
        cy.wait('@getEvent');
    });

    it('should display event details correctly', () => {
        // Verify event title
        cy.get('h1.event-title').should('contain.text', 'Community Gathering');

        // Verify date/time formatting
        cy.get('.date-time-text').should(($span) => {
            const text = $span.text();
            expect(text).to.include('November 5, 2025'); // formatted date
            expect(text).to.include('at'); // time included
        });

        // Verify location
        cy.get('.location-text').should('contain.text', 'Community Hall');

        // Verify body content
        cy.get('.event-body div').should('contain.text', 'A fun event for everyone');

        // Verify no images section since Images array is empty
        cy.get('.images-section').should('not.exist');
    });


    it('should not open image modal if no images exist', () => {
        cy.get('ion-modal').should('have.class', 'overlay-hidden'); // modal exists but hidden
        cy.get('ion-modal').should('not.be.visible'); // safer
    });


});
