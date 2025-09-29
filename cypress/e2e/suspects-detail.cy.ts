describe('Suspect Details Page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://codeagainstcrime.com/api/suspects/abc123?populate=*',
      { fixture: 'suspect-detail.json' }
    ).as('getSuspect');

    cy.visit('/suspect-details/abc123');
    cy.wait('@getSuspect');
  });

  it('should display suspect details correctly', () => {
    cy.get('h1.suspect-title').should('contain.text', 'John Doe');
    cy.get('.info-item').should('contain.text', 'Crime:');
    cy.get('.info-item').should('contain.text', 'Scene:');
    cy.get('.info-item').should('contain.text', 'Residence:');
    cy.get('.info-item').should('contain.text', 'Age:');
    cy.get('.info-item').should('contain.text', 'Height:');
    cy.get('.info-item').should('contain.text', 'Weight:');
  });

  it('should display the suspect body/description if available', () => {
    cy.get('.suspect-body').should('exist');
    cy.get('.suspect-body').invoke('text').should('include', 'Considered dangerous'); // adjust based on fixture
  });

  it('should display the reward and contact info sections', () => {
    cy.get('.reward-card').should('exist');
    cy.get('.reward-card').should('contain.text', '$2,000');

    cy.get('.contact-card').should('exist');
    cy.get('.contact-card a').should('have.attr', 'href', 'tel:1-800-222-8477');
  });

  it('should go back when clicking the Go Back button in error state', () => {
    // Force error state by intercepting with empty data
    cy.intercept(
      'GET',
      'https://codeagainstcrime.com/api/suspects/abc123?populate=*',
      { fixture: 'empty.json' }
    ).as('getEmptySuspect');

    cy.visit('/suspect-details/abc123');
    cy.wait('@getEmptySuspect');

    cy.get('.error-container ion-button').should('be.visible').click();
    cy.url().should('not.include', '/suspect-details/abc123');
  });
});
