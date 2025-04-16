import { app } from "./app";
import { env } from "./env";
import { userRoutes } from "./http/routes/users";

app.register(userRoutes, {
  prefix: "users",
});

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("🚀 HTTP server running on http://localhost:3333");
  });
