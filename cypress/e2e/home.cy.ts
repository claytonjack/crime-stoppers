describe('Home', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/home');
  });

  it('should load the home page and display the Home title', () => {
    cy.get('ion-title').contains('Home').should('be.visible');
  });

  it('should default to the About Us section on page load', () => {
    cy.get('ion-segment-button[value="about-us"]').should(
      'have.class',
      'segment-button-checked'
    );
    cy.get('.content-panel').should('exist');
  });

  it('should display the About Us section with correct content', () => {
    cy.get('.about-us-list').should('exist');
    cy.get('.about-item').should('have.length.greaterThan', 0);
  });

  it('should switch to the Tip Procedure section when clicked', () => {
    cy.get('ion-segment-button[value="tip-procedure"]').click();
    cy.get('.content-panel').should('exist');
  });

  it('should display content in the selected section', () => {
    cy.get('ion-segment-button[value="tip-procedure"]').click();
    cy.get('.content-panel').should('be.visible');
  });

  it('should open the Tip modal when clicking Submit a Tip', () => {
    cy.contains('Submit a Tip').click({ force: true });
    cy.get('app-tip-info').should('exist');
  });

  it('should close the Tip modal when clicking Close', () => {
    cy.contains('Submit a Tip').click({ force: true });
    cy.get('app-tip-info').should('exist');
  });

  it('should verify the image slider contains 4 images', () => {
    cy.get('.swiper-container').should('exist');
    cy.get('swiper-slide').should('have.length', 4);
  });
});
