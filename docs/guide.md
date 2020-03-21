# Guide

How to use Live Torrent Backend

- Table of Contents
  [[toc]]

## Environment Variables

| Var         | Default            | Desc                             |
| ----------- | ------------------ | -------------------------------- |
| PORT        | 3000               | http server port                 |
| SSL_PORT    | 443                | ssl server port                  |
| SERVER_KEY  |                    | your ssl private key or its path |
| SERVER_CERT |                    | your ssl certificate or its path |
| OSUA        | TemporaryUserAgent | Opensubtitles.org User Agent     |

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

- To Build

`docker build -t <image name> .`

Don't forget to replace `davenchy/live-torrent-backend` by your **image name** in the next examples.

- To Run

`docker run --name live-torrent-backend -p 80:8080 -e "OSUA=<opensubtitles user agent>" davenchy/live-torrent-backend`

- To run with SSL protocol support

lets say that `/host/path/to/sslcert` is the path to your certification files

`docker run --name live-torrent-backend -p 443:443 -p 80:8080 -e "OSUA=<opensubtitles user agent>" -v /host/path/to/sslcert:/usr/src/app/sslcert davenchy/live-torrent-backend`

## SSL Protocol

To support The SSL Protocol

Create new directory and call it `sslcert` then generate your credentials in it.

name the private key file by `server.key`

name the certificate file by `servert.crt`

**OR** use env vars

set the env vars as [here](environment-variables) to files content or files path
