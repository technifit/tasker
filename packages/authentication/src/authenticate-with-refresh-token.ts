import type { AuthenticateWithRefreshTokenOptions } from '@workos-inc/node';

import { authentication } from './authentication-provider';

const authenticateWithRefreshToken = async ({
  refreshToken,
  ipAddress,
  userAgent,
}: Omit<AuthenticateWithRefreshTokenOptions, 'clientId'>) =>
  authentication.userManagement.authenticateWithRefreshToken({
    clientId: process.env.WORKOS_CLIENT_ID!,
    refreshToken,
    ipAddress,
    userAgent,
  });

export { authenticateWithRefreshToken };
