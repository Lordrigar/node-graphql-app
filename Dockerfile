FROM node:12.0.0-alpine

WORKDIR /usr/src

COPY package.json ./

COPY package-lock.json ./

RUN npm ci

RUN npm i pm2 -g

COPY . .

EXPOSE 3000

CMD ["pm2", "app/index.js"]