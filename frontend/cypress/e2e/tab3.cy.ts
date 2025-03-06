describe('Tab 3 - Map Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8100/tabs/tab3'); // Adjust if your app runs on a different port
    });
  
    it('should load Tab 3 and display the Map title', () => {
      cy.get('ion-title').contains('Map').should('be.visible'); 
    });
  
    //Menu is not coded yet
    // it('should open and close the side menu', () => {
    //   cy.get('ion-menu-toggle').click(); 
    //   cy.get('ion-menu').should('have.attr', 'opened'); 
    //   cy.get('ion-menu-toggle').click(); 
    //   cy.get('ion-menu').should('not.have.attr', 'opened'); 
    // });
  
    it('should display the map iframe', () => {
        cy.get('iframe')
          .should('be.visible') 
          .and('have.attr', 'src', 'https://experience.arcgis.com/experience/5372f09e53114a46a871a3a5c2a58a48/') // Check the iframe src URL
          .and(($iframe) => {
            
            const borderStyle = $iframe.css('border');
            expect(borderStyle).to.include('none'); 
          });
      });
  });
  