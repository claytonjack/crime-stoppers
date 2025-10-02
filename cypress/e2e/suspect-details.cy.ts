describe('Suspect Details Page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://codeagainstcrime.com/api/suspects/abc123?populate=*',
      { fixture: 'suspect-details.json' }
    ).as('getSuspect');

    cy.visit('/suspects/details/abc123');
    cy.wait('@getSuspect');
  });

  it('should display suspect details correctly', () => {
    cy.get('h1.detail-title').should('contain.text', 'John Doe');
    cy.get('.metadata-item').should('exist');
  });

  it('should display the suspect body/description if available', () => {
    cy.get('.detail-body').should('exist');
    cy.get('.detail-body div')
      .invoke('text')
      .should('include', 'Considered dangerous');
  });

  it('should display the reward and contact info sections', () => {
    cy.get('.info-highlight-card')
      .filter(':contains("Reward")')
      .should('contain.text', '$2,000');
    cy.get('.info-highlight-card')
      .filter(':contains("Contact Us")')
      .find('a')
      .should('have.attr', 'href', 'tel:1-800-222-8477');
  });

  it('should go back when clicking the Go Back button in error state', () => {
    cy.intercept(
      'GET',
      'https://codeagainstcrime.com/api/suspects/abc123?populate=*',
      { fixture: 'empty.json' }
    ).as('getEmptySuspect');

    cy.visit('/suspects/details/abc123');
    cy.wait('@getEmptySuspect');

    cy.get('.error-container ion-button').should('be.visible').click();
    cy.url().should('not.include', '/suspects/details/abc123');
  });
});
