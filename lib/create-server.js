const http = require("http");
const https = require("https");

module.exports = async function createServer(app, sslCredentials) {
  const httpServer = http.createServer(app);
  const httpsServer = sslCredentials
    ? https.createServer(sslCredentials, app)
    : undefined;
  return { httpServer, httpsServer };
};
