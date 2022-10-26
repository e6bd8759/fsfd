import { MongoClient } from 'mongodb';

export const connect = async () => {
    console.log(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`);

    console.log('Connecting via Mongo Client...');
    const client = await MongoClient.connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`,
        {
            tlsCAFile: process.env.TLS_CA_FILE,
        },
    );

    console.log('Connecting to fsfd database...');
    const db = client.db('fsfd');

    return db;
};
