/**
 * 匹配中英文冒号，分割一次
 */
export function stringSplit(str: string) {
    let index = -1;
    index = str.indexOf('：');
    if (index === -1) index = str.indexOf(':');
    if (index > -1) {
        const key = str.slice(0, index);
        const value = str.slice(index + 1,);
        return {key, value};
    } else {
        return {key: str, value: null};
    }
}
