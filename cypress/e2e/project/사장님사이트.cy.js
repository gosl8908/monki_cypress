const { loginModule, emailModule } = require('../module/manager.module.js');

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

        /* 매장 등록 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/account/partners"] > .btn').click();
        cy.get('[href="/account/store"] > .btn').click();
        cy.get('.m-3 > .col-3 > .btn').click();
        cy.get('#user-id').type('monki'+Cypress.env('DateLabel'));
        cy.get('#btn-check-user-id').click();
        cy.get('#user-pass').type(Cypress.env('TestPwd'));
        cy.get('#chk-user-pass').type(Cypress.env('TestPwd'));
        cy.get('#sel-mng-partner').click();
        cy.get('#vuePartnersContainer > .modal-dialog > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.get('#global_modal_body').contains('등록하시겠습니까?');
        cy.wait(1*1000);
        cy.get('#global_modal_confirm').click();
        cy.get('#store-name').type('매장')
        cy.get('.border-radius-md')
        cy.fixture('image/썸네일이미지.jpg', 'base64').then(fileContent => {
            cy.get('input[type="hidden"][id="logo-original-name"]').attachFile({
                fileContent,
                filePath: 'image/썸네일이미지.jpg',
                fileName: '썸네일이미지.jpg',
                mimeType: 'image/jpg',
            });
        });
        cy.get('#tbo-admin-pwd').type('111111');
        cy.get('#first-biz-category-no').select('1');
        cy.get('#STNS_102').click();
        cy.get('#store-biz-number').type(Cypress.env('DateLabel'));
        cy.get('#btn-check-store-biz-number').click();
        cy.get('#owner-name').type('대표')
        cy.get('#tel').type('01012341234')
        cy.get('#road-address').invoke('val', '경기 안양시 동안구 평촌대로 60-55 (비산동)');
        cy.get('#zipcode').invoke('val', '13915');
        cy.get('#biz-email').type('monki@monki.net');
        cy.get('#bank-code').select(1);
        cy.get('#account-number').type('3333048408739');
        cy.get('#account-user').type('예금주')
        cy.get('#btn-reg-store').click();
        cy.get('#global_modal_body').contains('입력한 정보로 생성하시겠습니까?');
        cy.get('#global_modal_confirm').click();
        cy.get('#vueContainer').contains('monki'+Cypress.env('DateLabel'));

        /* 결제 수단 설정 */
        cy.get('#keyword').type('monki20240508102020');
        cy.get('.card-body > .row > .my-sm-auto > .btn').click();
        cy.get('#btnPayment_0').click();
        cy.get('#modal_body > .row > .text-end > .btn').click();
        cy.wait(1*1000)
        cy.get('#store_biz_number').type(Cypress.env('DateLabel'))
        cy.wait(1*1000)
        cy.get('#pg_company').select(2);
        cy.get('#payment_type').select(1)
        cy.get('#pg_mid_type').select(1)
        cy.get('#pg_mid').type(Cypress.env('DateLabel'))
        cy.get('#pg_merchant_key').type('2d6ECGhR1pg/1QGE1lcRI4awsWEgshjEyI8UgYslLPJSuNeyPTkdrT8XWARezvDTUJClWQWhjxzBbu7AsuLZqg==')
        cy.get('#store_contract_device').select(2);
        cy.get(':nth-child(11) > .text-end > .btn').click();
        cy.get('#global_modal_body').contains('등록 하시겠습니까?');
        cy.wait(1*1000);
        cy.get('#global_modal_confirm').click();
        cy.get('#vuePayContainer > .modal-dialog > .modal-content > #modal_body').contains('KIS');
        cy.get('#vuePayContainer > .modal-dialog > .modal-content > .modal-header > .btn-close').click();

        /* 버추얼 로그인 */
        cy.get(':nth-child(9) > .text-sm').click();
        cy.wait(1*1000);
        cy.get('#global_modal_confirm').click();

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
        

        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.get('#product').click();
        cy.get('#btnAddProduct').click();
        cy.get('#productDivNo').select(1)
        cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('김밥');
        cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('1000');
        cy.get('#PRDT_010').click();
        cy.get('#PRSS_001').click();
        cy.get('#displayMonkiYn').click();
        cy.get('.ms-auto').click();
        cy.wait(1*1000)
        cy.get('#global_modal_confirm').click();
        cy.get('#product-section').contains('김밥');

        /* 메뉴그룹 생성 */
        cy.get('[href="/menu/menu-group"] > .btn').click();
        cy.get('#btnAddMenuGroup').click();
        cy.wait(1*1000)
        cy.get('#category_nm').type('분식')
        cy.get('.modal-footer > .btn-primary').click();
        cy.get('#vueMenuGroupMain').contains('분식');

        /* 메뉴그룹 관리 */
        cy.get(':nth-child(3) > :nth-child(5) > .btn').click();
        cy.get('tr > :nth-child(1) > .btn').click();
        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1*1000)
        cy.get('#global_modal_confirm').click();

        /* 먼키앱메뉴 등록*/
        cy.get('[href="/menu/app"] > .btn').click();
        cy.get(':nth-child(1) > :nth-child(12) > .btn').click();
        cy.get('#bestMenuYn_true').click();
        cy.get('#MN_001').click();
        cy.get('.ms-auto').click();
        cy.wait(1*1000);
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