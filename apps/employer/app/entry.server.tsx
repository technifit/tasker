import { RemixServer } from '@remix-run/react';
import { handleRequest, type EntryContext } from '@vercel/remix';

// import { isPrefetch } from 'remix-utils';

export default function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const remixServer = <RemixServer context={remixContext} url={request.url} />;

  // Set a short cache for prefetch requests to avoid double data requests
  // if (isPrefetch(request)) {
  //   responseHeaders.set('Cache-Control', 'private, max-age=5, smax-age=0');
  // }

  // Set a vary header to avoid caching issues with cookies
  responseHeaders.set('Vary', 'Cookie');
  // Set a noindex header to avoid indexing of the site
  responseHeaders.set('X-Robots-Tag', 'noindex');

  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixServer,
  );
}
