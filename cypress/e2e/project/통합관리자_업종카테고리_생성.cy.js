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
            Site: `${Cypress.env('StgAdmin')}`,
            Id: `${Cypress.env('AdminId')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
     
      cy.get('.sidebar').contains('연동 정보 관리').click();
      cy.get('.sidebar').contains('업종 카테고리').click();
      cy.contains('카테고리 추가').click();
      cy.get('#biz_category_nm').type(Cypress.env('DateLabel'));
      cy.get('#btnChkBcNm').click();
      cy.contains('체크완료');
      cy.get('#sort_order').type('10')
      cy.get('.custom-file-input').attachFile({
          filePath: 'image/다운로드.jpg',
          fileName: '다운로드.jpg',
          mimeType: 'image/jpeg',
        });
        cy.get('#vueBizCategoryModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
        cy.wait(3*1000)
        cy.get('#global_modal_confirm').click();
        cy.contains('등록했습니다.');

        cy.wait(5*1000);
        cy.get('.content').contains(Cypress.env('DateLabel')).click();
        cy.get(':nth-child(6) > .btn').click();
        cy.wait(3*1000)
        cy.get('#global_modal_confirm').click();
        cy.contains('삭제했습니다.');

});
    // cy.get('input[accept=".zip"][type="file"]').attachFile({
    //     // fileContent,
    //     filePath: FilePathDataset,
    //     fileName: Dataset,
    //     mimeType: 'application/zip',
      


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