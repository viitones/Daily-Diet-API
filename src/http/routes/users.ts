import { randomUUID } from "crypto";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../../database";

export async function userRoutes(app: FastifyInstance) {
  app.post("/create", async (request: FastifyRequest, reply: FastifyReply) => {
    const createUserSchema = z.object({
      username: z.string(),
      password: z.string(),
      email: z.string().email(),
    });

    const { email, password, username } = createUserSchema.parse(request.body);

    await knex("users").insert({
      id: randomUUID(),
      username,
      password,
      email,
    });

    return reply.status(201).send();
  });

  app.get("/", async () => {
    const users = await knex("users").select();

    return { users };
  });

  app.get("/:id", async (request: FastifyRequest) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getUserParamsSchema.parse(request.params);

    const user = await knex("users").where({ id }).first();

    return user;
  });
}
