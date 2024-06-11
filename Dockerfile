FROM node:18-slim

LABEL maintainer "Davenchy <firon1222@gmail.com>"
LABEL description "Live-Torrent-Backend server image"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

RUN mkdir /downloads

EXPOSE 3000

VOLUME /app/downloads

ENTRYPOINT ["npm", "start"]
