describe('Tab 2 - News Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8100/tabs/tab2'); // Adjust if your app runs on a different port
    });
  
    it('should load Tab 2 and display the News title', () => {
      cy.get('ion-title').contains('News').should('be.visible');
    });
  
    //Menu is not coded yet
    // it('should open and close the side menu', () => {
    //   cy.get('ion-menu-toggle').click(); 
    //   cy.get('ion-menu').should('have.attr', 'opened'); 
    //   cy.get('ion-menu-toggle').click(); 
    //   cy.get('ion-menu').should('not.have.attr', 'opened'); 
    // });
  });
  