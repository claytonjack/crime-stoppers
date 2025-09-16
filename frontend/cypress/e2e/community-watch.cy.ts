// cypress/e2e/community-watch.spec.js
describe('Community Watch Page', () => {
  beforeEach(() => {
    // Visit the page (adjust the route to your app)
    cy.visit('http://localhost:8100/community-watch');
  });

  it('should render the hero title', () => {
    cy.get('h2').contains('Prevent | Report | Community');
  });

  it('should render all program benefit headers', () => {
    const headers = [
      'Stay Informed',
      'Anonymous Reporting',
      'Visibility Materials',
      'CamSafe Registration',
      'Partner Discounts',
      'Build Connections',
    ];
    cy.get('.info-header ion-label').each((el, i) => {
      cy.wrap(el).should('contain.text', headers[i]);
    });
  });

  it('should render partner slides', () => {
    cy.get('swiper-slide').should('have.length.greaterThan', 0);
    cy.get('swiper-slide').first().find('ion-img')
      .should('have.attr', 'src')
      .and('contain', 'assets/images/cw1-lorex.jpg');
  });

  it('Subscribe button should open newsletter URL', () => {
    cy.get('ion-button').contains('Subscribe to Newsletter')
      .should('have.attr', 'href', 'https://lp.constantcontactpages.com/sl/guJGNOk')
      .and('have.attr', 'target', '_blank');
  });

  it('Download Inspection Report button should open PDF', () => {
    const pdfUrl = 'https://www.haltoncrimestoppers.ca/file_uploads/crime_stoppers_of_halton___cw_inspection_report_151830.pdf';

    // Stub window.open to catch the call
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('ion-button').contains('Download').click();
    cy.get('@windowOpen').should('have.been.calledWith', pdfUrl, '_blank');
  });

  it('Home Inspection PDF button should open PDF in new tab', () => {
    const pdfPath = 'assets/HomeInspectionReport.pdf';

    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });

    // Assuming you have a method or button to call openHomeInspection
    cy.get('ion-button').contains('Home Inspection').click({ force: true }); // Adjust selector
    cy.get('@windowOpen').should('have.been.calledWith', pdfPath, '_blank');
  });
});
