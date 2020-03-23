const express = require("express");
const http = require("http");
const https = require("https");
const { existsSync: exists, readFileSync: read } = require("fs");
const { resolve } = require("path");

// env vars
require("dotenv").config();

const app = express();

const sslCertPath = resolve("sslcert");
const keyPath = resolve(sslCertPath, "server.key");
const certPath = resolve(sslCertPath, "server.crt");

const { SERVER_KEY, SERVER_CERT } = process.env;

const SSLFiles = exists(sslCertPath) && exists(keyPath) && exists(certPath);
const SSLENV = SERVER_KEY && SERVER_CERT;
const SSLENVFiles = exists(SERVER_KEY) && exists(SERVER_CERT);
const isSSLSupported = SSLFiles || SSLENV || SSLENVFiles;

let SSLCredentials = undefined;
if (isSSLSupported)
  if (SSLFiles)
    SSLCredentials = {
      key: read(keyPath),
      cert: read(certPath)
    };
  else if (SSLENVFiles)
    SSLCredentials = {
      key: read(SERVER_KEY),
      cert: read(SERVER_CERT)
    };
  else if (SSLENV)
    SSLCredentials = {
      key: SERVER_KEY,
      cert: SERVER_CERT
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
  SSLENV,
  SSLCredentials,
  PORT: process.env.PORT || 3000,
  SSL_PORT: process.env.SSL_PORT || 443,
  ENV: process.env.NODE_ENV || "development"
};
