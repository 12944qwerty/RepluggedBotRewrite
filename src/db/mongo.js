import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import { getSetting } from './config.js';
import { readBits, updateBits } from '../lib/bitsWorker.js';

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
            },
            blacklisted: false,
        });
        console.log('[MongoDB]: Created users collection.');
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
export async function deleteKey(collection, key) {
    await database.collection(collection).deleteOne({
        _id: key,
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
 * This function adds a user to the database - It is expected that the user does not already exist
 * @param {string} id The user's ID
 * @param {boolean} [blacklist=false] Whether to add the user to the blacklist
 * @returns {Promise<object>} the user object
 * @async
 */
export async function addUser(member, blacklist = false) {
    if ((await userExists(member.id))) {
        throw new Error('exists');
    }
    if (blacklist) {
        await database.collection('users').insertOne({
            _id: member.id,
            blacklisted: true
        });
    }
    else {
        await database.collection('users').insertOne({
            _id: member.id,
            avatar: member.user.avatarURL(),
            createdAt: new Date(),
            discriminator: member.user.discriminator,
            updatedAt: new Date(),
            flags: 0,
            username: member.user.username,
            accounts: {},
            cutiePerks: {},
            cutieStatus: {
                pledgeTier: 0,
            }
        });
    }
}

/**
         * This function gets a user from the database - It is expected that the user exists
         * @param {string} id The user's ID
         * @returns {Promise<Object>} The user
         * @async
         * @throws {Error} If the user doesn't exist
*/
export async function getUser(id) {
    if (!(await userExists(id))) throw new Error('nonexistent');
    return await database.collection('users').findOne({
        _id: id,
    });
}

/**
         * This function returns whether a user is blacklisted from the database - It is expected that the user exists
         * @param {string} id The user's ID
         * @returns {Promise<boolean>} Whether the user is blacklisted
         * @async
*/
export async function isGhosted(id) {
    const user = await getUser(id);
    const bits = readBits(user.flags);
    return bits[3];
}

/**
 * This function updates a user's values - It is expected that the user exists
 * @param {string} values The values to update
 * @param {string} id The user's ID
 * @returns {Promise<object>} The user
 * @async
 */
export async function updateUser(key, value, id) {
    if (!(await userExists(id))) throw new Error('nonexistent');
    await database.collection('users').updateOne({
        _id: id,
    }, {
        $set: {
            [key]: value,
        },
    });
    return await getUser(id);
}

/**
             * This function marks a user as a ghost and deletes a user from the database - It is expected that the user exists
             * @param {string} member The GuildMember object
             * @returns {Promise<void>} Nothing
             * @async
    */
export async function ghostAndDeleteUser(member) {
    let saveBits = 0;
    await getUser(member.id).then(async user => {
        saveBits = user.flags;
    });
    saveBits = updateBits({ ghost: true }, saveBits);
    await deleteKey('users', member.id);
    await addUser(member).then(async () => {
        updateUser('flags', saveBits, member.id).then(async (user) => {
            return user;
        });
    });
}
