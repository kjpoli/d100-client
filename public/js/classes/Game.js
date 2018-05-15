var socket = io();
//get campaign from db
var bg = [];
var cid = window.location.pathname.split('/')[1];
var setup = $.get('http://localhost:3000/dev/campaign/' + cid);
var uid = setup.uid;
var campaign = setup.campaign;

let dm;
for(let player of campaign.characters){
    bg.push(new BattleGridItem(player));
}

if(uid == campaign._dmid){
    var fdm = new FrameDM(players);
    fdm.insert();
}else{
    for(let character of campaign.characters){
        if(character.user == uid){
            var fp = new FrameProfile(player);
            fp.insert();
        }
    }
}
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
