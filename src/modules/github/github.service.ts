import {HttpService, Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class GithubService {
    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService
    ) {
    }

    async request(method: any, api: string, data?: any) {
        const {url: baseURL, token} = this.config.get('github');
        return this.httpService.request({
            baseURL,
            url: api,
            method,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`
            },
            data
        }).toPromise();
    }

    /**
     * 创建issue
     */
    async create(owner: string, repo: string, data: any) {
        return await this.request('post', `/repos/${owner}/${repo}/issues`, data).then(res => {
            return res.data;
        }).catch(err => {
            Logger.error(`Create issue error: ${JSON.stringify(err)}`);
            Logger.log(`Create issue data: ${JSON.stringify(data)}`);
            throw err;
        });
    }

    /**
     * 查询指定issue
     */
    async queryById(owner: string, repo: string, id: any) {
        const res = await this.request('get', `/repos/${owner}/${repo}/issues/${id}`);
        return res.data.body;
    }

    /**
     * 查询指定issue list
     * @param state：open，closed，all
     * @param sort：created，updated，comments
     * @param direction：asc（升序）或desc（降序）
     * @param since：YYYY-MM-DDTHH:MM:SSZ
     * @param page
     * @param per_page：<=100
     */
    async queryList(state: string, sort: string, direction: string, since: string, page: number, per_page: number) {
        const {owner, repo} = this.config.get('github');
        const res = await this.request('get', `/repos/${owner}/${repo}/issues?state=${state}&sort=${sort}&direction=${direction}&since=${since}&page=${page}&per_page=${per_page}`);
        return res.data;
    }

    /**
     * 创建l4 issue
     */
    async createSupportIssue(content: string, data: any) {
        const {owner, repo, assignees} = this.config.get('github');
        const body = {
            'title': `[L4-${data.system}] ${data.title}`,
            'body': content,
            'assignees': assignees,
            'labels': [
                'l4-support'
            ]
        };
        const {html_url} = await this.create(owner, repo, body);
        return html_url;
    }
}
