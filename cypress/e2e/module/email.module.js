function screenshot2(FailureObj, Screenshots, currentTest) {
    const f = {
        getFileName: filePath => {
            return filePath.split('/').pop(); // 파일 경로에서 파일명만 추출
        },
    };

    if (FailureObj.Failure) {
        // Check the property of the object
        const sanitizedTitle = currentTest.title.replace(/[^a-z0-9]/gi, '_'); // Sanitize title for filename
        const ScreenshotFileName = `${sanitizedTitle}_${Cypress.env('DateLabel')}`;

        cy.screenshot(ScreenshotFileName, { capture: 'fullPage' });

        // 플랫폼별 경로 차이 없이 단순하게 파일 이름만 추가
        Screenshots.push(ScreenshotFileName);

        FailureObj.Failure = false; // Update the Failure state in the object
    }

    return Screenshots;
}
function screenshot(Failure, Screenshots, currentTest) {
    const f = {
        getFileName: filePath => {
            return filePath.split('/').pop(); // 파일 경로에서 파일명만 추출
        },
    };
    if (Failure) {
        const ScreenshotFileName = `${currentTest.title}_${Cypress.env('DateLabel')}`;
        cy.screenshot(ScreenshotFileName, { capture: 'fullPage' });

        // 플랫폼별 경로 차이 없이 단순하게 파일 이름만 추가
        Screenshots.push(ScreenshotFileName);

        Failure = false;
    }
    return Screenshots;
}
function email({ TestFails, describeTitle, EmailTitle, TestRange, Screenshots, currentTest }) {
    const IsTestFailed = TestFails.length > 0;
    const EmailBody = `${describeTitle} 자동화 테스트 스위트가 ${IsTestFailed ? '실패' : '성공'}하였습니다.\n
    테스트 실행 시간 : ${Cypress.env('DateLabelWeek')}\n
    테스트 범위 : ${TestRange}\n
    ${
        IsTestFailed
            ? `
    테스트 실패 원인 : \n${currentTest.map((title, index) => `${title}: ${TestFails[index]}`).join('\n')}`
            : ''
    }`;

    cy.log('테스트가 성공적으로 완료되었습니다.');

    const EmailInfo = {
        subject: `${EmailTitle}`,
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
    email,
    screenshot,
    screenshot2,
};
