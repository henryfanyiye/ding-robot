import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

const pgp = require('pg-promise')({
    noWarnings: true
});

@Injectable()
export class PostgreService {
    constructor(
        private readonly configService: ConfigService
    ) {
    }

    private readonly options = this.configService.get('postgre');
    private readonly db: any = pgp(`postgres://${this.options.user}:${this.options.password}@${this.options.host}:${this.options.port}/${this.options.database}`);

    async insertSupport(data: any) {
        let {
            title,
            system,
            type,
            date,
            work,
            nonwork,
            weekend,
            requestor,
            support,
            business_bg = '',
            technical_bg = '',
            solve = '',
            issue
        } = data;

        // 替换文本中的'为"
        business_bg = business_bg.replace(/'/g, '"');
        technical_bg = technical_bg.replace(/'/g, '"');
        solve = solve.replace(/'/g, '"');

        const query = `INSERT INTO support (title, system, type, date, work, nonwork, weekend, requestor, support, business_bg,technical_bg, solve,issue) 
                        VALUES ('${title}', '${system}', '${type}', '${date}', ${work}, ${nonwork}, ${weekend}, '${requestor}', '${support}', '${business_bg}', '${technical_bg}', '${solve}', '${issue}')`;
        try {
            return await this.db.any(query);
        } catch (err) {
            Logger.error(`Insert DB error: ${JSON.stringify(err)}`);
            Logger.log(`Insert DB SQL: ${JSON.stringify(query)}`);
            throw err;
        }
    }

    async updateSupport(gitData: any, dbData: any) {
        let query = 'UPDATE support SET ';
        let flag = false;
        if (gitData.work != dbData.work || gitData.nonwork != dbData.nonwork || gitData.weekend != dbData.weekend) {
            query += `work=${gitData.work},nonwork=${gitData.nonwork},weekend=${gitData.weekend} WHERE id=${dbData.id}`;
            flag = true;
        }
        try {
            if (flag) {
                return await this.db.any(query);
            } else {
                return;
            }
        } catch (err) {
            Logger.error(`Update DB error: ${JSON.stringify(err)}`);
            Logger.log(`Update DB SQL: ${JSON.stringify(query)}`);
            throw err;
        }
    }

    async queryByMonth(start: string, end: string) {
        const query = `SELECT * FROM support WHERE "createAt" >= '${start}' AND "createAt" < '${end}'`;
        try {
            return await this.db.any(query);
        } catch (err) {
            Logger.error(`Query DB error: ${JSON.stringify(err)}`);
            Logger.log(`Query DB SQL: ${JSON.stringify(query)}`);
            throw err;
        }
    }
}
