describe('Events Page', () => {
    beforeEach(() => {
        // Stub the API to control test data
        cy.intercept('GET', 'https://codeagainstcrime.com/api/events*', {
            fixture: 'events.json',
        }).as('getEvents');

        // Visit the Events page
        cy.visit('/events');

        // Wait for the events API
        cy.wait('@getEvents');
    });

    it('should display a list of events', () => {
        // Ensure at least one card is rendered
        cy.get('ion-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

        // Check titles of events exist in the DOM
        cy.get('ion-card-title').then(($titles) => {
            const texts = $titles.map((_, el) => el.textContent).get();
            expect(texts).to.include.members(['Test Event', 'Community Gathering']);
        });
    });

    it('should filter events using search', () => {
        // Type into searchbar (no shadow DOM in Ionic 6+)
        cy.get('ion-searchbar input', { timeout: 10000 }).type('Community');

        // Verify filtered cards
        cy.get('ion-card').each(($card) => {
            cy.wrap($card)
                .find('ion-card-title')
                .invoke('text')
                .should('contain', 'Community');
        });
    });

    it('should navigate to event details page', () => {
        // Stub event details API
        cy.intercept(
            'GET',
            'https://codeagainstcrime.com/api/events/def456*',
            { fixture: 'events-detail.json' }
        ).as('getEventDetail');

        // Click the card
        cy.get('ion-card')
            .contains('Community Gathering')
            .click({ force: true });

        // Wait for the detail API
        cy.wait('@getEventDetail');

        // Verify URL
        cy.url().should('include', '/event-details/');

        // Verify event title exists
        cy.get('h1.event-title', { timeout: 10000 }).should(
            'contain.text',
            'Community Gathering'
        );
    });

    it('should load more events using infinite scroll', () => {
        cy.get('ion-infinite-scroll', { timeout: 10000 }).scrollIntoView();

        cy.get('ion-card').its('length').should('be.gt', 1); // Adjust expected length based on fixture
    });
});
