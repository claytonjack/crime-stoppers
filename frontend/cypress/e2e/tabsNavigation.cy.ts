describe('Tab Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/tabs/tab1');
  });

  it('should navigate to Tab 1 when clicking the Home FAB', () => {
    cy.get('ion-fab-button[href="/tabs/tab1"]').click();

    cy.url().should('include', '/tabs/tab1');
    cy.get('ion-title').contains('Home').should('be.visible');
  });

  it('should navigate to Tab 2 when clicking the News tab button', () => {
    cy.get('ion-tab-button[href="/tabs/tab2"]').click();

    cy.url().should('include', '/tabs/tab2');
    cy.get('ion-title').contains('News').should('be.visible');
  });

  it('should navigate to Tab 3 when clicking the Map tab button', () => {
    cy.get('ion-tab-button[href="/tabs/tab3"]').click();

    cy.url().should('include', '/tabs/tab3');
    cy.get('ion-title').contains('Map').should('be.visible');
  });

  it('should navigate to Tab 4 when clicking the Tab 4 tab button', () => {
    cy.get('ion-tab-button[href="/tabs/tab4"]').click();

    cy.url().should('include', '/tabs/tab4');
    cy.get('ion-title').contains('Tab 4').should('be.visible');
  });

  it('should navigate to Tab 5 when clicking the Tab 5 tab button', () => {
    cy.get('ion-tab-button[href="/tabs/tab5"]').click();

    cy.url().should('include', '/tabs/tab5');
    cy.get('ion-title').contains('Tab 5').should('be.visible');
  });
});
