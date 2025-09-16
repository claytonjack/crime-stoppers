describe('Community Watch Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/community-watch');
  });

  it('should render hero title', () => {
    cy.get('h2').contains('Prevent | Report | Community');
  });

  it('should render partner slides', () => {
    cy.get('swiper-slide').should('have.length.greaterThan', 0);
    cy.get('swiper-slide').first().find('ion-img').then(($img) => {
      const src = $img[0]?.src || $img[0]?.getAttribute('src');
      expect(src).to.contain('assets/images/cw1-lorex.jpg');
    });
  });

  it('Subscribe button should open newsletter URL', () => {
    cy.get('ion-button')
      .contains('Subscribe')
      .should('have.attr', 'href', 'https://lp.constantcontactpages.com/sl/guJGNOk');
  });

  it('Download Inspection Report button should open PDF', () => {
    cy.get('ion-button')
      .contains(/Download/i)
      .click({ force: true });
    // You can stub or spy on window.open if needed
  });

});
