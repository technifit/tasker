import { decodeJwt } from 'jose';
import type { JWTPayload } from 'jose';

const decodeAccessToken = ({ accessToken }: { accessToken: string }) =>
  decodeJwt<
    JWTPayload & {
      org_id: string | null;
      sid: string;
      role: string;
    }
  >(accessToken);

export { decodeAccessToken };
