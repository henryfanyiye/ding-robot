import {Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(map(response => {
            const http = context.switchToHttp();
            const res = http.getResponse();

            const {method, originalUrl} = context.getArgs()[0];
            const {data} = response;
            const afterData = {
                action: 'After',
                method,
                url: originalUrl,
                body: data
            };

            Logger.log(JSON.stringify(afterData));

            res.status(200);
            return {
                code: 0,
                msg: 'Success',
                data
            };
        }));
    }
}
