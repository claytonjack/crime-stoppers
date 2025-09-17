describe('Settings Menu', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/settings');
  });

  it('should load the settings page', () => {
    cy.get('ion-title').contains('Settings').should('exist');
  });

  it('should display appearance section', () => {
    cy.contains('Appearance').should('exist');
  });

  it('should display theme options', () => {
    cy.contains('Theme').should('exist');
    cy.contains('Choose your preferred color scheme').should('exist');
  });

  it('should display font size options', () => {
    cy.contains('Font Size').should('exist');
    cy.contains('Adjust text size for better readability').should('exist');
  });

  it('should display reset button', () => {
    cy.contains('Reset Settings').should('exist');
  });

  it('should be able to click theme setting', () => {
    cy.contains('ion-item', 'Theme').click({ force: true });
  });

  it('should have header with back navigation', () => {
    cy.get('app-header').should('exist');
  });
});
