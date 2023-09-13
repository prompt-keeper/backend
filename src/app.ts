import bearer from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { NullBodyError, UnauthorizedError } from "./errors/null_body_error";
import api_key from "./routes/api_key";

const app = new Elysia();

app
  .use(cors({ origin: /\*.nguyentd.com$/ }))
  .use(bearer())
  .use(swagger())
  .addError({
    NULL_BODY: NullBodyError,
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      // With auto-completion
      case "INTERNAL_SERVER_ERROR":
        // With type narrowing
        // Error is typed as CustomError
        return { error: error.message };
      case "VALIDATION":
        // Error is typed as ValidationError
        return { error: error.message };
      case "NULL_BODY":
        set.status = 400;
        return {
          error: error.message,
        };
      case "UNAUTHORIZED":
        set.status = 401;
        return {
          error: error.message,
        };
      default:
        // Error is typed as unknown
        return {
          code: code,
          error: error.message,
        };
    }
  })
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
