import { authentication } from './authentication-provider.server';

const getUser = (userId: string) => authentication.userManagement.getUser(userId);

export { getUser };
