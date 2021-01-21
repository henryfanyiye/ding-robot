import {Module, HttpModule} from '@nestjs/common';
import {DingdingController} from './dingding.controller';
import {DingdingService} from './dingding.service';
import {GithubService} from '../github/github.service';
import {PostgreService} from '../postgre/postgre.service';

@Module({
    imports: [
        HttpModule
    ],
    controllers: [
        DingdingController,
    ],
    providers: [
        GithubService,
        DingdingService,
        PostgreService
    ]
})
export class DingdingModule {
}
