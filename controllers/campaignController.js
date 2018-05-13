const mongoose = require('mongoose');
const Campaign = mongoose.model('Campaign');
const Character = mongoose.model('Character');

exports.createCampaign = function (req, res) {
    const enemy1 = new Character({
        _id: req.user._id,
        name: 'Gaunter O\'Dimm',
        icon: 'mirror.png',
        stats: {
            strength: 99,
            constitution: 99,
            dexterity: 99,
            intelligence: 99,
            wisdom: 99,
            charisma: 99
        }
    });

    const newCampaign = new Campaign({
        name: req.body.campaignName,
        dm: { _id: req.user._id },
    });

    newCampaign.characters.push(enemy1);
    newCampaign.save(function (err) {
        if (err) {
            res.status('500').send('Internal Server Error');
        } else {
            res.redirect(`/campaign/${newCampaign._id}`);
            // campaign created!
        }
    });
};

exports.joinCampaign = function (req, res) {
    Campaign.findOneById(req.params.campaignId, function (err, campaign) {
        if (err) {
            res.send({ message: `No campaign of ID ${req.params.campaignId} found` });
        } else {
            res.render('character', { campaignData: { id: campaign._id, name: campaign.name } });
            campaign.characters.findOneById(req.user._id, function (err, character) {
                if (err) {
                    res.status('404').send('Please create character');
                } else {
                    res.status('200').json(character);
                }
            });
        }
    });
};
