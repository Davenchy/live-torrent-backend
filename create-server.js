const express = require("express");
const http = require("http");
const https = require("https");
const { existsSync: exists, readFileSync: read } = require("fs");
const { resolve } = require("path");

const app = express();

const sslCertPath = resolve("sslcert");
const keyPath = resolve(sslCertPath, "server.key");
const certPath = resolve(sslCertPath, "server.crt");

const { SERVER_KEY, SERVER_CERT } = process.env;

const SSLFiles = exists(sslCertPath) && exists(keyPath) && exists(certPath);
const SSLENV = SERVER_KEY && SERVER_CERT;
const isSSLSupported = SSLFiles || SSLENV;

let SSLCredentials = undefined;
if (isSSLSupported)
  SSLCredentials = {
    key: SSLFiles ? read(keyPath) : SERVER_KEY,
    cert: SSLFiles ? read(certPath) : SERVER_CERT
  };

const httpServer = http.createServer(app);
const httpsServer = isSSLSupported
  ? https.createServer(SSLCredentials, app)
  : undefined;

module.exports = {
  app,
  httpServer,
  httpsServer,
  isSSLSupported,
  SSLFiles,
  SSLENV
};
