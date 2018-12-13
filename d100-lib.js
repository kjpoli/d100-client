 class BattleGridItem {
    //pass it a character document
    constructor(obj){
        this.name = obj.name;
        this.pid = obj.pid;
        this.icon = obj.icon;
        this.id = obj._id;
        //acceptible injury statuses are normal | injured | near death
        // dead characters battle grid items are hidden
        this.injStatus = obj.injStatus ? obj.injStatus : 'normal';
        this.turn = false;

        //switch to 3x icons for cards with a badge and 4x for cards with no badge
        this.template = () => $.parseHTML(`
              <div class="card battle-grid-item">
                <div class="card-header battle-grid-header active">
                  ${this.name}
                </div>
                <div class="card-block">
                  <i class="ra ${this.icon} ra-4x"> </i>
                  <span class="badge badge-hidden inj-indicator"> ${this.injStatus} </span>
                  <span class="badge badge-success turn-indicator">o</span>
                </div>
              </div>
            `.trim());
        this.content = this.template();
        $(this.content).appendTo('.battle-grid');
        this.toggleVisible();

    }
    //no args, rotate inj status
    // if args, set inj status
    injuryStatus(status){
        let indc = $('.inj-indicator', this.content);
        let iconc = $('.ra', this.content);
        let badge;
        if(status){
            switch(status){
                case 'normal':
                    badge = {status: 'normal', class: 'badge-hidden'};
                    iconc.removeClass('ra-3x');
                    iconc.addClass('ra-4x');
                    break;
                case 'injured':
                    badge = {status: 'injured', class: 'badge-warning'};
                    iconc.removeClass('ra-4x');
                    iconc.addClass('ra-3x');
                    break;
                case 'near-death':
                    badge = {status: 'near-death', class: 'badge-danger'};
                    iconc.removeClass('ra-4x');
                    iconc.addClass('ra-3x');
                    break;
            }
        }else{
            switch(this.injStatus){
                case 'normal':
                    badge = {status: 'injured', class: 'badge-warning'};
                    iconc.removeClass('ra-4x');
                    iconc.addClass('ra-3x');
                    $(this.content).effect('shake');
                    break;
                case 'injured':
                    badge = {status: 'near-death', class: 'badge-danger'};
                    $(this.content).effect('shake');
                    break;
                case 'near-death':
                    badge = {status: 'normal', class: 'badge-hidden'};
                    iconc.removeClass('ra-3x');
                    iconc.addClass('ra-4x');
                    break;
            }

        }
        indc.html(badge.status);
        indc.removeClass('badge-danger badge-hidden badge-warning');
        indc.addClass(badge.class);
        this.injStatus = badge.status;
    }
    toggleTurn(){
        $('.turn-indicator', this.content).toggleClass('turn');
    }
    //removes or adds from grid with slide effect
    toggleVisible(){
        $(this.content).animate({width: 'toggle'}, 300);
    }
    //removes from grid with puff effect
    kill(){
        $(this.content).effect('puff');
    }

}


class Frame {

    constructor(){
        this.pid = window.pid;
        this.cid = window.cid;
        this.frameId = '#blank-frame';

        this.sizing = {
            minWidth: 50,
            maxWidth: 250,
            minHeight: 50,
            maxHeight: 250
        };

        //returns dom nodes
        this.frame_t = () => {
            let nodes = $.parseHTML(`
              <div class="card" id="${this.frameId}">
                <div class="card-header">
                  ${this.windowTitle}

                </div>
            <div class="card-block bg-faded ${this.contextualClasses}">

            </div>
            `.trim());

            $('.card-header', nodes).dblclick( () => $('.card-block',this.content).toggle() );
            return nodes;
        };
        // blank frames shouldn't eval their content but this is what it would look like
        //this.content = this.frame_t();

    }
    //only run once per frame on document ready
    // use hide and show after
    insert() {
        $(this.content).width(this.sizing.minWidth)
        .height(this.sizing.minHeight)
        .appendTo('#drag-container')
        .resizable(this.sizing)
        .draggable({handle: ".card-header"});
    }
    hide() {
        $(this.content).hide();
    }
    show(){
        $(this.content).show();
    }
}

class FrameDM extends Frame {
    //pass it the complete list of players
    constructor(players){
        super();

        this.frameId = '#dm-control-frame';
        this.windowTitle = 'Dungeon Master';
        //the player list functions as an inventory
        this.contextualClasses = 'tracked-inv container row';

        this.sizing = {
          minWidth: 800,
          maxWidth: 1024,
          minHeight: 400,
          maxHeight: 750
        };

        this.pFrames = [];
        for(let player of players){
            this.pFrames.push(new FrameProfile(player));
        }


        this.body_t = () => {
            return $.parseHTML(`
              <div class="col-6">
                <ul id="dm-p-list" class="tracked-items list-group">
                </ul>
              </div>
              <div id="dm-display-profile" class="display-profile col-6"></div>
            `.trim());
        };

        this.player_entry_t = (character) => {
            let li = $.parseHTML(`
            <li class="list-group-item col-xs color-inv">
              <i class="ra ${character.icon} item-i"> </i>
              <span class="item-name">${character.name}</span>
              <span class="stat-val"> ${character.level} </span>
            </li>
            `.trim());
            //invokes a closure with the character baked in
            $(li).click( () => {
                for(let item of $('#dm-p-list').children()){
                    $(item).removeClass('active');
                }
                $(li).addClass('active');
                this.renderProfile(character);
            } );
            return li;

        };
        this.control_group_t = (character) => {
            let id = character._id;
            let controlNodes = $.parseHTML(`
             <div class="row dm-char-control">
                <button id="btnVis:id-${id}" type="button" class="btn btn-primary">
                    Toggle Visibility
                </button>
                <button id="btnTurn:id-${id}" type="button" class="btn btn-primary">
                    Toggle Turn
                </button>
                <button id="btnInj:id-${id}" type="button" class="btn btn-success">
                    Toggle Injury Status
                </button>
             </div>
            `.trim());
            for (let button of $(controlNodes).children()){
                let info = {name: button.id.split(':')[0], charid: button.id.split('-')[1]};
                socket.emit(info.name, info.charid);

            } return controlNodes;
        };
        this.content = this.frame_t();
        $('.card-block', this.content).append(this.body_t());
        this.renderPlayerList();
    }
    renderProfile(character) {
        let div = $('#dm-display-profile', this.content);
        div.empty();
        let pFrameTemp = new FrameProfile(character);
        let profileBody =$('.card-block', pFrameTemp.content).children();

        let selected = div.clone();
        $(selected).append(profileBody);

        let insPointSelector = $('.foot-info', selected);
        let insPointNodes = $(selected).find(insPointSelector);

        $(this.control_group_t(character)).insertAfter(insPointNodes);
        div.replaceWith(selected);



    }
    renderPlayerList(){
        let ul = $('#dm-p-list',this.content).clone();
        this.pFrames.forEach( ( pFrame ) => {
            let pnode = this.player_entry_t(pFrame.character);
            console.log(pnode);
            $(ul).append(pnode);
        } );

        $('.tracked-items',this.content).replaceWith(ul);
    }
    pframeById(id){
        for(let pframe of this.pFrames){
            if(pframe._id == id) return pframe;
        }
        return 0;
    }
}

class FrameProfile extends Frame {
    constructor(obj){
        super();
        this.frameId = '#profile-frame:id-' + obj._id;
        this.contextualClasses = 'display-profile';
        this.windowTitle = 'Character';
        this.character = obj;

        this.sizing = {
            minWidth: 300,
            maxWidth: 550,
            minHeight: 740,
            maxHeight: 750
        };

        //redraw frame skeleton with contextual info and shit
        this.content = this.frame_t();

        this.body_t = (obj) => {
            return $.parseHTML(`
            <i class="ra ${obj.icon} ra-5x"> </i>
            <div class="display-bio">
                <h1 class="entry-header"> ${obj.name} </h1>
                <hr class="separator" />
                <h4 class="foot-info"> <span class="lvl"> Level ${obj.level} |</span> ${obj.class} </h4>
                <ul class="tracked-stats list-group">
                </ul>
            </div>

        `.trim());
        };
        this.stat_t = (obj) => {
            return $.parseHTML(`
                <li class="list-group-item"> <span class="tracked-stat">${obj.name} :</span>
                <span class="stat-val"> ${obj.val} </span> </li>
            `.trim());
        };
        $('.card-block', this.content).append(this.body_t(this.character));
        this.renderStats();
    }
    //replaces ul with recreated stat list
    // pass it char.stats[]
    // TODO: change individual stats without rerendering ul
    renderStats(){
        let ul = $('.tracked-stats',this.content).clone();
        this.character.stats.forEach( ( stat ) => {
            let statnode = this.stat_t(stat);
            if(stat.primary) $(statnode).addClass('color-inv');
            $(ul).append(statnode);
        } );

        $('.tracked-stats',this.content).replaceWith(ul);
    }


}

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
