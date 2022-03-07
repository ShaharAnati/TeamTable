import {MongoClient} from "mongodb";
import * as mongoDB from "mongodb";

const connectionURL = 'mongodb+srv://admin:Aa123456@teamtable.mii7y.mongodb.net'
const databaseName = 'TeamTable'
const client: MongoClient = new MongoClient(connectionURL);
const db: mongoDB.Db = client.db(databaseName);

export const connectToCluster = async () : Promise<mongoDB.Db> => {
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Successfully connected to MongoDB!');

        return db;
    } catch (error) {
        console.error('Connection to MongoDB failed!', error);
        process.exit();
    }
}

