describe('Donate Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/donate'); // adjust if your route is different
  });

  it('should render the page header', () => {
    cy.get('app-header').should('have.attr', 'title', 'Donate');
  });

  it('should render the main hero title', () => {
    cy.get('h2').contains('Why Donate to Us?').should('exist');
  });

  it('should render all donation benefit headers in order', () => {
    const headers = [
      'Direct Community Impact',
      '100% Community Funded',
      'Safe & Secure',
      'Trusted & Transparent',
      'Tax Deductible',
    ];

    cy.get('.info-header ion-label').each((el, i) => {
      cy.wrap(el).should('contain.text', headers[i]);
    });
  });

  it('should show the Donate Now section', () => {
    cy.get('#donation-form h2').should('contain.text', 'Donate Now');
  });

  it('should render the CanadaHelps iframe with correct src', () => {
    cy.get('iframe[title="Donate Now"]')
      .should('have.attr', 'src', 'https://www.canadahelps.org/en/dn/93928')
      .and('have.attr', 'width', '100%')
      .and('have.attr', 'height', '800');
  });
});
