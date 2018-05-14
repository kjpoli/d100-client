var socket = io();
//get campaign from db
var bg = [];
var players = [];
let player;
let dm;
for(let player of players){
    bg.push(new BattleGridItem(player));
}

if(dm){
    var fdm = new FrameDM(players);
    fdm.insert();
}

if(player){
    var fp = new FrameProfile(player);
    fp.insert();
}
function bGridItemById(id){
    for(let gi of bg){
        if(gi._id == bg.id) return gi;
    } return 0;
}
