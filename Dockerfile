FROM nginx:alpine

RUN  apk add --no-cache nodejs npm runit sudo bash

RUN npm install github-webhook-handler -g

COPY ./etc /etc
COPY ./scripts /scripts
COPY ./start_runit /sbin/start_runit

RUN mkdir /srv/www && chown nginx:nginx /srv/www

EXPOSE 80

CMD ["/sbin/start_runit"]
