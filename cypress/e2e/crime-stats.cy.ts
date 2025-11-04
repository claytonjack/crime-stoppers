describe('CrimeStatsPage', () => {
    const mockIncidents = [
        {
            OBJECTID: 1,
            CASE_NO: 'A001',
            DATE: Date.now(),
            DESCRIPTION: 'Robbery',
            LOCATION: 'Downtown',
            CITY: 'Halton Region',
            Latitude: '0',
            Longitude: '0',
        },
        {
            OBJECTID: 2,
            CASE_NO: 'A002',
            DATE: Date.now(),
            DESCRIPTION: 'Theft From Auto',
            LOCATION: 'Uptown',
            CITY: 'Halton Region',
            Latitude: '0',
            Longitude: '0',
        },
    ];

    beforeEach(() => {
        // Intercept API call for crime incidents
        cy.intercept('GET', '**/Crime_Map/FeatureServer/0/query**', {
            statusCode: 200,
            body: {
                features: mockIncidents.map((incident) => ({ attributes: incident })),
            },
        }).as('getCrimeIncidents');

        cy.visit('http://localhost:8100/crime-stats');
    });

    it('renders header and filters', () => {
        cy.get('app-header').should('exist');
        cy.get('[aria-label="Location Filter"]').should('exist');
        cy.get('[aria-label="Category Filter"]').should('exist');
        cy.get('[aria-label="TimeFrame Filter"]').should('exist');  
    });

    it('displays loading spinner while fetching data', () => {
        cy.intercept('GET', '**/Crime_Map/FeatureServer/0/query**', (req) => {
            // delay response to test loading
            req.reply((res) => {
                res.delay = 500;
                res.send({
                    features: mockIncidents.map((i) => ({ attributes: i })),
                });
            });
        }).as('getCrimeIncidentsDelayed');

        cy.visit('http://localhost:8100/crime-stats');
        cy.get('.loading-card').should('exist');
        cy.wait('@getCrimeIncidentsDelayed');
        cy.get('.loading-card').should('not.exist');
    });

    it('displays charts when incidents are loaded', () => {
        cy.wait('@getCrimeIncidents');

        cy.get('[aria-label="Crime Charts"]').should('exist');
    });

    it('displays empty state when no incidents returned', () => {
        cy.intercept('GET', '**/Crime_Map/FeatureServer/0/query**', {
            statusCode: 200,
            body: { features: [] },
        }).as('getEmptyIncidents');

        cy.visit('http://localhost:8100/crime-stats');
        cy.wait('@getEmptyIncidents');
        cy.get('.empty-state-card').should('exist');
        cy.get('.charts-grid').should('not.exist');
    });

    it('filters incidents by city', () => {
        cy.wait('@getCrimeIncidents');

        cy.get('.filter-select', { includeShadowDom: true }).first().click({ force: true });
        cy.get('ion-select-option', { includeShadowDom: true }).contains('Oakville').click({ force: true });
    });

    it('filters incidents by category', () => {
        cy.wait('@getCrimeIncidents');

        cy.get('.filter-select', { includeShadowDom: true }).first().click({ force: true });
        cy.get('ion-select-option', { includeShadowDom: true }).contains('Violent').click({ force: true });

    });

    it('filters incidents by timeframe', () => {
        cy.wait('@getCrimeIncidents');

        cy.get('.filter-select', { includeShadowDom: true }).first().click({ force: true });
        cy.get('ion-select-option', { includeShadowDom: true }).contains('Year').click({ force: true });

    
    });

    it('displays footnote', () => {

        cy.get('.footnote-card', { includeShadowDom: true }).first().click({ force: true });

    });
});
