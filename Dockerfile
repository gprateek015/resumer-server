FROM node:20-alpine

RUN apk add --update --no-cache python3 make g++ py3-pip biber texlive-full

WORKDIR /server

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn global add pm2

COPY . .

CMD [ "pm2-runtime",  "start", "index.js" ]