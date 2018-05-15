const mongoose = require('mongoose');
const Campaign = mongoose.model('Campaign');
const Character = mongoose.model('Character');
const User = mongoose.model('User');

exports.getCampaign = async function (campaignId) {
    if (campaignId == null) throw "No campaignId provided.";
    let campaign = await Campaign.findById(campaignId);
    return campaign;
};

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

exports.addCharacter = async function (req, res) {
    // if (req.params == null) return;
    // if (req.params.id) 

    // let campaignId = req.params.id;

};

exports.joinCampaign = async function (req, res) {
    let campaignId = req.params.id;
    let userId = req.user._id;
    res.status('200').send(campaignId);
/*
    Campaign.
        findById(campaignId).
        populate('dm', '_id').
        populate('players', '_id').
        populate('characters').
        exec(function (err, campaign) {
            if (err) {
                res.status('404').send('Campaign Not Found');
            } else {
                //if (userId.equals(campaign.dm._id)) {
                  //  res.status('200').send('DM');
                //} else {
                for (id in campaign.players) {
                    if (userId.equals(id)) {
                        res.status('200').send('OK');
                    }
                }
                res.status('200').send('NOt OK');
                
                    campaign.players.find(function (err, player) {
                        if (err) {
                            res.status('200').send('create character');
                        } else {
                            res.render('./layouts/gameboard', { layout: false });
                        }
                    });
                    res.render('./layouts/gameboard', { layout: false });
                //}
            }
        });
        */
};
