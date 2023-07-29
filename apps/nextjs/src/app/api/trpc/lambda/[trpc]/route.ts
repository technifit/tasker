import type { NextRequest } from "next/server";
import { createTRPCContext } from "@technifit/api";
import { lambdaRouter } from "@technifit/api/src/lambda";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// Stripe is incompatible with Edge runtimes due to using Node.js events
// export const runtime = "edge";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc/lambda",
    router: lambdaRouter,
    req: req,
    createContext: () => createTRPCContext({ req }),
    onError: ({ error }) => {
      console.log("Error in tRPC handler (lambda)");
      console.error(error);
    },
  });

export { handler as GET, handler as POST };
