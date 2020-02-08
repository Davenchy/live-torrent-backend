FROM node:12-alpine

LABEL maintainer "Davenchy <firon1222@gmail.com>"
LABEL description "Build Live-Torrent-Backend server image"

WORKDIR /usr/src/app

COPY package*.json ./

ENV PORT 8080
ENV OSUA TemporaryUserAgent

RUN npm install

COPY . ./
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
