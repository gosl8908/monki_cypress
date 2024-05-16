const { addAbortSignal } = require('nodemailer/lib/xoauth2/index.js');
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

        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1*1000)
        cy.get('#product').click(); // 상품관리 탭

        /* 상품 등록 */
        cy.get('#btnAddProduct').click();
        cy.get('#productDivNo').select(1) // 상품분류
        
        /* 상품 이미지 */
        cy.fixture('image/코카콜라.jpg', 'base64').then(fileContent => {
            cy.get('input[type="file"][id="product-img-file"]').attachFile({
                fileContent,
                filePath: 'image/코카콜라.jpg',
                fileName: '코카콜라.jpg',
                mimeType: 'image/jpeg',
            });
        });
        cy.get('#PRDT_010').click(); // 품절 상태
        cy.get('#PRSS_001').click(); // 판매 상태
        cy.get('#displayMonkiYn').click(); // 노출 채널
        cy.get('#displayKioskYn').click(); // 노출 채널
        cy.get('#displayTableorderYn').click(); // 노출 채널
        cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('코카콜라'); // 상품명
        cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
        cy.get('.ms-auto').click();
        cy.wait(1*1000)
        cy.get('#global_modal_confirm').click();

        /* 상품 등록 */
        cy.get('#btnAddProduct').click(); 
        cy.get('#productDivNo').select(1) // 상품분류
        
        /* 상품 이미지 */
        cy.fixture('image/코카콜라제로.jpg', 'base64').then(fileContent => {
            cy.get('input[type="file"][id="product-img-file"]').attachFile({
                fileContent,
                filePath: 'image/코카콜라제로.jpg',
                fileName: '코카콜라제로.jpg',
                mimeType: 'image/jpeg',
            });
        });
        cy.get('#PRDT_010').click(); // 품절 상태
        cy.get('#PRSS_001').click(); // 판매 상태
        cy.get('#displayMonkiYn').click(); // 노출 채널
        cy.get('#displayKioskYn').click(); // 노출 채널
        cy.get('#displayTableorderYn').click(); // 노출 채널
        cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('코카콜라제로'); // 상품명
        cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
        cy.get('.ms-auto').click();
        cy.wait(1*1000)
        cy.get('#global_modal_confirm').click();

        /* 상품 등록 */
        cy.get('#btnAddProduct').click();
        cy.get('#productDivNo').select(1) // 상품분류
        
        /* 상품 이미지 */
        cy.fixture('image/펩시.jpg', 'base64').then(fileContent => {
            cy.get('input[type="file"][id="product-img-file"]').attachFile({
                fileContent,
                filePath: 'image/펩시.jpg',
                fileName: '펩시.jpg',
                mimeType: 'image/jpeg',
            });
        });
        cy.get('#PRDT_010').click(); // 품절 상태
        cy.get('#PRSS_001').click(); // 판매 상태
        cy.get('#displayMonkiYn').click(); // 노출 채널
        cy.get('#displayKioskYn').click(); // 노출 채널
        cy.get('#displayTableorderYn').click(); // 노출 채널
        cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('펩시'); // 상품명
        cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
        cy.get('.ms-auto').click();
        cy.wait(1*1000)
        cy.get('#global_modal_confirm').click();

                /* 상품 등록 */
                cy.get('#btnAddProduct').click();
                cy.get('#productDivNo').select(1) // 상품분류
                
                /* 상품 이미지 */
                cy.fixture('image/펩시(제로).jpg', 'base64').then(fileContent => {
                    cy.get('input[type="file"][id="product-img-file"]').attachFile({
                        fileContent,
                        filePath: 'image/펩시(제로).jpg',
                        fileName: '펩시(제로).jpg',
                        mimeType: 'image/jpeg',
                    });
                });
                cy.get('#PRDT_010').click(); // 품절 상태
                cy.get('#PRSS_001').click(); // 판매 상태
                cy.get('#displayMonkiYn').click(); // 노출 채널
                cy.get('#displayKioskYn').click(); // 노출 채널
                cy.get('#displayTableorderYn').click(); // 노출 채널
                cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('펩시(제로)'); // 상품명
                cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
                cy.get('.ms-auto').click();
                cy.wait(1*1000)
                cy.get('#global_modal_confirm').click();

                        /* 상품 등록 */
        cy.get('#btnAddProduct').click();
        cy.get('#productDivNo').select(1) // 상품분류
        
        /* 상품 이미지 */
        cy.fixture('image/스프라이트.jpg', 'base64').then(fileContent => {
            cy.get('input[type="file"][id="product-img-file"]').attachFile({
                fileContent,
                filePath: 'image/스프라이트.jpg',
                fileName: '스프라이트.jpg',
                mimeType: 'image/jpeg',
            });
        });
        cy.get('#PRDT_010').click(); // 품절 상태
        cy.get('#PRSS_001').click(); // 판매 상태
        cy.get('#displayMonkiYn').click(); // 노출 채널
        cy.get('#displayKioskYn').click(); // 노출 채널
        cy.get('#displayTableorderYn').click(); // 노출 채널
        cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('스프라이트'); // 상품명
        cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
        cy.get('.ms-auto').click();
        cy.wait(1*1000)
        cy.get('#global_modal_confirm').click();

                /* 상품 등록 */
                cy.get('#btnAddProduct').click();
                cy.get('#productDivNo').select(1) // 상품분류
                
                /* 상품 이미지 */
                cy.fixture('image/스프라이트(제로).jpg', 'base64').then(fileContent => {
                    cy.get('input[type="file"][id="product-img-file"]').attachFile({
                        fileContent,
                        filePath: 'image/스프라이트(제로).jpg',
                        fileName: '스프라이트(제로).jpg',
                        mimeType: 'image/jpeg',
                    });
                });
                cy.get('#PRDT_010').click(); // 품절 상태
                cy.get('#PRSS_001').click(); // 판매 상태
                cy.get('#displayMonkiYn').click(); // 노출 채널
                cy.get('#displayKioskYn').click(); // 노출 채널
                cy.get('#displayTableorderYn').click(); // 노출 채널
                cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('스프라이트(제로)'); // 상품명
                cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
                cy.get('.ms-auto').click();
                cy.wait(1*1000)
                cy.get('#global_modal_confirm').click();

                                /* 상품 등록 */
                                cy.get('#btnAddProduct').click();
                                cy.get('#productDivNo').select(1) // 상품분류
                                
                                /* 상품 이미지 */
                                cy.fixture('image/스프라이트(제로).jpg', 'base64').then(fileContent => {
                                    cy.get('input[type="file"][id="product-img-file"]').attachFile({
                                        fileContent,
                                        filePath: 'image/스프라이트(제로).jpg',
                                        fileName: '스프라이트(제로).jpg',
                                        mimeType: 'image/jpeg',
                                    });
                                });
                                cy.get('#PRDT_010').click(); // 품절 상태
                                cy.get('#PRSS_001').click(); // 판매 상태
                                cy.get('#displayMonkiYn').click(); // 노출 채널
                                cy.get('#displayKioskYn').click(); // 노출 채널
                                cy.get('#displayTableorderYn').click(); // 노출 채널
                                cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('스프라이트(제로)'); // 상품명
                                cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
                                cy.get('.ms-auto').click();
                                cy.wait(1*1000)
                                cy.get('#global_modal_confirm').click();

                                                               /* 상품 등록 */
                                                               cy.get('#btnAddProduct').click();
                                                               cy.get('#productDivNo').select(1) // 상품분류
                                                               
                                                               /* 상품 이미지 */
                                                               cy.fixture('image/스프라이트(제로).jpg', 'base64').then(fileContent => {
                                                                   cy.get('input[type="file"][id="product-img-file"]').attachFile({
                                                                       fileContent,
                                                                       filePath: 'image/스프라이트(제로).jpg',
                                                                       fileName: '스프라이트(제로).jpg',
                                                                       mimeType: 'image/jpeg',
                                                                   });
                                                               });
                                                               cy.get('#PRDT_010').click(); // 품절 상태
                                                               cy.get('#PRSS_001').click(); // 판매 상태
                                                               cy.get('#displayMonkiYn').click(); // 노출 채널
                                                               cy.get('#displayKioskYn').click(); // 노출 채널
                                                               cy.get('#displayTableorderYn').click(); // 노출 채널
                                                               cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('스프라이트(제로)'); // 상품명
                                                               cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
                                                               cy.get('.ms-auto').click();
                                                               cy.wait(1*1000)
                                                               cy.get('#global_modal_confirm').click();

                                                                                              /* 상품 등록 */
                                cy.get('#btnAddProduct').click();
                                cy.get('#productDivNo').select(1) // 상품분류
                                
                                /* 상품 이미지 */
                                cy.fixture('image/스프라이트(제로).jpg', 'base64').then(fileContent => {
                                    cy.get('input[type="file"][id="product-img-file"]').attachFile({
                                        fileContent,
                                        filePath: 'image/스프라이트(제로).jpg',
                                        fileName: '스프라이트(제로).jpg',
                                        mimeType: 'image/jpeg',
                                    });
                                });
                                cy.get('#PRDT_010').click(); // 품절 상태
                                cy.get('#PRSS_001').click(); // 판매 상태
                                cy.get('#displayMonkiYn').click(); // 노출 채널
                                cy.get('#displayKioskYn').click(); // 노출 채널
                                cy.get('#displayTableorderYn').click(); // 노출 채널
                                cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type('스프라이트(제로)'); // 상품명
                                cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type('2500'); // 가격
                                cy.get('.ms-auto').click();
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