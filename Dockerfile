FROM nginx:alpine

RUN  apk add --no-cache nodejs npm runit sudo bash

RUN mkdir /scripts && cd /scripts && npm install @octokit/webhooks

COPY ./etc /etc
COPY ./scripts /scripts
COPY ./start_runit /sbin/start_runit

RUN mkdir /srv/www && chown nginx:nginx /srv/www

EXPOSE 80

ENTRYPOINT ["/sbin/start_runit"]
