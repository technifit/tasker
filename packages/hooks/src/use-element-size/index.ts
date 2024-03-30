// useElementSize.ts
import type { MutableRefObject } from 'react';
import { useRef, useState } from 'react';

import { usePassiveLayoutEffect } from '../use-passive-layout-effect';
import { useResizeObserver } from '../use-resize-observer';

interface Size {
  width: number;
  height: number;
}

/**
 * Custom hook that returns a mutable ref object and the size of an element.
 *
 * @template T - The type of the element (default: HTMLDivElement)
 * @returns An array containing a mutable ref object and the size of the element.
 */
const useElementSize = <T extends HTMLElement = HTMLDivElement>(): [MutableRefObject<T | null>, Size] => {
  const target = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const setRoundedSize = ({ width, height }: Size) => {
    setSize({ width: Math.round(width), height: Math.round(height) });
  };

  usePassiveLayoutEffect(() => {
    target.current && setRoundedSize(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => {
    const sizes = entry.contentBoxSize[0];

    if (sizes) {
      const { inlineSize: width, blockSize: height } = sizes;
      setRoundedSize({ width, height });
    }
  });

  return [target, size];
};

export { useElementSize };
