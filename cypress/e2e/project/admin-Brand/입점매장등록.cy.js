const { loginModule, emailModule, apiModule } = require('../../module/manager.module.js');

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
        cy.get('[data-mnu="/kitchen/*"] > [href="#"] > p').click();
        cy.get('.menu-open > .nav > :nth-child(2) > .nav-link > p').click();
        cy.get('#btnAddStore').click();
        cy.get('#store_nm').type('번개브랜드매장'); // 매장 이름
        cy.get('#store_id').type(Cypress.env('FavTestId2')); //매장 코드
        cy.get('#btnCheckStoreId').click();
        cy.get('#first_biz_category_no').select(1);
        cy.get('#store_tel_no').type(Cypress.env('Phone'));
        cy.get('#manager_nm').type('강해성');
        cy.get('#manager_tel_no').type(Cypress.env('Phone'));
        cy.get('#store_desc').type('번개브랜드매장'); // 매장 안내

        // 모듈화된 API 호출
        apiModule.api('경기 안양시 동안구 평촌대로 60-55').then(({ address_name, road_address_name, x, y }) => {
            // 주소 데이터를 각 입력 필드에 삽입
            cy.get('#address').invoke('val', address_name);
            cy.get('#road-address').invoke('val', road_address_name);
            cy.get('#longitude').invoke('val', x);
            cy.get('#latitude').invoke('val', y);
        });

        // const apiKey = '419ed37eb9960d76f12d9ff0610d327a';
        // const query = encodeURIComponent('경기 안양시 동안구 평촌대로 60-55');

        // const url = `http://dapi.kakao.com/v2/local/search/address.json?query=${query}&page=1&size=10`;

        // cy.request({
        //     method: 'GET',
        //     url: url,
        //     headers: {
        //         Accept: '*/*',
        //         'Accept-Encoding': 'gzip, deflate',
        //         'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5',
        //         Authorization: `KakaoAK ${apiKey}`,
        //         Host: 'dapi.kakao.com',
        //         ka: 'sdk/4.4.15 os/javascript lang/ko-KR device/Win32 origin/http%3A%2F%2Fstaging-mngr.monthlykitchen.kr',
        //         Origin: 'http://staging-mngr.monthlykitchen.kr',
        //         Referer: 'http://staging-mngr.monthlykitchen.kr/',
        //         'User-Agent':
        //             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        //     },
        // }).then(response => {
        //     // 응답을 검증하거나 필요한 테스트를 진행합니다.
        //     expect(response.status).to.eq(200);
        //     expect(response.body).to.have.property('documents');
        //     expect(response.body).to.have.property('meta');

        //     /* 주소 입력 */
        //     const address = response.body.documents.map(document => document.address.address_name);
        //     const addressNames = response.body.documents.map(document => document.address_name);
        //     const x = response.body.documents.map(document => document.address.x);
        //     const y = response.body.documents.map(document => document.address.y);
        //     cy.get('#address').invoke('val', address.join(', '));
        //     cy.get('#road_address').invoke('val', addressNames.join(', '));
        //     cy.get('#longitude').invoke('val', x.join(', '));
        //     cy.get('#latitude').invoke('val', y.join(', '));
        // });

        cy.fixture('image/로고이미지/번개썸네일.jpg', 'base64').then(fileContent => {
            cy.get('input[type="file"][id="logo_file"]').attachFile({
                fileContent,
                filePath: 'image/로고이미지/썸네일이미지.jpg',
                fileName: '썸네일이미지.jpg',
                mimeType: 'image/jpeg',
            });
        });
        cy.fixture('image/로고이미지/번개상단.png', 'base64').then(fileContent => {
            cy.get('input[type="file"][id="banner_file"]').attachFile({
                fileContent,
                filePath: 'image/로고이미지/번개상단.png',
                fileName: '번개상단.png',
                mimeType: 'image/png',
            });
        });

        cy.get('#user_id').type(Cypress.env('TestId3'));
        cy.get('#btnCheckUserId').click();
        cy.get('#user_pass').type(Cypress.env('TestPwd'));
        cy.get('#user_pass_chk').type(Cypress.env('TestPwd'));
        cy.get('#user_nm').type('강해성');
        cy.get('#user_phone').type(Cypress.env('Phone'));
        cy.get('#user_email').type(Cypress.env('TestEmail'));
        cy.get('#company_number').type('123412341234');
        cy.get('#account_number').type('3333048408739');
        cy.get('#account_user').type('강해성');
        cy.get('#biz_name').type('번개브랜드매장');
        cy.get('.float-right > .btn').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        cy.contains('번개브랜드매장');
    });

    //   cy.get('#global_modal_body').contains('입력한 내용으로 등록하시겠습니까?');
    //   cy.get('#global_modal_confirm').click();

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '입점 매장 등록',
            Screenshots,
        });
    });
});
