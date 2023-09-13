import app from "./app";

// TODO: use env variable
app.listen({
  port: 3000,
  hostname: "0.0.0.0",
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
