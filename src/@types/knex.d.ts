declare module "knex/types/tables" {
  interface tables {
    users: {
      id: string;
      username: string;
      password: string;
      email: string;
      session_id?: string;
    };
  }
}
