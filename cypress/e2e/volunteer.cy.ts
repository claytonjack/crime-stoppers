describe('Volunteer Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/volunteer');

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
  });

  it('should render the page header', () => {
    cy.get('app-header ion-title').should('contain', 'Volunteer');
  });

  it('should render the "Why Join Our Team?" section', () => {
    cy.contains('h2', 'Why Join Our Team?').should('exist');
    cy.get('.hero-content').should(
      'contain.text',
      'Volunteering with Crime Stoppers Halton offers you the opportunity'
    );
  });

  it('should display the eligibility note', () => {
    cy.contains(
      'p',
      'Note: You must work, reside in, or have a substantial interest in the Halton Region'
    ).should('exist');
  });

  it('should render the "How to Apply" steps', () => {
    const steps = [
      'Step 1: Download Form',
      'Step 2: Complete the Application',
      'Step 3: Submit Your Application',
    ];

    cy.get('.info-header ion-label').each((el, i) => {
      cy.wrap(el).should('contain.text', steps[i]);
    });

    cy.contains('.info-content', 'Select the button below to download').should(
      'exist'
    );
    cy.contains(
      '.info-content',
      'Fill out all sections of the application'
    ).should('exist');
    cy.contains('.info-content', 'info@haltoncrimestoppers.ca').should('exist');
  });

  it('should render the "Apply Now" section', () => {
    cy.contains('h2', 'Apply Now').should('exist');
  });

  it('should have three volunteer role buttons with correct labels', () => {
    const roles = ['Adult Volunteer', 'Youth Volunteer', 'Board Member'];
    cy.get('ion-button.btn-elevated').should('have.length', 3);
    roles.forEach((role) => {
      cy.contains('ion-button', role).should('exist');
    });
  });

  it('should render three volunteer role buttons', () => {
    const roles = ['Adult Volunteer', 'Youth Volunteer', 'Board Member'];
    cy.get('ion-button.btn-elevated').should('have.length', 3);
    roles.forEach((role) => {
      cy.contains('ion-button', role).should('exist');
    });
  });
});
