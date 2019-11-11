import { Sequelize } from 'sequelize-typescript';
import { books } from '../books/books.entity';
import { users, user_roles, roles } from '../users/users.entity';
import env from '../config/config'
 
export const databaseProviders = [

  {
    provide: 'SEQUELIZE',

    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',   
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        define: {
          timestamps: false
        }
      });

      sequelize.addModels([books, users, user_roles, roles]);
      await sequelize.sync();
      return sequelize;
    },
  }
]; 