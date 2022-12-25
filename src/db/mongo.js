import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import { getSetting } from './config.js';

/**
 * The name of the database
 * @type {string}
 */
const dbName = await getSetting('DB');

config(); // dotenv

/**
 * This function connects to the database and returns the database object
 * @returns {Promise<Object>} The database object
 * @async
 */
async function rawDB() {
    console.log('[MongoDB]: Attempting connection to MongoDB...');
    const db = new MongoClient(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}/${dbName}`);
    await db.connect()
        .then(() => console.log('[MongoDB]: Connected To MongoDB!'))
        .catch(e => console.error(`[Fatal][MongoDB]: Couldn't connect to database!\n${e}`));
    return db.db(dbName);
}

/** The database object
 * @type {Object}
 */
const database = await rawDB();

/**
 * This function sets up the database if it isn't already set up
 * @param {Object} db The database object
 * @returns {Promise<void>} Nothing
 * @async
 */
async function setupDB(db) {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    if (!collectionNames.includes('users')) {
        await db.createCollection('users');
        await db.collection('users').insertOne({
            _id: '000000000000000000',
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
    if (!collectionNames.includes('blacklist')) {
        await db.createCollection('blacklist');
        await db.collection('blacklist').insertOne({
            _id: '000000000000000000',
        });
        console.log('[MongoDB]: Created blacklist collection.');
    }
}

/**
 * This function connects to the database and returns the database object
 * @returns {Promise<Object>} The database object
 * @async
 */
export async function connectDB() {
    await setupDB(database);
    return database;
}


/**
 * This function adds a key to a collection
 * @param {string} collection The collection to add the key to
 * @param {string} key The key to add
 * @param {any} value The value of the key
 * @returns {Promise<void>} Nothing
 * @async
 */
export async function addKey(collection, key, value) {
    await database.collection(collection).insertOne({
        [key]: value,
    });
}

/**
 *
 * @param {string} collection The collection to the key is in
 * @param {string} key The key to delete
 * @returns {Promise<void>} Nothing
 * @async
 */
export async function delKey(collection, key) {
    await database.collection(collection).deleteOne({
        [key]: {
            $exists: true,
        }
    });
}

/**
 * This function gets all keys from a collection
 * @param {string} collection The collection to get the keys from
 * @returns {Promise<Array>} The keys
 * @async
 */
export async function getKeys(collection) {
    const unfiltered = await database.collection(collection).find().toArray();
    for (const key in unfiltered) {
        delete unfiltered[key]._id;
    }
    return unfiltered;
}

/**
 * This function checks if a user exists in the database
 * @param {string} id The user's ID
 * @returns {Promise<boolean>} Whether the user exists
 * @async
 */
export async function userExists(id) {
    const user = await database.collection('users').findOne({
        _id: id,
    });
    if (user) {
        return true;

    } else {
        return false;
    }
}

/**
 * This function gets a user from the database
 * @param {string} id The user's ID
 * @returns {Promise<Object>} The user
 * @async
 */
export async function addUser(member) {
    if ((await userExists(member.id))) return; // We don't want to overwrite existing users
    const user = await database.collection('users').insertOne({
        _id: member.id,
        avatar: member.user.avatarURL(),
        createdAt: new Date(),
        discriminator: member.user.discriminator,
        flags: member.user.flags,
        username: member.user.username,
        accounts: {},
        cutiePerks: {},
        cutieStatus: {
            pledgeTier: 0,
        }
    });
    return user;
}

/**
 * This function adds a user to the blacklist
 * @param {string} id The user's ID
 * @returns {Promise<void>} Nothing
 * @async
 */
export async function blacklistUser(id) {
    await database.collection('blacklist').updateOne({
        _id: id,
    });
}