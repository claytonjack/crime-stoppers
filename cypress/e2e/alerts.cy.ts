describe('Alerts Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/alerts?*', { fixture: 'alerts.json' }).as(
      'getAlerts'
    );
    cy.visit('/alerts');
    cy.wait('@getAlerts');
  });

  it('should display the Alerts header', () => {
    cy.get('app-header').should('contain.text', 'Alerts');
  });

  it('should display a list of alerts', () => {
    cy.get('ion-card').should('have.length.greaterThan', 0);
  });

  it('should search alerts', () => {
    cy.get('ion-searchbar input').type('Community');
    cy.get('ion-card').each(($card) => {
      cy.wrap($card).should('contain.text', 'Community');
    });
  });

  it('should open filter popover when clicking filter button', () => {
    cy.get('ion-button.filter-button').click();
    cy.get('ion-title').should('contain.text', 'Filter Alerts');
    cy.get('ion-radio').should('have.length.greaterThan', 0);
  });

  it('should navigate to alert details page on card click', () => {
    cy.get('ion-card').first().click({ force: true });
    cy.url().should('include', '/alerts/details/');
  });
});
