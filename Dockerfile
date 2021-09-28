ARG NODE_VERSION
FROM node:${NODE_VERSION}

ARG NODE_ENV
ARG PORT
ARG PORT_STATS
ARG TZ
ARG VIRTUAL_HOST
ARG LETSENCRYPT_HOST
ARG LETSENCRYPT_EMAIL

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV PORT_STATS=${PORT_STATS}
ENV TZ=${TZ}
ENV VIRTUAL_HOST=${VIRTUAL_HOST}
ENV LETSENCRYPT_HOST=${LETSENCRYPT_HOST}
ENV LETSENCRYPT_EMAIL=${LETSENCRYPT_EMAIL}

RUN cp /usr/share/zoneinfo/${TZ} /etc/localtime

RUN mkdir -p /usr/app
RUN mkdir -p /usr/app/dist
RUN mkdir -p /usr/app/src
RUN mkdir -p /usr/app/logs && chmod -w /usr/app/logs
RUN mkdir -p /usr/app/data && chmod -w /usr/app/data
COPY config /usr/app/config
COPY src /usr/app/src
COPY package-lock.json /usr/app/package-lock.json
COPY package.json /usr/app/package.json
COPY gulpfile.js /usr/app/gulpfile.js
COPY tsconfig.json /usr/app/tsconfig.json
COPY run-config.json /usr/app/run-config.json
WORKDIR /usr/app

RUN npm i -g pm2 gulp
RUN NODE_ENV=development npm install
RUN NODE_ENV=development  npm run build

EXPOSE 80

CMD  NODE_ENV=${NODE_ENV} PORT=${PORT} TZ=${TZ} pm2 start run-config.json --no-daemon
