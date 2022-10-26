> ⚠️ Note: This documentation is a WIP and will be updated shortly.

# fsfd

> FluentStream Fraud Detection

## Todo

- Refactor + clean up code and split into separate testable libraies/functions
- Cron job for blocklist-sync
- Unit and integration tests
- Integrate DataDog and CloudWatch alarms
- Review and audit security settings

## AWS Services

1. Lambda
1. API Gateway
1. SAM
1. CloudFormation
1. DocumentDB
1. DynamoDB
1. S3
1. IAM
1. ECS
1. EC2
1. VPC

## Prerequisites

1. Docker
1. AWS SAM

## Build

Build the checkIp function:

```
sam build
```

Build the IP blocklist sync:

```
cd sync
docker build . -t blocklist-sync
```

## Test Locally

```
sam local invoke CheckIpFunction -e events/event.json
```

## Deploy

Deployment is handled via GitHub actions. The following secrets are needed:

- ACCESS_KEY
- ACCESS_KEY_SECRET
- DOC_DB_USER
- DOC_DB_PASS
- VPC
- SUBNET1
- SUBNET2
