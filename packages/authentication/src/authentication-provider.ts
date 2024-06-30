import { WorkOS } from '@workos-inc/node';

const authentication = new WorkOS(process.env.WORKOS_API_KEY);

export { authentication };
