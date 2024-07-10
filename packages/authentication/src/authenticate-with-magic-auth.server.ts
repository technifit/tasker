import type { AuthenticateWithMagicAuthOptions } from '@workos-inc/node';

import { authentication } from './authentication-provider.server';

const authenticateWithMagicAuth = ({
  code,
  email,
  invitationToken,
  ipAddress,
  userAgent,
}: Omit<AuthenticateWithMagicAuthOptions, 'clientId'>) =>
  authentication.userManagement.authenticateWithMagicAuth({
    clientId: process.env.WORKOS_CLIENT_ID!,
    code,
    email,
    invitationToken,
    ipAddress,
    userAgent,
  });

export { authenticateWithMagicAuth };
