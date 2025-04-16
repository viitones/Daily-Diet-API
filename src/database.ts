import { Knex, knex as setupKnex } from "knex";
import { env } from "./env";

export const dbConfig: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
};

export const knex = setupKnex(dbConfig);
