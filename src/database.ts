import { Knex, knex as setupKnex } from "knex";
import { env } from "./env";

export const dbConfig: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(dbConfig);
