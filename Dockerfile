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
EXPOSE 443
# ENTRYPOINT [ "./bin/live-torrent-server.js" ]
CMD ["node", "./bin/live-torrent-server.js --port 8080 --full-core-clusters --key sslcert/server.key --cert sslcert/server.crt"]
