const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String,
    },
    campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.addCampaign = function(id) {
    this.campaigns.push({ _id: id });
};

module.exports = mongoose.model('User', userSchema);
