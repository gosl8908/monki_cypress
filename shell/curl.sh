curl -vvv --url 'smtps://smtp.dooray.com:465' \
    --ssl-reqd \
    --mail-from "$DOORAY_EMAIL_ID" \
    --mail-rcpt "$DOORAY_EMAIL_ID" \
    --user "$DOORAY_EMAIL_ID:$DOORAY_EMAIL_PWD" \
    -F '=(;type=multipart/mixed' -F "=$file_content;type=text/plain" \
    -F "=@./cypress/reports/html/index.html;encoder=base64" \
    -H "Subject: [$date $subject Cypress 자동화 테스트 결과 - Scheduled ceo page basic Testing]" \
    -H "From: <$DOORAY_EMAIL_ID>" \
    -H "To:<$DOORAY_EMAIL_ID>"