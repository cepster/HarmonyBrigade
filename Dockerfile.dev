FROM node:carbon AS builder

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app
COPY .npmrc /usr/app
COPY package-lock.json /usr/app
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /usr/app/dist/roster-demo /usr/share/nginx/html
COPY --from=builder /usr/app/nginx.conf /etc/nginx/conf.d/default.conf
