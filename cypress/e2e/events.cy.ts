describe('Events Page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://codeagainstcrime.com/api/events*', {
      fixture: 'events.json',
    }).as('getEvents');

    cy.visit('/events');

    cy.wait('@getEvents');
  });

  it('should display a list of events', () => {
    cy.get('ion-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    cy.get('ion-card-title').then(($titles) => {
      const texts = $titles.map((_, el) => el.textContent).get();
      expect(texts).to.include.members(['Test Event', 'Community Gathering']);
    });
  });

  it('should filter events using search', () => {
    cy.get('ion-searchbar input', { timeout: 10000 }).type('Community');

    cy.get('ion-card').each(($card) => {
      cy.wrap($card)
        .find('ion-card-title')
        .invoke('text')
        .should('contain', 'Community');
    });
  });

  it('should navigate to event details page', () => {
    cy.intercept('GET', 'https://codeagainstcrime.com/api/events/def456*', {
      fixture: 'event-details.json',
    }).as('getEventDetail');

    cy.get('ion-card').contains('Community Gathering').click({ force: true });

    cy.wait('@getEventDetail');

    cy.url().should('include', '/events/details/');
    cy.get('h1.detail-title', { timeout: 10000 }).should(
      'contain.text',
      'Community Gathering'
    );
  });

  it('should load more events using infinite scroll', () => {
    cy.get('ion-infinite-scroll', { timeout: 10000 }).scrollIntoView();

    cy.get('ion-card').its('length').should('be.gt', 1);
  });
});
