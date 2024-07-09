import { customAlphabet } from 'nanoid';

/**
 * Generates a unique ID using customAlphabet.
 * @returns {string} The generated unique ID.
 */
export const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');

const prefixes = {
  session: 'ses',
} as const;

/**
 * Generates a new ID by combining a prefix with a random string.
 * @param prefix - The prefix to be added to the ID.
 * @returns The generated ID.
 */
const newId = (prefix: keyof typeof prefixes): string => {
  return [prefixes[prefix], nanoid(16)].join('_');
};

export { newId };
