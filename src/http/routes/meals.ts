import { randomUUID } from "crypto";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../../database";

export async function mealRoute(app: FastifyInstance) {
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const createMealSchema = z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date(),
      isOnDiet: z.boolean(),
    });

    const { name, description, isOnDiet, date } = createMealSchema.parse(
      request.body,
    );

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      date: date.getTime(),
      is_on_diet: isOnDiet,
    });

    return reply.status(201).send({
      message: "🥝 Meal created successfully",
    });
  });
}
