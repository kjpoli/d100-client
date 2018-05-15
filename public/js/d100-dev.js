
window.cid = 420;
window.pid = 69;

const t_char = {
    _id: 1,
    pid: 0,
    icon: 'ra-falling',
    name: 'Slavoj Zizek',
    level: 99,
    class: 'Pyschoanalyst',
    stats: [
        {name: 'int', val: 10, primary: true},
        {name: 'girth', val: 8, primary: true},
        {name: 'fatness', val: 9},
        {name: 'agility', val: 0},
        {name: 'fuck', val: 0},
        {name: 'fuck', val: 0},
        {name: 'fuck', val: 0},
        {name: 'fuck', val: 0},
        {name: 'fuck', val: 0},
        {name: 'fuck', val: 0},
        {name: 'fuck', val: 0}

    ]
};
var t_char_a = JSON.parse(JSON.stringify(t_char));
t_char_a.name = 'Karl Marx';
t_char_a.class = 'Revolutionary';
t_char_a._id = 2;

var t_char_b = JSON.parse(JSON.stringify(t_char));
t_char_b.name = 'Batman';
t_char_b.class = 'Vigilante';
t_char_b._id = 3;

var players = [t_char,t_char_a,t_char_b];
var fdm = new FrameDM(players);
fdm.insert();
var tt = new FrameProfile(t_char);
tt.insert();

var t_bgi = new BattleGridItem(t_char);
var bgi_a = [];

for(i in [...Array(12).keys()]){
    let tb = new BattleGridItem(t_char);
    tb.pid = i + 100;
    bgi_a.push(tb);
}
for(gi in bgi_a){
    if(bgi_a[gi].pid == 4100) bgi_a[gi].toggleTurn();
}
