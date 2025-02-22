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
FROM deps AS nuxtjs

WORKDIR /app
COPY package*.json .
RUN npm install --legacy-peer-deps

#############################################################################################
FROM nuxtjs AS prod

WORKDIR /app
COPY . /app
VOLUME /app
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
RUN export TZ=${TZ}

CMD ["npm", "run", "devv"]

#############################################################################################
FROM prod