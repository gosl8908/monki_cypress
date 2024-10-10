const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('Test', () => {
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
            Id: `${Cypress.env('FavTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/option"] > .btn').click();

        function registerOptionGroup(optionGroup) {
            const { size, options } = optionGroup;

            cy.get('.col-12 > .btn').click();
            cy.get('[id="OP_002"]').click(); // 다중
            cy.get('[name="optionMaxCount"]').clear().type('2'); // 수량
            cy.get('[id="requireYn_false"]').click(); // 선택
            cy.get('[name="optionGroupNm"]').type(size); // 그룹명
            for (let i = 0; i < options.length - 1; i++) {
                cy.get('div.col-3 > .btn').click();
            }

            options.forEach((option, index) => {
                cy.get('[name="optionNm"]').eq(index).type(option.name); // 옵션명
                cy.get('[name="optionPrice"]').eq(index).clear().type(option.price); // 가격
            });

            cy.get('.ms-auto').click();
            cy.wait(1000); // 1 second wait
            cy.get('#global_modal_confirm').click();
        }
        // const menuPrices = `
        // 옥수수볼,5000
        // 달걀듬뿍볶음밥,4000
        // 의성마늘볶음밥,4000
        // 샐러드 추가,5000
        // 고르곤치즈볼,6000
        // 와일드블랙소스,1000
        // 허니케찹소스,1000
        // 치즈트러플시즈닝,2000
        // 무 추가,1000
        // 레드디핑소스,1000
        // `;
        const menuPrices = `
        테스트,1000
        `;
        const optionsArray = menuPrices
            .trim()
            .split('\n')
            .map(line => {
                const [name, price] = line.split(',').map(item => item.trim());
                return { name, price };
            });

        const optionGroups = [
            {
                size: '사이드메뉴',
                options: optionsArray,
            },
        ];

        optionGroups.forEach(group => {
            registerOptionGroup(group);
        });
    });

    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '옵션 그룹 등록',
            Screenshots,
        });
    });
});
