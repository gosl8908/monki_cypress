import 'cypress-cdp';

const addCopyPermissions = () => {
    cy.CDP('Browser.grantPermissions', { permissions: [ 'clipboardReadWrite' ] });
};


Cypress.Commands.add('copyFromClipboard', () => {
    addCopyPermissions();
    return cy.window().then(win => {
        return cy.wrap(win.navigator.clipboard.readText());
    });
});

Cypress.Commands.add('copyToClipboard', {
    prevSubject: ['String'],
}, (subject) => {
    addCopyPermissions();
    return cy.window().then(win => {
        return cy.wrap(win.navigator.clipboard.writeText(subject));
    });
});