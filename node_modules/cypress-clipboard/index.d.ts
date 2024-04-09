declare namespace Cypress {
    interface Chainable {
        copyToClipboard(): Chainable;
        copyFromClipboard(): Chainable;
    }
}
