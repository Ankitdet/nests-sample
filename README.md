# 3blocks.io

## 1. Description

Project for creating, setting up and deploying nestjs project to aws lambda. <br/>
This project presume that you have aws account with privilege to setup neccessary services.

## 2. Technologies

- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS RDS](https://aws.amazon.com/rds/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb)
- [Serverless](https://www.serverless.com/)
- [NestJS](https://nestjs.com/)

## 3. Usage

### Setup repository

First, clone the repository:

```
git clone https://git-codecommit.us-east-1.amazonaws.com/v1/repos/ccr-3blk-tools-uea1-3blocks-core
```

Fetch the `develop` branch and create new branch from it.
for e.g

```
git fetch origin develop
git checkout develop
git checkout -b 'new/branch'
```

Upgrade npm version

```
npm install --silent --progress=false -g npm@8.5.5
```

Install dependency package:

```
npm install --silent --progress=false
```

Install ts-node globally

```
npm install -g ts-node
```

### Running project locally

Run locally project

```
npm run start:dev
```

### Setup AWS Credentials

Install serverless:

```
npm install --silent --progress=false -g serverless@2.67.0
```

Set up aws profile

```
serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_ACCESS_KEY --profile default
```

Aws creds will store at ~/.aws/credentials

### Deployment

Compile project:

```
npm run-script build
```

Before deploying, we can verify that serverless configuration is OK or not with:

```
npm run sls:offline
```

##### Deploy to aws lambda

In this project, I use:

- `serverless-plugin-optimize` for optimizing code before deploying.
- `serverless-dotenv-plugin` for injecting enviroment variables from `.env` to lambda instance enviroment.

Deploy (not required)

```
npm run sls:deploy
```

While deploying, serverless may warn you about access authorities over services like APIGateway, CloudFormation, etc. Just attach the corresponding policies to those services with your aws user and continue.

##### Remove deployed function

Remove

```
sls remove
```

##### Testcase

Run Unit testcases all

```
npm run test
```

Debug unit testcases

```
npm run test:debug
```

Testcase coverage -> ./coverage/lcov-report/index.html

```
npm run test:cov
```

### Doc

<https://www.npmjs.com/package/@2fd/graphdoc>

Before generate doc, check endpoint in graphdoc

```
graphdoc -f
```

## express-unless issues

<https://github.com/types/express-unless>>

npm install typings -g
