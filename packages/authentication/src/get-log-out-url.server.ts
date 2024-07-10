import { authentication } from './authentication-provider.server';

const getLogOutUrl = ({ sessionId }: { sessionId: string }) =>
  authentication.userManagement.getLogoutUrl({ sessionId });

export { getLogOutUrl };
