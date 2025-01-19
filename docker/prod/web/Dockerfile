FROM node:18-alpine3.18 AS base

RUN npm install -g npm@10.3.0

#############################################################################################
FROM base AS deps

ARG TZ='Europe/Istanbul'
ENV TZ ${TZ}
RUN apk upgrade --update \
    && apk add -U tzdata \
    && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo "${TZ}" > /etc/timezone \
    && apk del tzdata \
    && rm -rf \
    /var/cache/apk/*

#############################################################################################
FROM deps AS vitedeps

WORKDIR /app

COPY ./package*.json /app/

RUN npm install

#############################################################################################
FROM vitedeps AS vite

WORKDIR /app

COPY . /app/
#COPY ./docker/prod/web/env/.env /app/.env
RUN npm run build

#############################################################################################
FROM vite AS prod

WORKDIR /app
VOLUME /app

EXPOSE 4173

ENV HOST=0.0.0.0
ENV PORT=4173

RUN export TZ=${TZ}

CMD ["npm", "run", "preview"]

#############################################################################################
FROM prod