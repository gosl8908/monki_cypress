function login({ Site, Type = undefined, Id, Password }) {
    // Type 설정: Id 값에 따라 자동 선택
    if (!Type) {
        if (Id.startsWith('monkistore')) {
            Type = '대리점';
        } else if (Id.startsWith('monkifav') || Id.startsWith('monkitest')) {
            Type = '단골맛집 가맹점주';
        } else if (Id.startsWith('monkiceo')) {
            Type = '사장님';
        }
    }

    cy.visit(Site, {
        timeout: 60 * 1000,
        passOnStatusCode: false,
    });

    if (
        Site === Cypress.env('Ceo') ||
        Site === Cypress.env('StgCeo') ||
        Site === Cypress.env('DevCeo') ||
        Site === 'https://staging-ceo-kiosk.monthlykitchen.kr/users/login'
    ) {
        cy.get('#user_type').select(Type);
    }
    cy.get('#user_id', { timeout: 30 * 1000 })
        .clear()
        .type(Id); // 이메일 입력
    cy.get('#user_pass', { timeout: 30 * 1000 })
        .clear()
        .type(Password); // 비밀번호 입력
    cy.get('#btnLogin', { timeout: 30 * 1000 }).click();
    cy.wait(3 * 1000);
    if (Type === '단골맛집') {
        cy.contains('단골맛집').should('be.visible');
        cy.log('단골맛집 로그인 성공');
    } else if (Type === '사장님') {
        cy.contains('지점').should('be.visible');
        cy.log('지점 로그인 성공');
    } else if (Type === '대리점') {
        cy.contains('대리점').should('be.visible');
        cy.log('대리점 로그인 성공');
    }
}

module.exports = {
    login: login,
};
