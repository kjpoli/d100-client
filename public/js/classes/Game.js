var socket = io();
var bg = [];
var cid = window.location.pathname.split('/')[2];

socket.on('connect', () =>{
    socket.emit('getCampaign', cid);
});
socket.on('gameInit', (pkg) => {
    var uid = pkg.uid;
    var campaign = pkg.campaign;

    let dm;
    for(let player of campaign.characters){
        bg.push(new BattleGridItem(player));
    }

    if(uid == campaign.dm){
        var fdm = new FrameDM(campaign.characters);
        fdm.insert();
    }else{
        for(let character of campaign.characters){
            if(character.user == uid){
                var fp = new FrameProfile(character);
                fp.insert();
            }
        }
    }

});
socket.on('btnVis', (id) => {
    let item = bGridItemById(id);
    item.toggleVisibility();
});
socket.on('btnTurn', (id) => {
    let item = bGridItemById(id);
    item.toggleTurn();
});
socket.on('btnInj', (id) => {
    let item = bGridItemById(id);
    item.injuryStatus();
});
function bGridItemById(id){
    for(let gi of bg){
        if(gi._id == bg.id) return gi;
    } return 0;
}
