import { createRemoteJWKSet, jwtVerify } from 'jose';

/**
 * Creates a remote JSON Web Key Set (JWKS) from the provided JWKS URL.
 *
 * @param jkwsUrl - The URL of the JWKS.
 * @returns A remote JWKS instance.
 */
const JWKS = (jkwsUrl: URL) => createRemoteJWKSet(jkwsUrl);

/**
 * Verifies the access token using the provided JWKS URL.
 * @param accessToken - The access token to be verified.
 * @param jkwsUrl - The URL of the JWKS (JSON Web Key Set) endpoint.
 * @returns A boolean indicating whether the access token is valid or not.
 */
const verifyAccessToken = async ({ accessToken, jkwsUrl }: { accessToken: string; jkwsUrl: URL }) => {
  try {
    await jwtVerify(accessToken, JWKS(jkwsUrl));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export { verifyAccessToken };
