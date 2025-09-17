describe('Community Watch Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/community-watch');
  });

  it('should render hero title', () => {
    cy.get('h2').contains('Prevent | Report | Community');
  });

  it('should render partner slides', () => {
    cy.get('swiper-slide').should('have.length.greaterThan', 0);
    cy.get('swiper-slide')
      .first()
      .find('ion-img')
      .then(($img) => {
        const src = $img[0]?.src || $img[0]?.getAttribute('src');
        expect(src).to.contain('assets/images/cw1-lorex.jpg');
      });
  });

  it('Subscribe button should open newsletter URL', () => {
    cy.get('ion-button')
      .contains('Subscribe')
<<<<<<< HEAD:cypress/e2e/community-watch.cy.ts
      .should(
        'have.attr',
        'href',
        'https://lp.constantcontactpages.com/sl/guJGNOk'
      );
=======
      .should('have.attr', 'href', 'https://lp.constantcontactpages.com/sl/guJGNOk');
>>>>>>> 34f1029e63c09542c6f9ac4f6ec6f74731546555:frontend/cypress/e2e/community-watch.cy.ts
  });

  it('Download Inspection Report button should open PDF', () => {
    cy.get('ion-button')
      .contains(/Download/i)
      .click({ force: true });
    // You can stub or spy on window.open if needed
  });
<<<<<<< HEAD:cypress/e2e/community-watch.cy.ts
=======

>>>>>>> 34f1029e63c09542c6f9ac4f6ec6f74731546555:frontend/cypress/e2e/community-watch.cy.ts
});
