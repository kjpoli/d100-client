const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String,
    },
    campaigns: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
        name: { type: String, ref: 'Campaign' } 
    }]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
