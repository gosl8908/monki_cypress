function login({ Site, Type = undefined, Id, Password }) {
    cy.visit(Site, { timeout: 60 * 1000 });
    if (Site === Cypress.env('Ceo') || Site === Cypress.env('StgCeo') || Site === Cypress.env('DevCeo')) {
        cy.get('#user_type').select(Type);
    }
    cy.get('#user_id', { timeout: 30 * 1000 }).type(Id); // 이메일 입력
    cy.get('#user_pass', { timeout: 30 * 1000 }).type(Password); // 비밀번호 입력
    cy.get('#btnLogin', { timeout: 30 * 1000 }).click();
    cy.wait(3 * 1000);
}
module.exports = {
    login: login,
};
