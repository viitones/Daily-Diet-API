import { error } from "console";
import { randomUUID } from "crypto";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../../database";
import { checkSessionId } from "../../middlewares/checkSessionId";

export async function mealRoute(app: FastifyInstance) {
  app.addHook(
    "preHandler",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await checkSessionId(request, reply);
    },
  );

  app.get("/", async () => {
    const meals = await knex("meals").select();

    return { meals };
  });

  app.get("/:id", async (request: FastifyRequest) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealParamsSchema.parse(request.params);

    const meal = await knex("meals").where({ id }).first();

    if (!meal) {
      error("🥝⚠️ Meal not found ⚠️🥝");
    }

    return { meal };
  });

  app.get("/metrics", async (request: FastifyRequest, reply: FastifyReply) => {
    const totalMealsMetrics = await knex("meals")
      .where({
        user_id: request.user?.id,
      })
      .orderBy("date", "desc");

    const mealsOnDietMetrics = await knex("meals")
      .where({
        user_id: request.user?.id,
        is_on_diet: true,
      })
      .count("id", { as: "total" })
      .first();

    const mealsOffDietMetrics = await knex("meals")
      .where({
        user_id: request.user?.id,
        is_on_diet: false,
      })
      .count("id", { as: "total" })
      .first();

    const { bestSequence } = totalMealsMetrics.reduce(
      (acc, meal) => {
        if (meal.is_on_diet) {
          acc.currentSequence += 1;
        } else {
          acc.currentSequence = 0;
        }

        if (acc.currentSequence > acc.bestSequence) {
          acc.bestSequence = acc.currentSequence;
        }

        return acc;
      },
      {
        bestSequence: 0,
        currentSequence: 0,
      },
    );

    return reply.status(200).send({
      totalMealsMetrics: totalMealsMetrics.length,
      mealsOnDietMetrics: mealsOnDietMetrics?.total,
      mealsOffDietMetrics: mealsOffDietMetrics?.total,
      bestSequence,
    });
  });

  app.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = updateMealParamsSchema.parse(request.params);
    const meal = await knex("meals").where({ id }).first();
    if (!meal) {
      return reply.status(404).send({
        message: "🥝⚠️ Meal not found ⚠️🥝",
      });
    }

    const updateMealBodySchema = z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date().default(meal.date),
      isOnDiet: z.boolean(),
    });

    const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
      request.body,
    );

    await knex("meals").where({ id }).update({
      name,
      description,
      date: date.getTime(),
      is_on_diet: isOnDiet,
    });

    return reply.status(200).send({
      message: "🥝 Meal updated successfully",
    });
  });

  app.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = deleteMealParamsSchema.parse(request.params);

    const meal = await knex("meals").where({ id }).first();

    if (!meal) {
      return reply.status(404).send({
        message: "🥝⚠️ Meal not found ⚠️🥝",
      });
    }

    await knex("meals").where("id", meal.id).delete();

    return reply.status(200).send({
      message: "🥝 Meal deleted successfully",
    });
  });

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
      user_id: request.user?.id,
    });

    return reply.status(201).send({
      message: "🥝 Meal created successfully",
    });
  });
}
