require("dotenv").config();

const { existsSync: exists, readFileSync: read } = require("fs");
const { resolve } = require("path");
const { isValidCertKeyPair } = require("ssl-validator");
const { cpus } = require("os");

async function createCredentials(cert, key) {
  const isValid = isValidCertKeyPair(cert, key);
  if (!isValid) throw new Error("sorry invalid ssl certifications");
  else
    return {
      key,
      cert
    };
}

/**
 * @typedef {Object} ServerOptions
 * @prop {string|Buffer} [key] ["key.pem"] the name of the key file or its content
 * @prop {string|Buffer} [cert] ["crt.pem"] the name of the cert file or its content
 */

/**
 * check if ssl is required
 * @param {ServerOptions} [options]
 */
async function sslSupport({
  key = "sslcert/key.pem",
  cert = "sslcert/crt.pem"
} = {}) {
  const { SERVER_KEY, SERVER_CERT } = process.env;

  // load variables
  key = SERVER_KEY || key;
  cert = SERVER_CERT || cert;

  // if paths read them
  if (typeof key === "string" && exists(resolve(key))) key = read(key);
  if (typeof cert === "string" && exists(resolve(cert))) cert = read(cert);

  // create valid credentials object
  const SSL_CREDENTIALS = await createCredentials(cert, key);
  const SSL_SUPPORTED = !!SSL_CREDENTIALS;

  return {
    SSL_CREDENTIALS,
    SSL_SUPPORTED
  };
}

module.exports = {
  createCredentials,
  sslSupport,
  PORT: Number(process.env.PORT),
  SSL_PORT: Number(process.env.SSL_PORT),
  CLUSTERS: Number(process.env.CLUSTERS) || cpus().length,
  ENV: process.env.NODE_ENV || "development"
};
