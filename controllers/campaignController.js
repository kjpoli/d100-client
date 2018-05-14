const mongoose = require('mongoose');
const Campaign = mongoose.model('Campaign');
const Character = mongoose.model('Character');
const User = mongoose.model('User');

exports.createCampaign = async function (req, res) {
    const attributes = req.body;
    
    var characterAtts = [];
    var att;
    var attIndex = 0;

    for (att in attributes) {
        ++attIndex;
        let attName = `att${attIndex}`;
        let attPrimary = `primaryAtt${attIndex}`;
        if (attributes.hasOwnProperty(attName)) {
            if (attributes.hasOwnProperty(attPrimary)) {
                    characterAtts.push({ name: `${attributes[attName]}`, primary: true });
                } else {
                    characterAtts.push({ name: `${attributes[attName]}`, primary: false });
                }
        }
    }

    const newCampaign = new Campaign({
        name: req.body.campaignName,
        dm: { _id: req.user._id },
        attributeTemplate: characterAtts
    });

    const character = new Character({
        user: req.user._id,
        name: "Poop",
        icon: "css",
        stats: [
            { name: "str", value: 0, primary: true },
            { name: "dex", value: 99, primary: true }
        ]
    });

    newCampaign.characters.push(character);

    User.findById(req.user._id, function (err, user) {
        if (err) {
            res.status('500').send('uh oh');
        } else {
            user.campaigns.push({ _id: newCampaign._id, name: newCampaign.name });
            user.save(function (err) {
                if (err) {
                    res.status('500').send('internal');
                }
            });
        }
    });
    newCampaign.save(function (err) {
        if (err) {
            res.status('500').send('Internal Server Error');
        } else {
            res.redirect('/campaign');
            //campaign created!
        }
    });
};

exports.joinCampaign = async function (req, res) {
    let campaignId = req.params.id;
    let userId = req.user._id;
    //res.status('200').send(campaignId);

    Campaign.
        findById(campaignId).
        populate('dm', '_id').
        populate('players', '_id').
        populate('characters').
        exec(function (err, campaign) {
            if (err) {
                res.status('404').send('Campaign Not Found');
            } else {
                if (userId.equals(campaign.dm._id)) {
                    res.render('./layouts/gameboard', { layout: false });
                } else {
                    /*
                    User.
                        findById(userId).
                        populate('campaigns', '_id').
                        exec(function (err, user) {
                        if (err) {
                            res.status('500').send('Internal Server Error');
                        } else {
                            if (user.campaigns[0]._id.equals(campaignId)) {
                                res.render('./layouts/gameboard', { layout: false });
                            }
                        }
                    });
                    */
                    for (let id of campaign.players) {
                        if (userId.equals(id._id)) {
                            res.render('./layouts/gameboard', { layout: false });
                        }
                    }
                    
                    res.render('createCharacter', {campaignId: campaignId});
                }
            }
        }); 
};

exports.createCharacter = async function (req, res) {
    let campaignId = req.body.campaignId;
    let userId = req.user._id;
    let attributes = req.body;

    Campaign.findById(campaignId, function (err, campaign) {
        if (err) {
            res.status('404').send('Campaign not found');
        } else {
            let attributeList = [];
            attributeList.push({name: 'con', val: attributes.con, primary: true});
            attributeList.push({name: 'str', val: attributes.str, primary: true});
            attributeList.push({name: 'dex', val: attributes.dex, primary: true});
            attributeList.push({name: 'cha', val: attributes.cha, primary: true});
            attributeList.push({name: 'int', val: attributes.int, primary: true});
            attributeList.push({name: 'wis', val: attributes.wis, primary: true});
            
            let newChar = new Character({
                user: userId,
                name: req.body.name,
                class: req.body.class,
                icon: 'ra-helmet',
                stats: attributeList
            });

            campaign.players.push(userId);
            campaign.characters.push(newChar);

            campaign.save(function(err) {
                if (err) {
                    res.status('500').send('internal server error');
                } else {
                    User.findById(userId, function (err, user) {
                        if (err) {
                            res.status('500').send('internal server error');
                        } else {
                            user.campaigns.push({ _id: campaignId, name: campaign.name });
                            user.save(function(err) {
                                if (err) {
                                    res.status('500').send('internal server error');
                                } else {
                                    res.redirect('/campaign');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
