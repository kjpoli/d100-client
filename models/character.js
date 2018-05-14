const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var characterSchema = mongoose.Schema({
    user: { type: ObjectId, ref: 'User' },
    name: String,
    class: String,
    icon: String,
    stats: [{ name: String, value: Number, primary: Boolean }],
    inv: [{ name: String, description: String, quantity: Number }],
    notes: [String]
});

module.exports = mongoose.model('Character', characterSchema);
