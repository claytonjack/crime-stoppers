describe('Alert Details Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/alerts/def456?*', { fixture: 'alert-detail.json' }).as('getAlert');
    cy.visit('/alert-details/def456');
    cy.wait('@getAlert');
  });

  it('should display the alert title', () => {
    cy.get('h1.alert-title').should('exist').and('contain.text', 'Community Gathering');
  });

  it('should display source badge and date', () => {
    cy.get('ion-badge').should('exist').and('contain.text', 'Community');
    cy.get('.date-text').should('exist');
  });

  it('should open and close the image modal if images exist', () => {
    cy.intercept('GET', '**/api/alerts/with-images?*', { fixture: 'alert-with-images.json' }).as('getAlertWithImages');
    cy.visit('/alert-details/with-images');
    cy.wait('@getAlertWithImages');

    cy.get('ion-img.slide-image').first().click();
    cy.get('ion-modal').should('be.visible');

    cy.get('ion-modal ion-button').click(); // close button
    cy.get('ion-modal').should('not.be.visible');
  });

  it('should not show image modal if no images exist', () => {
    cy.get('ion-modal').should('not.be.visible');
  });
});
