describe('Tab Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/home');
  });

  it('should navigate to Home when clicking the Home FAB', () => {
    cy.get('ion-fab-button[href="/home"]').click();

    cy.url().should('include', '/home');
    cy.get('ion-title').contains('Home').should('be.visible');
  });

  it('should navigate to Alerts when clicking the Alerts tab button', () => {
    cy.get('ion-tab-button[href="/alerts"]').click();

    cy.url().should('include', '/alerts');
    cy.get('ion-title').contains('Alerts').should('be.visible');
  });

  it('should navigate to Crime Map when clicking the Map tab button', () => {
    cy.get('ion-tab-button[href="/crime-map"]').click();

    cy.url().should('include', '/crime-map');
    cy.get('ion-title').contains('Map').should('be.visible');
  });

  it('should navigate to Events when clicking the Events tab button', () => {
    cy.get('ion-tab-button[href="/events"]').click();

    cy.url().should('include', '/events');
    cy.get('ion-title').contains('Events').should('be.visible');
  });

  it('should navigate to Crime Stats when clicking the Stats tab button', () => {
    cy.get('ion-tab-button[href="/crime-stats"]').click();

    cy.url().should('include', '/crime-stats');
    cy.get('ion-title').should('be.visible').and('not.be.empty');
  });
});
