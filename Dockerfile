FROM node:12

LABEL maintainer "Davenchy <firon1222@gmail.com>"
LABEL description "Build Live-Torrent-Backend server image"

RUN mkdir /app
WORKDIR /app

ENV PORT 8080
ENV OSUA TemporaryUserAgent

COPY package*.json ./
COPY . ./
RUN npm install

EXPOSE 8080
EXPOSE 443
ENTRYPOINT [ "./bin/live-torrent-server.js" ]
CMD ["--port 8080", " --full-core-clusters"]
