import { MongoClient } from 'mongodb';

export const connect = async () => {
    const client = await MongoClient.connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSER}:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`,
        {
            tlsCAFile: process.env.TLS_CA_FILE,
        },
    );

    const db = client.db('fsfd');

    return db;
};
