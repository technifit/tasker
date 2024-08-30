import type { CreateMagicAuthOptions } from '@workos-inc/node';

import { authentication } from './authentication-provider.server';

const createMagicAuth = async ({ email, invitationToken }: CreateMagicAuthOptions) =>
  authentication.userManagement.createMagicAuth({ email, invitationToken });

export { createMagicAuth };
