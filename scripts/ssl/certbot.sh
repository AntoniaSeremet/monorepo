certbot certonly --non-interactive --manual \
 --manual-auth-hook "./auth-hook.sh UPSERT crocoder.dev" \
 --manual-cleanup-hook "./auth-hook.sh DELETE crocoder.dev" \
 --preferred-challenge dns \
 --config-dir "./letsencrypt" \
 --work-dir "./letsencrypt" \
 --logs-dir "./letsencrypt" \
 --agree-tos \
 --manual-public-ip-logging-ok \
 --domains crocoder.dev,jobs.crocoder.dev,www.crocoder.dev,blog.crocoder.dev,sa.crocoder.dev \
 --email david@crocoder.dev