const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('업종 카테고리 생성', () => {
    let TestFails = []; // 실패 원인을 저장할 변수
    let Screenshots = []; // 스크린샷을 저장할 배열
    let Failure = false;
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열

    Cypress.on('fail', (err, runnable) => {
        const ErrMessage = err.message || '알 수 없는 이유로 실패함';
        if (!TestFails.includes(ErrMessage)) {
            TestFails.push(ErrMessage);
            FailedTests.push(runnable.title); // 실패한 테스트의 타이틀을 저장
        }
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
        cy.get('.sidebar').contains('연동 정보 관리').click();
        cy.get('.sidebar').contains('업종 카테고리').click();
        cy.contains('카테고리 추가').click();
        cy.get('#biz_category_nm').type('분식'); // 카테고리명
        cy.get('#btnChkBcNm').click();
        cy.contains('체크완료');
        cy.get('#sort_order').type('1'); // 순번
        cy.get('.custom-file-input').attachFile({
            filePath: 'image/카테고리이미지/분식.jpg',
            fileName: '분식.jpg',
            mimeType: 'image/jpeg',
        });
        cy.get('#vueBizCategoryModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.contains('등록했습니다.');

        /* 삭제 */
        // cy.wait(1*1000);
        // cy.get('.content').contains('한식').click();
        // cy.get(':nth-child(6) > .btn').click();
        // cy.wait(3*1000)
        // cy.get('#global_modal_confirm').click();
        // cy.contains('삭제했습니다.');
    });

    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '업종 카테고리',
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
