FROM node:14-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN apk add --no-cache tzdata

RUN npm install glob rimraf

RUN npm install --global node-gyp

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
