/**
 * Starts the MSW service worker that provides the mock /api/signup endpoint.
 * Production builds swap this file for `enable.prod.ts` (see fileReplacements
 * in angular.json), so msw never enters the production bundle.
 */
export async function enableMocking(): Promise<void> {
  const { worker } = await import('./browser');

  // 'bypass' keeps dev-server/HMR traffic out of the console; /api/signup is
  // the only route this app calls.
  await worker.start({ onUnhandledFrame: 'bypass' });
}
