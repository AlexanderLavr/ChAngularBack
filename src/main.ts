import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import conf from './config/config'
import { ExceptionHandlerFilter } from './exception';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(helmet());
  app.useGlobalFilters(new ExceptionHandlerFilter);

  const options = new DocumentBuilder()
    .setTitle("Book's shop")
    .setVersion('1.0')
    .setDescription("Book's shop")
    .addBearerAuth('Authorization', 'header', 'apiKey')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(conf.PORT);
  console.log(`Server is leasning on PORT  :  ${conf.PORT}`);
}
bootstrap();
