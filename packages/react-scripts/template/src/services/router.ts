import AppRouter from 'components/router';

let globalRouter: AppRouter;

export function setupGlobalRouter(router: AppRouter): void {
  globalRouter = router;
}

export function getGlobalRouter(): AppRouter {
  return globalRouter;
}