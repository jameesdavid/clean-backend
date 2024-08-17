import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const ormConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === "development" ? true : false,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

export default ormConfig;
