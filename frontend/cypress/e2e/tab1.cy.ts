describe('Tab 1 - Home Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8100/tabs/tab1'); // Adjust if your app runs on a different port
    });
  
    it('should load Tab 1 and display the Home title', () => {
      cy.get('ion-title').contains('Home').should('be.visible');
    });
  
    //Menu is not coded yet
    // it('should open and close the side menu', () => {
    //   cy.get('ion-menu-toggle').click(); 
    //   cy.get('ion-menu').should('have.attr', 'opened'); 
    //   cy.get('ion-menu-toggle').click(); 
    //   cy.get('ion-menu').should('not.have.attr', 'opened'); 
    // });
  
    it('should display the About Us section with correct content', () => {
      cy.get('ion-segment-button').contains('About Us').click();
      cy.get('.about-card').should('be.visible');
      cy.get('.about-item').should('have.length', 4);
      cy.contains('Our Vision').should('be.visible');
      cy.contains('A crime-free Halton Region').should('be.visible');
      cy.contains('Our Mission').should('be.visible');
      cy.contains('Reduce crime through community education').should('be.visible');
    });
  
    it('should display the Tip Procedure section when clicked', () => {
      cy.get('ion-segment-button').contains('Tip Procedure').click();
      cy.get('ion-accordion-group').should('be.visible');
    });
  
    it('should open the Tip modal when clicking Submit a Tip!', () => {
      cy.contains('Submit a Tip!').click();
      cy.contains('Anonymous Tip Information').should('be.visible');
      cy.contains('Your anonymous tips help us solve and prevent crime').should('be.visible');
    });
  
    it('should expand and display content in the Tip Procedure accordion', () => {
      cy.get('ion-segment-button').contains('Tip Procedure').click();
      cy.get('ion-accordion').first().click();
      cy.get('ion-accordion').first().find('.ion-padding').should('be.visible');
    });
  
    it('should close the Tip modal when clicking Close', () => {
      cy.contains('Submit a Tip!').click();
      cy.contains('Close').click();
      cy.contains('Anonymous Tip Information').should('not.exist');
    });
  
    it('should verify the image slider contains 4 images', () => {
      cy.get('.swiper-container').should('be.visible');
      cy.get('swiper-slide').should('have.length', 4);
    });
  });
  