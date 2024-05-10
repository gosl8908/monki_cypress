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
            Site: `${Cypress.env('StgAdmin')}`,
            Id: `${Cypress.env('TestId3')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
     
      cy.get('[data-mnu="/kitchen/*"] > [href="#"] > p').click();
      cy.get('.menu-open > .nav > :nth-child(2) > .nav-link > p').click();
      cy.get('#btnAddStore').click();
      cy.get('#store_nm').type('번개매장')
      cy.get('#store_id').type('monkitest'+Cypress.env('DateLabel'));
      cy.get('#btnCheckStoreId').click();
      cy.get('#first_biz_category_no').select(1)
      cy.get('#store_tel_no').type('01012341234')
      cy.get('#manager_nm').type('테스트')
      cy.get('#manager_tel_no').type('01012341234')
      cy.get('#store_desc').type('테스트매장')
      const apiKey = '419ed37eb9960d76f12d9ff0610d327a';
      const query = encodeURIComponent('경기 안양시 동안구 평촌대로 60-55');
      
      const url = `http://dapi.kakao.com/v2/local/search/address.json?query=${query}&page=1&size=10`;

      cy.request({
        method: 'GET',
        url: url,
        headers: {
          'Accept':'*/*',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5',
          'Authorization': `KakaoAK ${apiKey}`,
          'Host':'dapi.kakao.com',
          'ka' :'sdk/4.4.15 os/javascript lang/ko-KR device/Win32 origin/http%3A%2F%2Fstaging-mngr.monthlykitchen.kr',
          'Origin':'http://staging-mngr.monthlykitchen.kr',
          'Referer':'http://staging-mngr.monthlykitchen.kr/',
          'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        }
      }).then(response => {
        // 응답을 검증하거나 필요한 테스트를 진행합니다.
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('documents');
        expect(response.body).to.have.property('meta');
        const address = response.body.documents.map(document => document.address.address_name);
        cy.get('#address').invoke('val', address.join(', '));
        const addressNames = response.body.documents.map(document => document.address_name);
        cy.get('#road_address').invoke('val', addressNames.join(', '));
        const x = response.body.documents.map(document => document.address.x);
        cy.get('#latitude').invoke('val', x.join(', '));
        const y = response.body.documents.map(document => document.address.y);
        cy.get('#longitude').invoke('val', y.join(', '));
      });

      cy.fixture('image/썸네일이미지.jpg', 'base64').then(fileContent => {
        cy.get('input[type="file"][id="logo_file"]').attachFile({
            fileContent,
            filePath: 'image/썸네일이미지.jpg',
            fileName: '썸네일이미지.jpg',
            mimeType: 'image/jpeg',
        });
    });
    cy.fixture('image/비빔면.jpg', 'base64').then(fileContent => {
      cy.get('input[type="file"][id="banner_file"]').attachFile({
          fileContent,
          filePath: 'image/비빔면.jpg',
          fileName: '비빔면.jpg',
          mimeType: 'image/jpeg',
      });
  });
    cy.get('#user_id').type('monki'+Cypress.env('DateLabel'));
    cy.get('#btnCheckUserId').click();
    cy.get('#user_pass').type('test123!')
    cy.get('#user_pass_chk').type('test123!');
    cy.get('#user_nm').type('강해성')
    cy.get('#user_phone').type('01012341234')
    cy.get('#user_email').type('hskang@monki.net')
    cy.get('#company_number').type('123412341234')
    cy.get('#account_number').type('3333048408739')
    cy.get('#account_user').type('강해성')
    cy.get('#biz_name').type('번개매장');
    cy.get('.float-right > .btn').click();
    cy.wait(1*1000);
    cy.get('#global_modal_confirm').click();

    cy.contains(':nth-child(3) > .row > .col-12').contains('monkitest'+Cypress.env('DateLabel')).click();
    cy.get('#select_store_status').select(1)
    cy.get('.float-right > .btn').click();
    cy.wait(1*1000);
    cy.get('#global_modal_confirm').click();
    
    });
      

    //   cy.get('#global_modal_body').contains('입력한 내용으로 등록하시겠습니까?');
    //   cy.get('#global_modal_confirm').click();
      

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
// });