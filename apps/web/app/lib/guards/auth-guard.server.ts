import { getAuth } from '@clerk/remix/ssr.server';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { $path } from 'remix-routes';

export const requireAuthenticatedUser = async (args: LoaderFunctionArgs) => {
  const auth = await getAuth(args);

  if (!auth.userId) {
    throw redirect($path('/log-in'));
  }

  return auth;
};

export const requireAuthenticatedOrgUser = async (args: LoaderFunctionArgs) => {
  const auth = await getAuth(args);

  if (!auth.userId) {
    throw redirect($path('/log-in'));
  }

  if (!auth.orgId) {
    throw redirect($path('/create-organisation'));
  }

  return auth;
};

export const requireUnauthenticatedUser = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (userId) {
    throw redirect($path('/'));
  }
};
