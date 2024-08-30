import { authentication } from './authentication-provider.server';

const getJWKSURL = () => authentication.userManagement.getJwksUrl(process.env.WORKOS_CLIENT_ID!);

export { getJWKSURL };
