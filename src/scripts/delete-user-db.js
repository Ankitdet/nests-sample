
const AWS = require('aws-sdk');
const { trimEnd } = require('lodash');

const tableName = "ddb-3blk-dev-uea1-3blocks-User-Access"

const usersToDeleteFromDB = ['dblackfyre@proton.me', 'babreydustin@proton.me']

AWS.config.update({
    accessKeyId: 'AKIAUXSLYQTSBD6XTQ4L',
    secretAccessKey: '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',
    region: 'us-east-1'
})

const docClient = new AWS.DynamoDB.DocumentClient({

    // optional tuning - 50% faster(cold) / 20% faster(hot)
    region: 'us-east-1',
    apiVersion: '2012-08-10',
    credentials: {
        accessKeyId: 'AKIAUXSLYQTSBD6XTQ4L',
        secretAccessKey: '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',
    },
    convertResponseTypes: true,
    httpOptions: {
        connectTimeout: 1000,
        timeout: 1000,
    },
    convertEmptyValues: true,
});

const scanFromDB = async (users) => {
    let str = ''
    let attrValues = {}
    users.map((name, index) => {
        str = str + `contains(#a88b0, :${index}) OR `
        attrValues = {
            ...attrValues,
            [`:${index}`]: name
        }
    })
    var lastIndex = str.lastIndexOf("OR");
    str = str.substring(0, lastIndex);
    console.log(str)
    console.log(attrValues)
    let params = {
        "TableName": tableName,
        "ConsistentRead": false,
        "FilterExpression": str,
        "ExpressionAttributeValues": attrValues,
        "ExpressionAttributeNames": {
            "#a88b0": "email",
        }
    }
    let scanResults = [];
    let items;

    do {
        items = await docClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");
    console.log('Scan:', scanResults)
    return scanResults
}

const deleteQuery = async (users) => {
    const r = users
    for (let a = 0; a < r.length; a++) {
        await docClient.delete({
            TableName: tableName,
            Key: {
                'pk': '#USER#' + r[a],
                'sk': '#USER#' + r[a]
            },
        }).promise()
        console.log('deleted item')
    }
}

const resp = scanFromDB(usersToDeleteFromDB).then((e) => {
    const userIds = e.map((r) => {
        return r.user_id
    })
    console.log('fetched user ids', userIds)
    const cognito = new AWS.CognitoIdentityServiceProvider();
    for (let i = 0; i < userIds.length; i++) {
        cognito.adminDeleteUser({
            UserPoolId: 'us-east-1_cogUB7cee',
            Username: String(userIds[i]),
        }).promise().then((a) => console.log('delete completed'))
    }
    deleteQuery(userIds)
})

