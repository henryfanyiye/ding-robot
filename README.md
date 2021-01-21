## 概述

基于github和钉钉机器人，实现运维任务的快速记录

## 技术栈

- TypeScript
- postgre

## 技术文档

- [Nest.js](https://docs.nestjs.com/)
- [Github API](https://docs.github.com/en/free-pro-team@latest/rest/reference/issues)

## 机器人搭建

1. [企业内部机器人](https://ding-doc.dingtalk.com/document#/org-dev-guide/elzz1p)

2. [引入机器人](https://ding-doc.dingtalk.com/document#/org-dev-guide/custom-robot)

## 程序运行

### local

```shell
npm run start:dev
```

### prod

- docker启动及校验

```shell
docker build -t ding-robot -f Dockerfile .
docker run -d -p 4000:4000 --name ding-robot ding-robot
docker ps
```

- pm2启动及校验

```shell
npm config set registry=https://registry.npm.taobao.org
npm install
npm install -g pm2
pm2 install typescript
pm2 start ecosystem.config.yaml
pm2 list
```
