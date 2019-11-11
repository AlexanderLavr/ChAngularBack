import { Module } from '@nestjs/common';
import { DatabaseModule } from './db.connection/db-module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './users/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';

import { BooksService } from './books/books.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

import { usersProviders, rolesProviders , usersrolesProviders} from './users/users.providers';
import { booksProviders } from './books/books.providers';
import { authProviders } from './auth/auth.providers';

import { UsersController } from './users/users.controller';
import { BooksController } from './books/books.controller';
import { AuthController } from './auth/auth.controller';
import { PaymentService } from './services/payment.service';
import { EmailService } from './services/email.swrvice';



@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [BooksController, UsersController, AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    BooksService,
    PaymentService,
    EmailService,
    ...booksProviders,
    UsersService,
    ...usersProviders,
    AuthService,
    ...authProviders,
    ...rolesProviders,
    ...usersrolesProviders
  ]
})
export class AppModule { }
