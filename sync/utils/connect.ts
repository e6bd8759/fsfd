import { Db, MongoClient } from 'mongodb';

export const connect = async () => {
    console.log(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}:27017`);

    console.log('Connecting via Mongo Client...');
    console.log({
        readPreference: 'secondaryPreferred',
        replicaSet: 'rs0',
        retryWrites: false,
        ssl: true,
        sslCA: process.env.TLS_CA_FILE,
    });
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

    const db = client.db('fsfd');

    return db;
};
