describe('Event Details Page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://codeagainstcrime.com/api/events/def456?populate=*',
      { fixture: 'event-details.json' }
    ).as('getEvent');

    cy.visit('/events/details/def456');

    cy.wait('@getEvent');
  });

  it('should display event details correctly', () => {
    cy.get('h1.detail-title').should('contain.text', 'Community Gathering');
    cy.get('.metadata-item span').should(($span) => {
      const text = $span.text();
      expect(text).to.include('Nov');
    });
    cy.contains('Community Hall').should('exist');
    cy.get('.detail-body div').should(
      'contain.text',
      'A fun event for everyone'
    );
    cy.get('.images-section').should('not.exist');
  });

  it('should not open image modal if no images exist', () => {
    cy.get('ion-modal').should('have.class', 'overlay-hidden');
    cy.get('ion-modal').should('not.be.visible');
  });
});
