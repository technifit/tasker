import { authentication } from './authentication-provider';

const getJWKSURL = () => authentication.userManagement.getJwksUrl(process.env.WORKOS_CLIENT_ID!);

export { getJWKSURL };
