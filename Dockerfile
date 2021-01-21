FROM node:12.20.0

WORKDIR /app

# 将项目添加到 docker容器中
COPY . .

RUN npm config set registry=https://registry.npm.taobao.org
RUN npm install
RUN npm install -g pm2
RUN pm2 install typescript

EXPOSE 4000
CMD pm2-runtime start ecosystem.config.yaml
