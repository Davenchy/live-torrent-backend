FROM node:18-alpine

LABEL maintainer "Davenchy <firon1222@gmail.com>"
LABEL description "Live-Torrent-Backend server image"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
