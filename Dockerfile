FROM node:12

LABEL maintainer "Davenchy <firon1222@gmail.com>"
LABEL description "Build Live-Torrent-Backend server image"

WORKDIR /usr/src/app

COPY package*.json ./

ENV PORT 8080
ENV OSUA TemporaryUserAgent

ENV NODE_ENV production
RUN npm install
RUN npm ci --only=production

COPY . ./

EXPOSE 8080
CMD ["npm", "start"]
