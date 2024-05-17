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
            Site: `${Cypress.env('StgCeo')}`,
            Type: '단골맛집 가맹점주',
            Id: `monkitest1`,
            Password: `${Cypress.env('TestPwd')}`,
    });
    });

    it('Ceo Page Test', () => {

        /* 영업시간 */
        cy.get('#operation-tab').click();
        cy.get(':nth-child(1) > .p-0 > :nth-child(1) > .card-header > .btn').click();
        cy.get(':nth-child(2) > :nth-child(1) > .form-select').select(1)
        cy.get(':nth-child(2) > :nth-child(2) > .form-select').select(1)
        cy.get(':nth-child(2) > :nth-child(4) > .form-select').select('오후 11시')
        cy.get(':nth-child(2) > :nth-child(5) > .form-select').select(2)
        cy.get(':nth-child(4) > :nth-child(1) > .form-select').select(1)
        cy.get(':nth-child(4) > :nth-child(2) > .form-select').select(1)
        cy.get(':nth-child(4) > :nth-child(4) > .form-select').select('오후 11시')
        cy.get(':nth-child(4) > :nth-child(5) > .form-select').select(2)
        cy.get('#vueTimeContainer > .modal-dialog > .modal-content > .modal-footer > .d-flex > :nth-child(1)').click();
        cy.wait(1*1000);
        cy.get('#global_modal_confirm').click();
        
        /* 정기휴무일 */
        cy.get(':nth-child(2) > .p-0 > .card > .card-header > .btn').click();
        cy.get('#vueCloseContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(1) > .form-select').select(1)
        cy.get('#vueCloseContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(2) > .form-select').select(7)
        cy.get('#vueCloseContainer > .modal-dialog > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1*1000)
        cy.get('#global_modal_confirm').click();

        /* 휴게시간 */
        cy.get(':nth-child(4) > .p-0 > :nth-child(1) > .card-header > .btn').click();
        cy.get('#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(1) > .form-select').select('낮 12시')
        cy.get('#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(2) > .form-select').select(2)

        cy.get('#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(4) > .form-select').select('오후 1시')
        cy.get('#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(5) > .form-select').select(2)
    
        cy.get('#vueBreaktimeContainer > .modal-dialog > .modal-content > .modal-footer > .d-flex > :nth-child(1)').click();
        cy.wait(1*1000)
        cy.get('#global_modal_confirm').click();

    
    
    });

    // afterEach('Status Check', () => {
    //     if (Failure) {
    //         const ScreenshotFileName = `Ceo Page Test ${Cypress.env('DateLabel')}`;
    //         cy.screenshot(ScreenshotFileName);
    //         if (!Cypress.platform.includes('win')) {
    //             const CurrentFile = f.getFileName(__filename);
    //             Screenshots.push(`${CurrentFile}/${ScreenshotFileName}`);
    //         } else {
    //             Screenshots.push(`${ScreenshotFileName}`);
    //         }
    //         Failure = false;
    //     }
    // });
    // after('Send Email', () => {
    //     const TestRange =
    //         '1. 사장님 페이지 로그인';
    //     emailModule.Email({
    //         TestFails: TestFails,
    //         EmailTitle: `[${Cypress.env('EmailTitle')}]`,
    //         TestRange: TestRange,
    //         Screenshots: Screenshots,
    //     });
    // });
});