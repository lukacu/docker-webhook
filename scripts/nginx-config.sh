#!/bin/sh

OUTFILE=$1

if [ -z "${GITHUB_WEBHOOK}" ]; then
GITHUB_WEBHOOK=webhook
fi

if [ -z "${ROOT_PATH}" ]; then
ROOT_PATH=/srv/www/build
fi

echo """server {
    listen 80 default_server backlog=2048;
    root ${ROOT_PATH};
    index index.html;
    """ > $OUTFILE

echo """
        location /$GITHUB_WEBHOOK {
		rewrite  ^ / break;
		proxy_pass http://127.0.0.1:9001;
	}""" >> $OUTFILE

echo """
        location / {
        try_files \$uri \$uri/ /index.html;
	}
}""" >> $OUTFILE

