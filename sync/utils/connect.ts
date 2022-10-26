import { MongoClient } from 'mongodb';

export const connect = async () => {
    const client = await MongoClient.connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@sample-cluster.node.us-east-1.docdb.amazonaws.com:27017/sample-database?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`,
        {
            tlsCAFile: `rds-combined-ca-bundle.pem`,
        },
    );

    const db = client.db('fsfd');

    return db;
};
