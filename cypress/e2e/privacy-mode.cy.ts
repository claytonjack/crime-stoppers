describe('Privacy Mode', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/privacy-mode');
  });

  it('should load the Privacy Mode page with the calendar', () => {
    cy.get('app-header ion-title').should('contain', 'Calendar');
    cy.get('ion-datetime').should('exist');
  });

  it('should display the default "no events" message initially', () => {
    cy.get('.event-card').should('exist');
    cy.get('.no-events').should('contain', 'No events scheduled for this day');
  });

  it('should update the selected date when changed', () => {
    const testDate = '2023-12-31';

    cy.get('ion-datetime').invoke('val', testDate).trigger('ionChange');

    cy.get('.date-heading').should('contain', 'Date:');

    cy.get('.no-events').should('contain', 'No events scheduled for this day');
  });
});
