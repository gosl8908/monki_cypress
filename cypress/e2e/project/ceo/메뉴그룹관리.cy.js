const { loginModule, emailModule, menuModule } = require('../../module/manager.module.js');

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
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        /* 분식 메뉴그룹 관리 */
        cy.contains('span', '분식')
        .parents('tr')
        .within(() => {
          cy.get('button').contains('메뉴 관리').eq(0).click();
        });

        cy.wait(1 * 1000);
        cy.contains('span', '김밥')
        .parents('tr')
        .within(() => {
          cy.get('button').contains('추가').click();
        });
        cy.contains('span', '라면')
        .parents('tr')
        .within(() => {
          cy.get('button').contains('추가').click();
        });
        cy.contains('span', '쫄면')
        .parents('tr')
        .within(() => {
          cy.get('button').contains('추가').click();
        });

        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        /* 일식 메뉴그룹 관리 */
        cy.contains('span', '일식')
        .parents('tr')
        .within(() => {
          cy.get('button').contains('메뉴 관리').eq(0).click();
        });
    
        cy.wait(1 * 1000);
        cy.contains('span', '돈가스')
        .parents('tr')
        .within(() => {
          cy.get('button').contains('추가').click();
        });
        cy.contains('span', '치즈돈가스')
        .parents('tr')
        .within(() => {
          cy.get('button').contains('추가').click();
        });
    
        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

            /* 한식 메뉴그룹 관리 */
            cy.contains('span', '한식')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('메뉴 관리').eq(0).click();
            });
            
            cy.wait(1 * 1000);
            cy.contains('span', '비빔면')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('추가').click();
            });
            
            cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            cy.wait(1 * 1000);
            cy.get('#global_modal_confirm').click();

            /* 양식 메뉴그룹 관리 */
            cy.contains('span', '양식')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('메뉴 관리').eq(0).click();
            });
            
            cy.wait(1 * 1000);
            cy.contains('span', '피자')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('추가').click();
            });
            
            cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            cy.wait(1 * 1000);
            cy.get('#global_modal_confirm').click();

            /* 음로 메뉴그룹 관리 */
            cy.contains('span', '음료')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('메뉴 관리').eq(0).click();
            });
            
            cy.wait(1 * 1000);
            cy.contains('span', '코카콜라')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('추가').click();
            });

            cy.wait(1 * 1000);
            cy.contains('span', '코카콜라제로')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('추가').click();
            });

            cy.wait(1 * 1000);
            cy.contains('span', '펩시')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('추가').click();
            });

            cy.wait(1 * 1000);
            cy.contains('span', '펩시제로')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('추가').click();
            });

            cy.wait(1 * 1000);
            cy.contains('span', '스프라이트')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('추가').click();
            });

            cy.wait(1 * 1000);
            cy.contains('span', '스프라이트제로')
            .parents('tr')
            .within(() => {
              cy.get('button').contains('추가').click();
            });
            
            cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            cy.wait(1 * 1000);
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
    //     emailModule.email({
    //         TestFails: TestFails,
    //         EmailTitle: `[${Cypress.env('EmailTitle')}]`,
    //         TestRange: TestRange,
    //         Screenshots: Screenshots,
    //     });
    // });
});
