curl -vvv --url 'smtps://smtp.dooray.com:465' \
    --ssl-reqd \
    --mail-from 'hskang@monki.net' \
    --mail-rcpt 'hskang@monki.net' \
    --user 'hskang@monki.net:gotjd0215!' \
    -F '=(;type=multipart/mixed' -F "=$file_content;type=text/plain" \
    -F "=@./cypress/reports/html/index.html;encoder=base64" \
    -H "Subject: [$date] $subject 자동화 테스트 결과" \
    -H "From: <hskang@monki.net>" \
    -H "To:<hskang@monki.net>"