import * as React from 'react';

/**
 * Returns a ref object that always holds the latest value of the provided input.
 * @template T The type of the input value.
 * @param {T} current The current value.
 * @returns {React.MutableRefObject<T>} The ref object holding the latest value.
 */
const useLatest = <T>(current: T) => {
  const storedValue = React.useRef(current);

  React.useEffect(() => {
    storedValue.current = current;
  });

  return storedValue;
};

export { useLatest };
