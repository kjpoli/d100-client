const mongoose = require('mongoose');
const CharacterSchema = require('./character').schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var campaignSchema = mongoose.Schema({
    name: String,
    dm: { _id: { type: ObjectId, ref: 'User' } },
    players: [{ _id: { type: ObjectId, ref: 'User' } }],
    characters: [CharacterSchema],
    notes: [String],
    attributeTemplate: [{ name: String, primary: Boolean }]
});

module.exports = mongoose.model('Campaign', campaignSchema);
