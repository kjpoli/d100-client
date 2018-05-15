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
                io.emit(info.name, info.charid);

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
