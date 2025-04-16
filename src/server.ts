import { app } from "./app";
import { knex } from "./database";

app.post("/users", async () => {
  const users = await knex("users").select("*");

  return users;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("🚀 HTTP server running on http://localhost:3333");
  });
