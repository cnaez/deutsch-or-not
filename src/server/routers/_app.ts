import { router } from "../trpc";
import { aRouter } from "./employeeRouter";

// Combine your individual routers into the main application router
export const appRouter = router({
  main: aRouter,
  // Add other routers here as your app grows
});

export type AppRouter = typeof appRouter;
