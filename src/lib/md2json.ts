import {stringSplit} from '../lib/help';

/**
 * markdown => json
 */
export function mapData(content: string) {
    const ary = content.split(/\n- /);
    let obj: any = {};
    for (let i in ary) {
        const {key, value} = stringSplit(ary[i]);
        switch (key) {
            case '标题':
                obj['title'] = value || null;
                break;
            case '系统':
                obj['system'] = value || null;
                break;
            case '分类':
                obj['type'] = value || null;
                break;
            case '时间':
                obj['date'] = value || null;
                break;
            case '工作耗时':
                obj['work'] = Number(value.trimStart().replace(/h/, '')) || 0;
                break;
            case '非工作耗时':
                obj['nonwork'] = Number(value.trimStart().replace(/h/, '')) || 0;
                break;
            case '周末耗时':
                obj['weekend'] = Number(value.trimStart().replace(/h/, '')) || 0;
                break;
            case '请求方':
                obj['requestor'] = value || null;
                break;
            case '支持团队':
                obj['support'] = value || null;
                break;
            case '业务背景':
                obj['business_bg'] = value || null;
                break;
            case '技术背景':
                obj['technical_bg'] = value || null;
                break;
            case '技术实现背景':
                obj['technical_bg'] = value || null;
                break;
            case '解决过程':
                obj['solve'] = value || null;
            case '解决过程结果':
                obj['solve'] = value || null;
        }
    }
    return obj;
}
