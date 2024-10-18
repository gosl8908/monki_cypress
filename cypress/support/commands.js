// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const dataTransfer = new DataTransfer(); // dataTransfer 객체 정의

Cypress.Commands.add('ModuleAdd', (select, target, x_coordinate, y_coordinate) => {
    cy.get(select)
        .trigger('dragstart', { dataTransfer, button: 0, force: true })
        .trigger('dragover', { clientX: 100, clientY: 100 });
    cy.get(target).trigger('drop', { dataTransfer, which: 1, pageX: x_coordinate, pageY: y_coordinate, force: true });
});

// 시간 선언
function getCurrentDate() {
    const now = new Date(); // 날짜와 시간을 원하는 형식으로 변환
    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']; // 숫자 0부터 6까지 요일을 표시하는 배열

    // 한국 표준시(Asia/Seoul)로 시간대를 설정합니다.
    const options = { timeZone: 'Asia/Seoul' };
    const year = now.getFullYear(); // 년도를 얻어옵니다.
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월을 얻어옵니다. (월은 0부터 시작하므로 1을 더해줍니다.)
    const day = String(now.getDate()).padStart(2, '0'); // 일을 얻어옵니다.
    const hours = String(now.getHours()).padStart(2, '0'); // 시간을 얻어옵니다.
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 분을 얻어옵니다.
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 초를 얻어옵니다.
    const dayOfWeek = daysOfWeek[now.getDay()]; // 요일을 얻어옵니다.

    // 지정된 시간대로 날짜와 시간을 형식화합니다.
    const formattedDate = now.toLocaleString('ko-KR', options);

    return {
        Date: `${year}-${month}-${day}`,
        Time: `${hours}:${minutes}:${seconds}`,
        DateLabel: `${year}${month}${day}${hours}${minutes}${seconds}`,
        DateLabelWeek: `${year}-${month}-${day} ${dayOfWeek} ${hours}:${minutes}:${seconds}`,
        EmailTitle: `${year}-${month}-${day} ${dayOfWeek} Cypress 자동화 테스트 결과`,
    };
}
Cypress.Commands.add('setDateToEnv', () => {
    const currentDate = getCurrentDate();
    Cypress.env('Date', currentDate.Date);
    Cypress.env('Time', currentDate.Time);
    Cypress.env('DateLabel', currentDate.DateLabel);
    Cypress.env('DateLabelWeek', currentDate.DateLabelWeek);
    Cypress.env('EmailTitle', currentDate.EmailTitle);
});

Cypress.Commands.add('getAll', () => {
    cy.getAllCookies(); // 쿠키 삭제
    cy.getAllLocalStorage(); // 로컬 삭제
    cy.getAllSessionStorage(); // 세션 삭제
});
Cypress.Commands.add('err', (TestFails, FailedTests, FailureObj) => {
    Cypress.on('fail', (err, runnable) => {
        const ErrMessage = err.message || '알 수 없는 이유로 실패함';
        if (!TestFails.includes(ErrMessage)) {
            TestFails.push(ErrMessage);
            FailedTests.push(runnable.title); // 실패한 테스트의 타이틀을 저장
        }
        FailureObj.Failure = true; // Using an object to track the failure
        throw err;
    });
});

Cypress.on('uncaught:exception', (err, runnable) => {
    // 여기서 원하는 조건에 따라 에러를 무시할 수 있습니다.
    return false; // false를 반환하면 Cypress가 테스트를 실패하지 않도록 합니다.
});

// Cypress.on('uncaught:exception', (err, runnable) => {
//     // '403' 오류를 무시하거나 로그를 추가할 수 있습니다.
//     if (err.message.includes('403')) {
//         return false; // 오류 무시
//     }
//     return true; // 다른 오류는 여전히 처리됨
// });
