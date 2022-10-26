import DynamoDB from 'aws-sdk/clients/dynamodb';
import { readFile, readdir } from 'fs/promises';

import { connect } from './utils/connect';
import { convertIpAddressToNumber } from './utils/convertIpAddressToNumber';
import { getRange } from './utils/getRange';

const docClient = new DynamoDB.DocumentClient({
    region: 'us-east-1',
});

const ipRegex = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(\/[0-9]+)?$/;
const ipRangeRegex = /\/[0-9]+$/;

(async () => {
    const files = (await readdir('./blocklist-ipsets')).filter((f) => f.split('.').slice(-1)[0] === 'ipset');

    const promises = files.map(async (fileName) => {
        const file = await readFile(`./blocklist-ipsets/${fileName}`, 'utf8');
        return file
            .split(/\n/)
            .filter((line) => ipRegex.test(line))
            .map((ipAddress) => {
                const [ipAddressStart, ipAddressEnd] = ipRangeRegex.test(ipAddress)
                    ? getRange(ipAddress)
                    : [ipAddress, ipAddress];

                return {
                    ipAddress: ipAddress,
                    ipAddressStart: convertIpAddressToNumber(ipAddressStart),
                    ipAddressEnd: convertIpAddressToNumber(ipAddressEnd),
                };
            });
    });

    const records = (await Promise.all(promises)).flat();

    const latestBlocklistCollectionName = `blocklist-${Math.random()}`;

    const db = await connect();
    const blocklistCollection = db.collection(latestBlocklistCollectionName);
    blocklistCollection.insertMany(records);

    await docClient
        .update({
            TableName: process.env.SETTINGS_TABLE!,
            Key: {
                Name: 'latestBlocklistCollection',
            },
            UpdateExpression: 'SET Value = :v',
            ExpressionAttributeValues: {
                ':v': latestBlocklistCollectionName,
            },
        })
        .promise();
})();
