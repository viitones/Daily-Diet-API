import { app } from "./app";
import { knex } from "./database";

app.get("/", async () => {
  const test = await knex("sqlite_schema").select("*");

  return test;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("🚀 HTTP server running on http://localhost:3333");
  });
