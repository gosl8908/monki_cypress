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
            Type: '대리점',
            Id: `${Cypress.env('TestId')}`,
            Password: `${Cypress.env('TestPwd')}`,
    });
    });

    it('Ceo Page Test', () => {

        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/account/partners"] > .btn').click(); // 계정관리
        cy.get('[href="/account/store"] > .btn').click(); // 매장관리

        /* 일반결제 수단 설정 */
        cy.get('#keyword').type('monkitest1');
        cy.get('.card-body > .row > .my-sm-auto > .btn').click();
        cy.get('#btnPayment_0').click();
        cy.get('#modal_body > .row > .text-end > .btn').click(); // 결제수단 연동 등록
        cy.wait(1*1000)
        cy.get('#store_biz_number').type(Cypress.env('DateLabel')) // 사업자번호
        cy.wait(1*1000)
        cy.get('#pg_company').select(1); // PG 업체
        cy.get('#payment_type').select(1) // 결제분류
        cy.get('#pg_mid_type').select(1) // 결제유형
        cy.get('#pg_mid').type(Cypress.env('SmatroMid')) // PG MID
        cy.get('#pg_merchant_key').type(Cypress.env('SmatroKey')) // PG 상점키
        cy.get('#store_contract_device').select(2); // 계약 설정
        cy.get(':nth-child(11) > .text-end > .btn').click();
        cy.get('#global_modal_body').contains('등록 하시겠습니까?');
        cy.wait(1*1000);
        cy.get('#global_modal_confirm').click();
        cy.get('#vuePayContainer > .modal-dialog > .modal-content > #modal_body').contains('스마트로');

        /* 간편결제 수단 설정 */
        cy.get('#modal_body > .row > .text-end > .btn').click(); // 결제수단 연동 등록
        cy.wait(1*1000)
        cy.get('#store_biz_number').type(Cypress.env('DateLabel')) // 사업자번호
        cy.wait(1*1000)
        cy.get('#pg_company').select(2); // PG 업체
        cy.get('#payment_type').select(1) // 결제분류
        cy.get('#pg_mid_type').select(2) // 결제유형
        cy.get('#pg_bill_mid').type(Cypress.env('SmatroEasyId'))
        cy.get('#pg_mid').type(Cypress.env('SmatroEasyMid')) // PG MID
        cy.get('#pg_merchant_key').type(Cypress.env('SmatroEasyKey')) // PG 상점키
        cy.get('#store_contract_device').select(2); // 계약 설정
        cy.get(':nth-child(11) > .text-end > .btn').click();
        cy.get('#global_modal_body').contains('등록 하시겠습니까?');
        cy.wait(1*1000);
        cy.get('#global_modal_confirm').click();
        cy.get('#vuePayContainer > .modal-dialog > .modal-content > #modal_body').contains('스마트로');
        cy.get('#vuePayContainer > .modal-dialog > .modal-content > .modal-header > .btn-close').click();



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