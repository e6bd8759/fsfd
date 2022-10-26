import { Db, MongoClient } from 'mongodb';

let cachedDb: Db;

export const connect = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    console.log(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}:27017`,
    );

    console.log('Connecting via Mongo Client...');
    const client = await MongoClient.connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}:27017`,
        {
            readPreference: 'secondaryPreferred',
            replicaSet: 'rs0',
            retryWrites: false,
            ssl: true,
            sslCA: process.env.TLS_CA_FILE,
        },
    );

    console.log('Connecting to fsfd database...');
    cachedDb = client.db('fsfd');

    return cachedDb;
};
