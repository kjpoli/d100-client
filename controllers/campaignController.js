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
            //res.status('200').json(newCampaign);
            //res.render('campaign', { message: "tits" });
            res.redirect('/campaign');
            //campaign created!
        }
    });
};

exports.joinCampaign = async function (req, res) {
    let campaignId = req.params.id;
    Campaign.findById(campaignId, function (err, campaign) {
        if (err) {
            res.render('campaign', { message: `No campaign of ID ${campaignId} found` });
        } else {
            res.render('campaign', { message: `yay` });
            campaign.characters.findById(req.user._id, function (err, character) {
                if (err) {
                    res.status('404').send('you need to create a character');
                    //res.redirect('/campaign/:id/create');
                } else {
                    res.status('200').json(character);
                }
            });
        }
    });
};
