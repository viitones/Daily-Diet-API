import cookie from "@fastify/cookie";
import fastify from "fastify";
import { userRoutes } from "./http/routes/users";

export const app = fastify();

app.register(cookie);
app.register(userRoutes, {
  prefix: "users",
});
