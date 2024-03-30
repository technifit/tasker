import { useEffect } from 'react';

import { emitInternalEvent } from '@technifit/events';
import { useElementSize } from '@technifit/hooks';

const useReportSizeChangeToParent = <T extends HTMLElement = HTMLDivElement>() => {
  const [ref, size] = useElementSize<T>();

  useEffect(() => {
    emitInternalEvent({
      type: 'embed:dimensions-change',
      payload: {
        width: size.width,
        height: size.height,
      },
    });
  }, [size]);

  return { ref };
};

export { useReportSizeChangeToParent };
