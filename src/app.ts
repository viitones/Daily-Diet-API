import { fastifyCookie } from "@fastify/cookie";
import fastify from "fastify";
import { mealRoute } from "./http/routes/meals";
import { userRoutes } from "./http/routes/users";

export const app = fastify();

app.register(fastifyCookie);
app.register(mealRoute, {
  prefix: "meals",
});
app.register(userRoutes, {
  prefix: "users",
});
