import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '../orm.config';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CompanyModule } from './company/company.module';
import { QueueModule } from './queue/queue.module';
import { RedisMQModule } from './redisMQ/redismq.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSource.options,
      }),
    }),
    RedisMQModule,
    WorkerModule,
    AuthModule,
    BlogModule,
    CompanyModule,
    QueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
