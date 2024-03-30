import type * as React from 'react';
import type { ResizeObserverEntry } from '@juggle/resize-observer';
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';

import { useLatest } from '../use-latest';
import { usePassiveLayoutEffect } from '../use-passive-layout-effect';

const ResizeObserver = typeof window !== 'undefined' && 'ResizeObserver' in window ? window.ResizeObserver : Polyfill;

/**
 * A React hook that fires a callback whenever ResizeObserver detects a change to its size
 *
 * @param target A React ref created by `useRef()` or an HTML element
 * @param callback Invoked with a single `ResizeObserverEntry` any time
 *   the `target` resizes
 */
const useResizeObserver = <T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  callback: UseResizeObserverCallback,
): Polyfill => {
  const resizeObserver = getResizeObserver();
  const storedCallback = useLatest(callback);

  usePassiveLayoutEffect(() => {
    let didUnsubscribe = false;
    const targetEl = target && 'current' in target ? target.current : target;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!targetEl) return () => {};

    const callback = (entry: ResizeObserverEntry, observer: Polyfill): void => {
      if (didUnsubscribe) return;
      storedCallback.current(entry, observer);
    };

    resizeObserver.subscribe(targetEl as HTMLElement, callback);

    return () => {
      didUnsubscribe = true;
      resizeObserver.unsubscribe(targetEl as HTMLElement, callback);
    };
  }, [target, resizeObserver, storedCallback]);

  return resizeObserver.observer;
};

/**
 * Creates a resize observer that allows subscribing and unsubscribing to resize events on DOM elements.
 * @returns An object with methods for subscribing and unsubscribing to resize events.
 */
const createResizeObserver = () => {
  let ticking = false;
  let allEntries: ResizeObserverEntry[] = [];

  const callbacks = new Map<unknown, UseResizeObserverCallback[]>();

  const observer = new ResizeObserver((entries: ResizeObserverEntry[], obs: Polyfill) => {
    allEntries = allEntries.concat(entries);

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const triggered = new Set<Element>();
        for (const entry of allEntries) {
          if (entry.target && triggered.has(entry.target)) continue;
          if (entry.target) triggered.add(entry.target);
          const targetedCallbacks = callbacks.get(entry.target);
          targetedCallbacks?.forEach((callback) => callback(entry, obs));
        }
        allEntries = [];
        ticking = false;
      });
    }
    ticking = true;
  });

  return {
    observer,
    subscribe(target: HTMLElement, callback: UseResizeObserverCallback) {
      observer.observe(target);
      const cbs = callbacks.get(target) ?? [];
      cbs.push(callback);
      callbacks.set(target, cbs);
    },
    unsubscribe(target: HTMLElement, callback: UseResizeObserverCallback) {
      const cbs = callbacks.get(target) ?? [];
      if (cbs.length === 1) {
        observer.unobserve(target);
        callbacks.delete(target);
        return;
      }
      const cbIndex = cbs.indexOf(callback);
      if (cbIndex !== -1) cbs.splice(cbIndex, 1);
      callbacks.set(target, cbs);
    },
  };
};

let _resizeObserver: ReturnType<typeof createResizeObserver>;

/**
 * Returns the resize observer instance.
 * If the instance doesn't exist, it creates a new one using createResizeObserver.
 * @returns The resize observer instance.
 */
const getResizeObserver = () => (!_resizeObserver ? (_resizeObserver = createResizeObserver()) : _resizeObserver);

type UseResizeObserverCallback = (entry: ResizeObserverEntry, observer: Polyfill) => unknown;

export type { UseResizeObserverCallback };

export { useResizeObserver };
