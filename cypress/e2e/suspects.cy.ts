describe('Suspects Page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://codeagainstcrime.com/api/suspects?populate=*',
      { fixture: 'suspects.json' }
    ).as('getSuspects');

    cy.visit('/suspects');
    cy.wait('@getSuspects');
  });

  it('should display a list of suspects', () => {
    cy.get('ion-card').should('have.length.greaterThan', 0);
    cy.get('ion-card-title').first().should('contain.text', 'John Doe');
  });

  it('should navigate to suspect details page when clicking a suspect', () => {
    cy.get('ion-card').first().click();
    cy.url().should('include', '/suspect-details/');
  });
});
