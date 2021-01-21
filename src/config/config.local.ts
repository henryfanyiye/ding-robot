export default () => ({
    downloadUrl: 'http://127.0.0.1:4000/dingding/download/',

    // DingDing
    dingDing: {
        url: 'https://oapi.dingtalk.com',
        access_token: 'e7dfd83c430f6269319d7e911d17a95ac691677754ecbd998e6a9cecf5a0556e'
    },

    // Github
    github: {
        url: 'https://api.github.com',
        token: '972795b789409b91189d66985a34a78a9cf7aae5',
        owner: 'henryfanyiye',
        repo: 'ding-robot',
        assignees: []
    },

    // postgre db
    postgre: {
        user: 'postgre',
        password: 'postgre',
        host: '127.0.0.1',
        port: '5432',
        database: 'ding-robot',
    }
})
