import { authentication } from './authentication-provider';

const getUser = (userId: string) => authentication.userManagement.getUser(userId);

export { getUser };
