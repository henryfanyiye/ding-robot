import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {APP_INTERCEPTOR, APP_FILTER} from '@nestjs/core';
import {ConfigModule} from '@nestjs/config';
import {ScheduleModule} from '@nestjs/schedule';

import config from './config/config.local';

import {LoggerMiddleware} from './middleware/logging.middleware';
import {TransformInterceptor} from './interceptors/transform.interceptor';
import {DingdingModule} from './modules/dingding/dingding.module';
import {ErrorFilter} from './common/filter/error.filter';
import {TaskModule} from './modules/task/task.module';

function switchConfig(): any[] {
    switch (process.env.NODE_ENV) {
        case 'dev':
            return [];
            break;
        case 'prod':
            return [];
            break;
        default:
            return [config];
    }
}

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: true,    // 禁用ENV变量加载
            isGlobal: true,         // 使用全局模块
            cache: true,            // 缓存环境变量
            load: switchConfig()
        }),
        ScheduleModule.forRoot(),
        DingdingModule,
        TaskModule,
        // GithubModule
    ],
    providers: [
        // Response格式化
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        //
        {
            provide: APP_FILTER,
            useClass: ErrorFilter,
        }
    ]
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*');
    }
}
