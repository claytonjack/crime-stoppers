describe('Alert Details Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/alerts/def456?*', {
      fixture: 'alert-details.json',
    }).as('getAlert');
    cy.visit('/alerts/details/def456');
    cy.wait('@getAlert');
  });

  it('should display the alert title', () => {
    cy.get('h1.detail-title')
      .should('exist')
      .and('contain.text', 'Community Gathering');
  });

  it('should display source badge and date', () => {
    cy.get('ion-badge').should('exist').and('contain.text', 'Community');
    cy.get('.metadata-item span').should('exist');
  });

  it('should not show image modal if no images exist', () => {
    cy.get('ion-modal').should('not.be.visible');
  });
});
