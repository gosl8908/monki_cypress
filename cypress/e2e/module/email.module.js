function Email({ TestFails, EmailTitle, TestRange, Screenshots }) {
    const IsTestFailed = TestFails.length > 0;
    const EmailBody = `Cypress 자동화 테스트 스위트가 ${IsTestFailed ? '실패' : '성공'}하였습니다.
    테스트 실행 시간 : ${Cypress.env('DateLabelWeek')}
    테스트 범위 : ${TestRange}
    ${
        IsTestFailed
            ? `
    테스트 실패 원인 : ${TestFails.join('\n')}`
            : ''
    }`;

    cy.log('테스트가 성공적으로 완료되었습니다.');

    const EmailInfo = {
        subject: `${EmailTitle} 자동화 테스트 결과`,
        body: EmailBody,
        screenshotFileNames: Screenshots.map(name => name + '.png'), // 스크린샷 파일 이름들을 추가
    };

    cy.task('sendEmail', EmailInfo).then(success => {
        if (success) {
            cy.log('이메일 전송 성공.');
        } else {
            cy.log('이메일 전송 실패.');
        }
    });
}

module.exports = {
    Email: Email,
};