import { randomUUID } from "crypto";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../../database";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const createUserSchema = z.object({
      username: z.string(),
      email: z.string().email(),
    });

    const { email, username } = createUserSchema.parse(request.body);

    const userByEmail = await knex("users").where("email", email).first();

    if (userByEmail) {
      return reply.status(409).send({
        message: "⚠️ User already exists",
      });
    }

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("users").insert({
      id: randomUUID(),
      username,
      email,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
