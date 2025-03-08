describe('Tab 1 - Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/tabs/tab1');
  });

  it('should load Tab 1 and display the Home title', () => {
    cy.get('ion-title').contains('Home').should('be.visible');
  });

  it('should display the About Us section with correct content', () => {
    cy.get('ion-segment-button').contains('About Us').click();
    cy.get('app-about-us').scrollIntoView().should('exist');
    cy.get('.about-item').should('have.length', 3);
    cy.contains('Our Story').should('exist');
    cy.contains('What We Do').should('exist');
    cy.contains('Community Impact').should('exist');
  });

  it('should display the Tip Procedure section when clicked', () => {
    cy.get('ion-segment-button').contains('Tip Procedure').click();
    cy.get('ion-accordion-group').scrollIntoView().should('exist');
  });

  it('should open the Tip modal when clicking Submit a Tip!', () => {
    cy.contains('Submit a Tip!').click({ force: true });
    cy.get('app-tip-info').should('have.attr', 'ng-reflect-is-open', 'true');
    cy.contains('Tip Information').should('exist');
    cy.contains('For emergencies, call the police.').should('exist');
  });

  it('should expand and display content in the Tip Procedure accordion', () => {
    cy.get('ion-segment-button').contains('Tip Procedure').click();
    cy.get('ion-accordion').first().click();
    cy.get('ion-accordion')
      .first()
      .find('.tip-content')
      .scrollIntoView()
      .should('exist');
  });

  it('should close the Tip modal when clicking Close', () => {
    cy.contains('Submit a Tip!').click({ force: true });
    cy.contains('Close').click();
    cy.get('app-tip-info').should('have.attr', 'ng-reflect-is-open', 'false');
  });

  it('should verify the image slider contains 4 images', () => {
    cy.get('.swiper-container').should('exist');
    cy.get('swiper-slide').should('have.length', 4);
  });
});
