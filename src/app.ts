import DynamoDB from 'aws-sdk/clients/dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createClient } from 'redis';
import { TypeOf, object, string } from 'zod';

import { connect } from './utils/connect';
import { createResponse } from './utils/createResponse';
import { convertIpAddressToNumber } from './utils/convertIpAddressToNumber';
import { parseBody } from './utils/parseBody';

const docClient = new DynamoDB.DocumentClient();

const redisClient = createClient({
    socket: {
        host: process.env.CACHE,
        port: 6379,
    },
});

const schema = object({
    ipAddress: string({
        required_error: 'IP Address is required.',
    }),
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = parseBody<TypeOf<typeof schema>>(event.body!, schema);
        console.log('body', body);

        const ipNumber = convertIpAddressToNumber(body.ipAddress);
        console.log('ipNumber', ipNumber);

        console.log('Checking cache...');
        await redisClient.connect();
        const cacheValue = (await redisClient.get(`ipNumber-${ipNumber}`)) as string;
        if (cacheValue) {
            return createResponse(200, JSON.parse(cacheValue));
        }

        console.log('Reading from Settings table...');
        const settingsResult = await docClient
            .get({
                TableName: process.env.SETTINGS_TABLE!,
                Key: {
                    Name: 'latestBlocklistCollection',
                },
            })
            .promise();
        if (!settingsResult.Item) {
            throw new Error('Blocklist does not exist');
        }

        console.log('Connecting to DocumentDB...');
        const db = await connect();

        console.log('Reading from Blocklist collection...');
        const blocklistCollection = db.collection(settingsResult.Item.Value);

        const blocklistResult = await blocklistCollection.findOne({
            ipAddressStart: {
                $gte: ipNumber,
            },
            ipAddressEnd: {
                $lte: ipNumber,
            },
        });
        console.log('blocklistResult', blocklistResult);

        console.log('Saving to cache...');
        await redisClient.set(
            `ipNumber-${ipNumber}`,
            JSON.stringify({
                isFraud: true,
            }),
        );

        if (!blocklistResult) {
            return createResponse(200, {
                isFraud: false,
            });
        }
    } catch (err: unknown) {
        console.log(err);
        return createResponse(500, {
            message: err instanceof Error ? err.message : 'some error happened',
        });
    }

    return createResponse(200, {
        isFraud: true,
    });
};
