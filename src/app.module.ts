import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { KeywordsModule } from './keywords/keywords.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

const APP_GUARD_TOKEN = 'APP_GUARD';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const throttleConfig = configService.getThrottle();
        return [
          {
            ttl: throttleConfig.ttl,
            limit: throttleConfig.limit,
          },
        ];
      },
    }),
    PrismaModule,
    UsersModule,
    PostsModule,
    CategoriesModule,
    KeywordsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD_TOKEN,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
