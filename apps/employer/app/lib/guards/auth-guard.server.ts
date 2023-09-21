import { getAuth } from '@clerk/remix/ssr.server';
import type { DataFunctionArgs } from '@vercel/remix';
import { redirect } from '@vercel/remix';

export const requireAuthenticatedUser = async (args: DataFunctionArgs) => {
  const auth = await getAuth(args);

  if (!auth.userId) {
    throw redirect('/log-in');
  }
};

export const requireUnauthenticatedUser = async (args: DataFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (userId) {
    throw redirect('/');
  }
};
