import { fastifyCookie } from "@fastify/cookie";
import fastify from "fastify";
import { userRoutes } from "./http/routes/users";

export const app = fastify();

app.register(fastifyCookie);
app.register(userRoutes, {
  prefix: "users",
});
