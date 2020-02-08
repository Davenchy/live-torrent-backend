FROM node:12

LABEL maintainer "Davenchy <firon1222@gmail.com>"
LABEL description "Build Live-Torrent-Backend server image"

WORKDIR /usr/src/app

ENV PORT 8080
ENV OSUA TemporaryUserAgent

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
