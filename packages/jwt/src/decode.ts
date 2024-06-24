import { Effect } from 'effect';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';

/**
 * Decodes a JWT token and returns the decoded payload.
 *
 * @param token - The JWT token to decode.
 * @returns An `Effect` that resolves to the decoded payload if successful, or an error if the token is invalid.
 */
const decodeJwt = (token: string) =>
  Effect.try({
    try: () => jwtDecode<JwtPayload>(token), // try to decode the token
    catch: () => new Error('Failed to decode JWT'), // catch any errors
  });

export { decodeJwt };
