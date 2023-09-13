import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

const app = new Elysia();

app.use(swagger());

app.get("/", () => "Hello Elysia").listen(3000);

app.post("/sign-in", ({ body }) => body, {
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
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
