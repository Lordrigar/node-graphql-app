FROM node:24-alpine

WORKDIR /usr/src

COPY package.json ./

COPY package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "app/index.js"]
