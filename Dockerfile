FROM node:16-alpine

RUN apk add --update --no-cache python3 make g++ py3-pip biber texlive-full

WORKDIR /usr/src/resumer-server

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD [ "node", "index.js" ]