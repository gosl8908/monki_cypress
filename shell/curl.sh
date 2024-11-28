# curl -vvv --url 'smtps://smtp.dooray.com:465' \
#     --ssl-reqd \
#     --mail-from 'hskang@monki.net' \
#     --mail-rcpt 'hskang@monki.net' \
#     --user 'hskang@monki.net:gotjd0215!' \
#     -F '=(;type=multipart/mixed' -F "=$file_content;type=text/plain" \
#     -F "=@./cypress/reports/html/index.html;encoder=base64" \
#     -H "Subject: [$date $subject Cypress 자동화 테스트 결과 - Scheduled ceo page basic Testing]" \
#     -H "From: <hskang@monki.net>" \
#     -H "To:<hskang@monki.net>"

#!/bin/bash

# 현재 날짜와 제목 설정
DATE=$(date +"%Y-%m-%d")
SUBJECT="Cypress 자동화 테스트 결과 - Scheduled CEO Page Basic Testing"

# `curl` 명령 실행
curl -vvv --url 'smtps://smtp.dooray.com:465' \
    --ssl-reqd \
    --mail-from "$DOORAY_EMAIL_ID" \
    --mail-rcpt "$DOORAY_EMAIL_ID" \
    --user "$DOORAY_EMAIL_ID:$DOORAY_EMAIL_PWD" \
    -F '=(;type=multipart/mixed' \
    -F "=$file_content;type=text/plain" \
    -F "=@./cypress/reports/html/index.html;encoder=base64" \
    -H "Subject: [$DATE $SUBJECT]" \
    -H "From: <$DOORAY_EMAIL_ID>" \
    -H "To: <$DOORAY_EMAIL_ID>"