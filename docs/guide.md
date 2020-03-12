# Guide

How to use Live Torrent Backend

- Table of Contents
  [[toc]]

## Environment Variables

| Var  | Default            | Desc                         |
| ---- | ------------------ | ---------------------------- |
| PORT | 3000               | server listening port        |
| OSUA | TemporaryUserAgent | Opensubtitles.org User Agent |

for more information about the OpenSubtitles.org api user agent from [here](https://trac.opensubtitles.org/projects/opensubtitles/wiki/DevReadFirst)

> Note: you can use .env file to setup vars

## CLI

- install the live torrent server as a global package

`npm install -g live-torrent-backend`

- for the help message

`live-torrent --help`

- how to run

`live-torrent [--port 8080] [--clusters 1] [--full-core-clusters false]`

> Note: to terminate clusters kill the main process

## Docker

Docker repo: `davenchy/live-torrent-backend`

Container's exported port `3000`

- To Run

`docker run --name live-torrent-backend -p 3000:3000 -e "OSUA=<opensubtitles user agent>" davenchy/live-torrent-backend`
