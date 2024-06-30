import type { CreateUserOptions } from '@workos-inc/node';

import { authentication } from './authentication-provider';

const createUser = ({
  email,
  emailVerified,
  firstName,
  lastName,
  password,
  passwordHash,
  passwordHashType,
}: CreateUserOptions) =>
  authentication.userManagement.createUser({
    email,
    emailVerified,
    firstName,
    lastName,
    password,
    passwordHash,
    passwordHashType,
  });

export { createUser };
