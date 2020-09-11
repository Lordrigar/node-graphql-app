FROM node:12.0.0-alpine

COPY package.json /usr/src/package.json

COPY package-lock.json /usr/src/package-lock.json

WORKDIR /usr/src

RUN npm ci

COPY . .

RUN npm install pm2 -g

RUN npm run pm2