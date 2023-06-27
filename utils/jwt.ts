import jwksClient from "jwks-rsa";
import { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import certDev from "../configs/sso-certs/dev.json";
import certBeta from "../configs/sso-certs/beta.json";
import jwtToPem from "jwk-to-pem";

const createJwksClient = (certs: string) => {
  return jwksClient({
    jwksUri: certs,
  });
};

const decodeTokenWithJwks = async (
  accessToken: string,
  getKey: (header: any, callback: any) => Promise<void>
) => {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, getKey, (err, decoded) => {
      return err ? reject(err) : resolve(decoded);
    });
  });
};

export const verifyToken = (payload: string, secretOrPrivateKey: string) => {
  const verify = jwt.verify(payload, secretOrPrivateKey);
  return verify;
};

export const verifyTokenWithJwks = async (payload: string, certs: string) => {
  const jwks = createJwksClient(certs);
  const getKey = async (header: any, callback: any) => {
    jwks.getSigningKey(header.kid, async (err, key: any) => {
      const signingKey = key?.publicKey || key?.rsaPublicKey;
      await callback(null, signingKey);
    });
  };
  const verify = await decodeTokenWithJwks(payload, getKey);
  return verify;
};

export const decodeToken = (payload: string) => {
  return jwt.decode(payload);
};

export const generateToken = (
  payload: string | object | Buffer,
  secretOrPrivateKey: string,
  options: SignOptions
) => {
  const token = jwt.sign(payload, secretOrPrivateKey, {
    algorithm: "HS256",
    ...options,
  });
  return token;
};

export const verifyTokenWithJson = async (jwtToken: string) => {
  let jwk = certDev;

  // const environment = process.env.ENVIRONMENT || "";
  const environment = "beta" || "dev";

  switch (environment) {
    case "dev": {
      jwk = certDev;
      break;
    }
    case "beta": {
      jwk = certBeta;
      break;
    }
    default: {
      jwk = certDev;
      break;
    }
  }

  const decodedToken = jwt.decode(jwtToken, { complete: true });
  if (!decodedToken) {
    throw new Error("Invalid token.");
  }

  const { header } = decodedToken;

  const matchingJwk = jwk.keys.find(
    (key) => key.kid === header.kid
  ) as jwtToPem.JWK;

  if (!matchingJwk) {
    throw new Error("No matching JWK found.");
  }

  const publicKey = jwtToPem(matchingJwk);

  const verifiedToken = await verifyTokenJson(jwtToken, publicKey, {
    algorithms: [header.alg],
  });

  return verifiedToken;
};

const verifyTokenJson = (accessToken: string, payload: any, options = {}) => {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, payload, options, (err: any, decoded: any) => {
      return err ? reject(err) : resolve(decoded);
    });
  });
};
