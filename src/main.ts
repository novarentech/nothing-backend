import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@config/config.service';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ZodValidationPipe } from 'nestjs-zod';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const globalPrefix = configService.get('API_PREFIX', 'api');
  app.setGlobalPrefix(globalPrefix);

  const corsWhitelist = configService.get('CORS_WHITELIST', '').split(',');
  app.enableCors({
    origin: corsWhitelist,
    credentials: true,
  });

  // Serve Swagger UI
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src', 'swagger.json'), 'utf8'),
  );
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ZodValidationPipe());

  const port = configService.getNumber('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
  console.log(`Swagger UI is running on: http://localhost:${port}/docs`);
}
bootstrap();
