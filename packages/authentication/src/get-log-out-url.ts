import { authentication } from './authentication-provider';

const getLogOutUrl = ({ sessionId }: { sessionId: string }) =>
  authentication.userManagement.getLogoutUrl({ sessionId });

export { getLogOutUrl };
