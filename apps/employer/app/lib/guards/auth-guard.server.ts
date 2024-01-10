import { getAuth } from '@clerk/remix/ssr.server';
import type { DataFunctionArgs } from '@vercel/remix';
import { redirect } from '@vercel/remix';
import { $path } from 'remix-routes';

export const requireAuthenticatedUser = async (args: DataFunctionArgs) => {
  const auth = await getAuth(args);

  if (!auth.userId) {
    throw redirect($path('/log-in'));
  }
};

export const requireUnauthenticatedUser = async (args: DataFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (userId) {
    throw redirect($path('/'));
  }
};
