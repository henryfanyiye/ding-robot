import {HttpModule, Module} from '@nestjs/common';
import {PostgreService} from '../postgre/postgre.service';
import {GithubService} from '../github/github.service';
import { TaskController } from './task.controller';

@Module({
    imports: [
        HttpModule
    ],
    providers: [
        PostgreService,
        GithubService
    ],
    controllers: [TaskController]
})
export class TaskModule {
}
