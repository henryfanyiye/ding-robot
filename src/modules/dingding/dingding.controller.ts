import {Body, Controller, Post, Get, Res, Param} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as fs from 'fs';
import {join} from 'path';
import * as moment from 'momnet';
import {Parser} from 'json2csv';
import {Response} from 'express';
import {DingdingService} from './dingding.service';
import {GithubService} from '../github/github.service';
import {PostgreService} from '../postgre/postgre.service';
import {mapData} from '../../lib/md2json';
import {stringSplit} from '../../lib/help';

@Controller('dingding')
export class DingdingController {
    constructor(
        private readonly dingdingService: DingdingService,
        private readonly githubService: GithubService,
        private readonly postgreService: PostgreService,
        private readonly configService: ConfigService
    ) {
    }

    @Post('sendMsg')
    async call(@Body() data: any) {
        const content: string = data.text.content.trimStart();

        // 获取l4模板
        if (content.substr(0, 2).toLowerCase() === 'l4') {
            return await this.dingdingService.sendMsg('# L4 Case\n' +
                '- 标题：title\n' +
                '- 系统：system\n' +
                '- 分类：type\n' +
                '- 时间：2021-01-01\n' +
                '- 工作耗时：0 h\n' +
                '- 非工作耗时：0 h\n' +
                '- 周末耗时：0 h\n' +
                '- 请求方：requester\n' +
                '- 支持团队：supporter\n' +
                '- 业务背景：\n' +
                '```\n' +
                '```\n' +
                '- 技术背景：\n' +
                '```\n' +
                '```\n' +
                '- 解决过程：\n' +
                '```\n' +
                '```\n');
        }

        // 创建issue并存入数据库
        if (content.substr(0, 9).toLowerCase() === '# l4 case') {
            const data = mapData(content);
            data.issue = await this.githubService.createSupportIssue(content, data);
            await this.postgreService.insertSupport(data);
            return await this.dingdingService.sendMsg(data.issue);
        }

        // 统计报表
        if (content.substr(0, 2) === '统计') {
            return await this.generateReports(content);
        }

        // help
        else {
            return await this.dingdingService.sendMsg(
                '支持命令：\n' +
                '- 获取支持模板：`l4`\n' +
                '- 统计报表：`统计` or `统计：2020-12-01，2021-01-01`\n'
            );
        }
    }

    @Get('download/:file')
    getFile(@Res() res: Response, @Param() params): string {
        console.log('xxx', params);
        res.sendFile(join(__dirname, '../../files', params.file));
        return '下载成功';
    }

    async generateReports(content: string) {
        const {value} = stringSplit(content);

        let start: string;
        let end: string;

        if (value) {
            [start, end] = value.split('，');
        } else {
            start = moment().format('YYYY-MM') + '-01';
            end = moment().add(1, 'M').format('YYYY-MM') + '-01';
        }

        const data = await this.postgreService.queryByMonth(start, end);

        const title = `${start}.csv`;
        const link = this.configService.get('downloadUrl') + title;
        await this.createCsv(title, data);

        return await this.dingdingService.sendMsg(link);
    }

    async createCsv(title: string, data: any) {
        const fields = [
            {label: '标题', value: 'title'},
            {label: '系统', value: 'system'},
            {label: '分类', value: 'type'},
            {label: '工作耗时', value: 'work'},
            {label: '非工作耗时', value: 'nonwork'},
            {label: '周末耗时', value: 'weekend'},
            {label: '请求方', value: 'requestor'},
            {label: '支持团队', value: 'support'},
            {label: '业务背景', value: 'business_bg'},
            {label: '解决过程', value: 'solve'},
            {label: 'Issue', value: 'issue'},
            {label: '时间', value: 'date'}
        ];

        const json2csvParser = new Parser({fields});
        const csv = json2csvParser.parse(data);

        const dirPath = join(__dirname, '../../files');
        const filePath = dirPath + `/${title}`;
        await fs.promises.mkdir(dirPath, {recursive: true});
        await fs.writeFileSync(filePath, csv);

        return filePath;
    }
}
