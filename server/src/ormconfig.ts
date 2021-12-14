import { ConnectionOptions } from "typeorm";

const ormConfig: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "zx1328526673",
  database: "lireddit",
  synchronize: true,
  logging: true,
  migrationsTableName: "typeorm_migration_table",
  migrations: ["dist/migrations/*.js"],
  entities: ["dist/entities/*.js"],
  cli: {
    migrationsDir: "src/migrations",
    entitiesDir: 'src/entities'
  }
}

export default ormConfig;