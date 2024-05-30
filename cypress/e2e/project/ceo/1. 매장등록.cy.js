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
        cy.get('.m-3 > .col-3 > .btn').click(); // 매장등록

        /* 매장 등록 */
        cy.get('#user-id').type(Cypress.env('TestId2')); // 아이디
        cy.get('#btn-check-user-id').click();
        cy.get('#user-pass').type(Cypress.env('TestPwd')); // 비밀번호
        cy.get('#chk-user-pass').type(Cypress.env('TestPwd')); // 비밀번호 확인
        cy.get('#sel-mng-partner').click(); // 대리점선택
        cy.get('#vuePartnersContainer > .modal-dialog > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.get('#global_modal_body').contains('등록하시겠습니까?');
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.get('#store-name').type('번개매장 강남지점'); // 매장명

        /* 매장로고 */
        cy.fixture('image/로고이미지/번개로고.jpg', 'base64').then(fileContent => {
            cy.get('input[type="file"][id="logo-img-file"]').attachFile({
                fileContent,
                filePath: 'image/로고이미지/번개로고.jpg',
                fileName: '번개로고.jpg',
                mimeType: 'image/jpeg',
            });
        });
        cy.get('#tbo-admin-pwd').type('111111'); // 디바이스 관리자 비밀번호
        cy.get('#first-biz-category-no').select(1); // 업종 카테고리
        cy.get('#STNS_102').click();
        cy.get('#store-biz-number').type(Cypress.env('DateLabel')); // 사업자번호
        cy.get('#btn-check-store-biz-number').click();
        cy.get('#owner-name').type('강해성'); // 대표자명
        cy.get('#tel').type(Cypress.env('Phone')); // 전화번호

        const apiKey = '419ed37eb9960d76f12d9ff0610d327a';
        const query = encodeURIComponent('경기 안양시 동안구 평촌대로 60-55');

        const url = `http://dapi.kakao.com/v2/local/search/address.json?query=${query}&page=1&size=10`;

        cy.request({
            method: 'GET',
            url: url,
            headers: {
                Accept: '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5',
                Authorization: `KakaoAK ${apiKey}`,
                Host: 'dapi.kakao.com',
                ka: 'sdk/4.4.15 os/javascript lang/ko-KR device/Win32 origin/http%3A%2F%2Fstaging-mngr.monthlykitchen.kr',
                Origin: 'http://staging-mngr.monthlykitchen.kr',
                Referer: 'http://staging-mngr.monthlykitchen.kr/',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
        }).then(response => {
            // 응답을 검증하거나 필요한 테스트를 진행합니다.
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('documents');
            expect(response.body).to.have.property('meta');

            /* 주소 입력 */
            const address = response.body.documents.map(document => document.address.address_name);
            const addressNames = response.body.documents.map(document => document.address_name);
            const x = response.body.documents.map(document => document.address.x);
            const y = response.body.documents.map(document => document.address.y);
            cy.get('#address').invoke('val', address.join(', '));
            cy.get('#road-address').invoke('val', addressNames.join(', '));
            cy.get('#longitude').invoke('val', x.join(', '));
            cy.get('#latitude').invoke('val', y.join(', '));
        });

        cy.get('#address-detail').invoke('val', '1-1'); // 상세 주소
        cy.get('#biz-email').type(Cypress.env('TestEmail')); // 이메일
        cy.get('#bank-code').select(1); // 계좌정보
        cy.get('#account-number').type('3333048408739'); // 계좌번호
        cy.get('#account-user').type('예금주'); // 예금주명
        cy.get('#btn-reg-store').click();
        cy.get('#global_modal_body').contains('입력한 정보로 생성하시겠습니까?');
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.get('#vueContainer').contains(Cypress.env('TestId2'));

        /* 연동 정보 */
        cy.contains('span', Cypress.env('TestId2'))
            .parents('tr')
            .within(() => {
                cy.contains('관리').click();
            });
        /* 테이블오더 사용 */
        cy.get('#table_order_true').click();
        cy.get('#vueSolutionContainer > .modal-dialog > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        // /* 버추얼 로그인 */
        // cy.get(':nth-child(9) > .text-sm').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();
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
    //     emailModule.email({
    //         TestFails: TestFails,
    //         EmailTitle: `[${Cypress.env('EmailTitle')}]`,
    //         TestRange: TestRange,
    //         Screenshots: Screenshots,
    //     });
    // });
});
