import { Knex, knex as setupKnex } from "knex";

export const dbConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
};

export const knex = setupKnex(dbConfig);
