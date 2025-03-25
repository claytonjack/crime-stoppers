describe('Settings Menu', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/settings');
  });

  it('should load the settings page', () => {
    cy.get('ion-title').contains('Settings').should('exist');
  });

  it('should display privacy section', () => {
    cy.contains('Privacy').should('exist');
    cy.contains('Privacy Mode').should('exist');
  });

  it('should display theme options', () => {
    cy.contains('Theme').should('exist');
    cy.contains('Light').should('exist');
    cy.contains('Dark').should('exist');
    cy.contains('System').should('exist');
  });

  it('should display font size options', () => {
    cy.contains('Font Size').should('exist');
  });

  it('should display reset button', () => {
    cy.contains('Reset to Default').should('exist');
  });

  it('should toggle between theme options', () => {
    cy.contains('ion-item', 'Dark').click();
    cy.contains('ion-item', 'Light').click();
    cy.contains('ion-item', 'System').click();
  });

  it('should have a working back button', () => {
    cy.get('ion-back-button').should('exist');
  });
});
