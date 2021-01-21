import {Injectable, HttpService} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {map} from 'rxjs/operators';

@Injectable()
export class DingdingService {
    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService
    ) {
    }

    private readonly dingConfig = this.config.get('dingDing');

    async sendMsg(msg: string) {
        const {url, access_token} = this.dingConfig;
        return this.httpService.post(
            `${url}/robot/send?access_token=${access_token}`,
            {
                'msgtype': 'text',
                'text': {
                    'content': msg

                }
            }
        ).toPromise();
    }

}
