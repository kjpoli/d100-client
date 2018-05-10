const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('node-uuid');

let buildUser = (id, name) => {
    return {
        _id: id,
        name: name
    };
};

module.exports.addUser = async (name) => {
    if (!name || typeof name !== 'string') throw 'Invalid name';
    const userCollection = await users();

    const recipe = buildUser(uuid(), name);
    const insertInfo = await userCollection.insertOne(user);

    if (insertInfo.insertedCount === 0) throw "Could not add user";

    const newUser = await this.getUserById(user._id);

    return newUser;
}