import {Controller, Get, Logger, Query} from '@nestjs/common';
import {PostgreService} from '../postgre/postgre.service';
import {GithubService} from '../github/github.service';
import {ConfigService} from '@nestjs/config';
import {Cron, CronExpression} from '@nestjs/schedule';
import * as moment from 'momnet';
import {mapData} from '../../lib/md2json';

@Controller('task')
export class TaskController {
    constructor(
        private readonly postgreService: PostgreService,
        private readonly githubService: GithubService,
        private readonly config: ConfigService
    ) {
    }

    @Cron(CronExpression.EVERY_DAY_AT_4AM)
    async syncJob() {
        const start = moment().format('YYYY-MM') + '-01';
        const end = moment().add(1, 'M').format('YYYY-MM') + '-01';
        await this.syncGithubToPostgre(start, end);
    }

    /**
     * 保持数据库与github同步
     */
    @Get('sync')
    async syncData(@Query() query: any) {
        const {start, end} = query;
        return await this.syncGithubToPostgre(start, end);
    }

    async syncGithubToPostgre(start, end) {
        Logger.log(`Sync start：[${start},${end}]`);
        try {
            const data = await this.postgreService.queryByMonth(start, end);
            if (data.length > 0) {
                const {owner, repo} = this.config.get('github');
                Promise.all(
                    data.map(item => {
                        if (item.issue) {
                            const ary = item.issue.split('/');
                            return this.githubService.queryById(owner, repo, ary[ary.length - 1]).then(content => {
                                const obj = mapData(content);
                                return this.postgreService.updateSupport(obj, item);
                            }).catch(() => {
                                return;
                            });
                        } else {
                            return;
                        }
                    })
                ).then(() => {
                    Logger.log('Sync end.');
                });
            } else {
                Logger.log('Sync end.');
            }
            return {data: null};
        } catch (err) {
            Logger.error(`Sync error: ${JSON.stringify(err)}`);
            throw err;
        }
    }
}
