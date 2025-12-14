import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configurations, validationSchema } from './configuration';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      isGlobal: true,
      load: configurations,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [NestConfigModule, ConfigService],
})
export class ConfigModule {}
