import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import api_key from "./routes/api_key";

const app = new Elysia();

class NullBodyError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

app
  .use(swagger())
  .addError({
    NULL_BODY: NullBodyError,
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
