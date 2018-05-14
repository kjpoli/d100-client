
window.cid = 420;
window.pid = 69;

var t_char = {
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
