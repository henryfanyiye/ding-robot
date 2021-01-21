import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const request = host.switchToHttp().getRequest();
        const response = host.switchToHttp().getResponse();

        const {method, originalUrl} = request;
        const message = exception['message'] || exception['response'].message || exception['response'].data.message;

        const data = {
            action: 'After',
            method,
            originalUrl,
            message,
            data: null,
        };

        Logger.log(JSON.stringify(data));

        response.status(400).jsonp({
            code: 400,
            msg: 'Failed',
            data: exception
        });
    }
}
