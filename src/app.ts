import bearer from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import {
  NullBodyError,
  UnauthorizedError,
  PrismaError,
  InvalidPayloadError,
  error_handler,
} from "./errors";
import api_key from "./routes/api_keys";

const app = new Elysia();

app
  .use(cors({ origin: /\*.nguyentd.com$/ }))
  .use(bearer())
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Prompt Keeper API Documentation",
          version: "1.0.0",
        },
      },
    }),
  )
  .addError({
    NULL_BODY: NullBodyError,
    UNAUTHORIZED: UnauthorizedError,
    PRISMA: PrismaError,
    INVALID_PAYLOAD: InvalidPayloadError,
  })
  .onError(error_handler)
  .onParse(({ request }, contentType) => {
    if (
      contentType === "application/json" &&
      request.method == "POST" &&
      request.body === null
    ) {
      throw new NullBodyError("Request body is required");
    }
  })
  .get("/", () => "Hello Elysia")

  .post("/sign-in", ({ body }) => body, {
    body: t.Object(
      {
        username: t.String(),
        password: t.String(),
      },
      {
        description: "Expected an username and password",
      },
    ),
    detail: {
      summary: "Sign in the user",
      tags: ["authentication"],
    },
  })

  .use(api_key);

export default app;
