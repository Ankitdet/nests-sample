#!/bin/bash

set -x

CREDS=$(aws sts assume-role \
--role-arn $CROSS_ACCOUNT_ROLE \
--role-session-name $(date '+%Y%m%d%H%M%S%3N') \
--duration-seconds 3600 \
--query '[Credentials.AccessKeyId,Credentials.SecretAccessKey,Credentials.SessionToken]' \
--output text)

echo $CREDS 

export AWS_DEFAULT_REGION="us-east-1"
echo "export AWS_DEFAULT_REGION=us-east-1"
export AWS_ACCESS_KEY_ID=$(echo $CREDS | cut -d' ' -f1)
echo "export AWS_ACCESS_KEY_ID=$(echo $CREDS | cut -d' ' -f1)"
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | cut -d' ' -f2)
echo "export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | cut -d' ' -f2)"
export AWS_SESSION_TOKEN=$(echo $CREDS | cut -d' ' -f3)
echo "export AWS_SESSION_TOKEN=$(echo $CREDS | cut -d' ' -f3)"