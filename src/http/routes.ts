import { randomUUID } from "crypto";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", async (request: FastifyRequest, reply) => {
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
}
