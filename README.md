<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development mode (watch)
$ npm run dev

# debug mode
$ npm run debug

# production mode
$ npm start
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Oracle 
This project uses oracle 21 xe 
```bash
# get image
$ docker pull gvenzl/oracle-xe:21-full

# build oracle image and detached (it gonna take while)
$ docker run -d -p 1521:1521 --name ora21cFull -e ORACLE_PASSWORD=SysPassword1 -v oracle-volume:/opt/oracle/XEORA21CFull/oradata gvenzl/oracle-xe

```

## Redis
```bash
# build redis image and detached
$ docker run --name redis-alpine -p 6379:6379 --hostname redis -v cache:/data -d redis:7.0.4-alpine --save 20 1 --loglevel warning --requirepass r123

# detached docker compose
$ docker-compose -f docker-compose-redis.yml up -d

```

## Docker 
```bash
# build docker register
$ docker build -t api-app001 .

# detached manually
$ docker run -p 3000:3000 --name api-app001 -d api-app001

# detached docker compose
$ docker-compose up -d

# run shell image
$ docker run -it api-app001 sh

# run command insdide container running
docker exec -u 0 -it container_id sh
```

# Docker notes

Docker as default use directory name as main node example:
```bash
# docker three
 api-oracle-nestjs
 + api
 + redis

# connect oracle database use container ip
$ docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name_or_id
```
# Conclusion
This project presents many stuffs about: API Rest, design pattern,microservices, good practices, clean architecture and docker.

I demonstrated a lot bunch of stuff about oracle database and build my own typeorm

We also saw how to use Redis with docker and the with docker-compose. We also added Redis as a cache to an existing NestJS API and witnessed the performance benefits.


