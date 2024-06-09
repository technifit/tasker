// import type { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';

// import { SessionContext } from './session';

// /**
//  * Middleware that handles the access token.
//  * It retrieves the access token from the request URL's query parameters or from the session.
//  * If the access token is not found, it throws an error.
//  */
// const accessToken = ({ context, next, request }: MiddlewareFunctionArgs) => {
//   const sessionContext = context.get(SessionContext);

//   const accessToken = new URL(request.url).searchParams.get('access_token');
//   const existingToken = sessionContext.get('access_token');

//   if (accessToken) {
//     sessionContext.set('access_token', accessToken);
//   }

//   if (!accessToken && !existingToken) {
//     throw Error('Access token is required');
//   }

//   return next();
// };

// export { accessToken };
