FROM node:carbon

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app
COPY .npmrc /usr/app
COPY package-lock.json /usr/app
RUN npm install

COPY server/app.js .

EXPOSE 9000

CMD [ "node", "app.js" ]
