import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import { getSetting } from './config.js';

const dbName = await getSetting('DB');

config(); // dotenv

async function rawDB() {
    const db = new MongoClient(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}/${dbName}`);
    await db.connect()
        .then(() => console.log('[MongoDB]: Connected To MongoDB!'))
        .catch(e => console.error(`[MongoDB]: ${e}`));
    return db.db(dbName);
}

const database = await rawDB();

async function setupDB(db) {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    if (!collectionNames.includes('tags')) {
        await db.createCollection('tags');
        await db.collection('tags').insertOne({
            forg: 'Forg!',
        });
        console.log('[MongoDB]: Created tags collection.');
    }
    if (!collectionNames.includes('reactions')) {
        await db.createCollection('reactions');
        await db.collection('reactions').insertOne({
            forg: ':forg:',
        });
        console.log('[MongoDB]: Created reactions collection.');
    }
    if (!collectionNames.includes('users')) {
        await db.createCollection('users');
        await db.collection('users').insertOne({
            _id: '101010101010101010',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            createdAt: '2022-12-23T22:39:03.845Z',
            discriminator: '0000',
            flags: 0,
            username: 'User',
            accounts: {
                discord: {
                    accessToken: 'XXXXXXXXXXXXXXXXX',
                    expiresAt: '1671835532',
                    refreshToken: 'XXXXXXXX',
                    tokenType: 'Bearer',
                },
                spotify: {
                    accessToken: 'XXXXXXXXXXXXXXXXX',
                    expiresAt: '1671835532',
                    id: 'ExampleUser',
                    name: 'Example User',
                    refreshToken: 'XXXXXXXX',
                    tokenType: 'Bearer',
                }
            },
            cutiePerks: {
                badge: 'https://cdn.discordapp.com/attachments/1/1/1.png',
                color: '#888888',
                title: 'Example Perk'
            },
            cutieStatus: {
                pledgeTier: 3,
                perksExpireAt: '1671835532',
            }
        });
        console.log('[MongoDB]: Created users collection.');
    }
}

export async function connectDB() {
    await setupDB(database);
    return database;
}

export async function addKey(collection, key, value) {
    database.collection(collection).insertOne({
        [key]: value,
    });
}


export async function delKey(collection, key) {
    database.collection(collection).deleteOne({
        [key]: {
            $exists: true,
        }
    });
}

export async function getKeys(collection) {
    const unfiltered = await database.collection(collection).find().toArray();
    for (const key in unfiltered) {
        delete unfiltered[key]._id;
    }
    return unfiltered;
}