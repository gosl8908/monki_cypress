import 'cypress-clipboard';

describe('clipbaord', () => {
    before(() => {
        cy.visit('https://www.google.com/');
    });
    
    it('test clipboard', () => {
        cy.get('a').first().invoke('text').then(current => {
            cy.wrap(current).copyToClipboard();
            cy.copyFromClipboard().should('eq', current);
        });
    });
});

