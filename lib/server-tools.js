const http = require("http");
const https = require("https");
const { isValidCertKeyPair } = require("ssl-validator");

async function validateCertifications({ cert, key }) {
  const isValid = isValidCertKeyPair(cert, key);
  if (!isValid) throw new Error("sorry invalid ssl certificates");
}

async function createServer(app, sslCertificates) {
  if (sslCertificates) validateCertifications(sslCertificates);

  const httpServer = http.createServer(app);
  const httpsServer = sslCertificates
    ? https.createServer(sslCertificates, app)
    : undefined;

  return { httpServer, httpsServer };
}

async function runServer({
  app = undefined,
  port = 3000,
  sslPort = 443,
  certificates = undefined,
  onHTTP = () => {},
  onHTTPS = () => {}
} = {}) {
  const { httpServer, httpsServer } = await createServer(app, certificates);
  httpServer.listen(port, onHTTP);
  if (httpsServer) httpsServer.listen(sslPort, onHTTPS);
  return { httpServer, httpsServer };
}

module.exports = {
  createServer,
  runServer,
  validateCertifications
};
