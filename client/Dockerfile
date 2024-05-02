# FROM node:16-alpine as build

# WORKDIR /app

# COPY package*.json ./

# RUN yarn install

# COPY . .

# RUN yarn build 

FROM nginx
EXPOSE 3000
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html
