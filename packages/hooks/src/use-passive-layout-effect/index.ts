import { useEffect, useLayoutEffect } from 'react';

/**
 * A custom hook that conditionally uses `useLayoutEffect` or `useEffect` based on the environment.
 * If the code is running in a browser environment (i.e., `window` object is defined), it uses `useLayoutEffect`.
 * Otherwise, it uses `useEffect`.
 */
const usePassiveLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export { usePassiveLayoutEffect };
