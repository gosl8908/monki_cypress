const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('Onprem Dashboard Test', () => {
    let TestFails = []; // 실패 원인을 저장할 변수
    let Screenshots = []; // 스크린샷을 저장할 배열
    let Failure = false;
    Cypress.on('fail', (err, runnable) => {
        const ErrMessage = err.message || '알 수 없는 이유로 실패함';
        !TestFails.includes(ErrMessage) && TestFails.push(ErrMessage);
        Failure = true;
        throw err;
    });
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        loginModule.login({
            Site: `${Cypress.env('Admin')}`,
            Id: `${Cypress.env('AdminId')}`,
            Password: `${Cypress.env('AdminPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        cy.get('[data-mnu="/operation/*"] > [href="#"]').click();
        cy.get('.sidebar').contains('지점 카테고리').click();
        cy.get('#select_kitchen_no').select('번개지점');
        cy.contains('카테고리 등록').click();
        cy.get('#main_category_nm').type('분식'); // 카테고리명
        cy.get('#sort_order').type('1'); // 순번
        cy.get('.custom-file-input').attachFile({
            filePath: 'image/카테고리이미지/분식.jpg',
            fileName: '분식.jpg',
            mimeType: 'image/jpeg',
        });
        cy.get('#btnCategoryModalApply').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.contains('적용했습니다.');
    });

    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '지점 카테고리 생성',
            Screenshots,
        });
    });
});
