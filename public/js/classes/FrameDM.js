class FrameDM extends Frame {
    //pass it the complete list of players
    constructor(players){
        super();

        this.frameId = '#dm-control-frame';
        this.windowTitle = 'Dungeon Master';
        //the player list functions as an inventory
        this.contextualClasses = 'tracked-inv row';

        this.sizing = {
          minWidth: 550,
          maxWidth: 800,
          minHeight: 600,
          maxHeight: 750
        };

        this.pFrames = [];
        for(player of players){
            this.pFrames.push(new FrameProfile(player));
        }


        this.body_t = () => {
            return $.parseHTML(`
              <div class="col-6">
                <ul id="dm-p-list" class="tracked-items list-group">
                </ul>
              </div>
              <div id="dm-display-profile" class="col-6"></div>
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
                for(item of $('#dm-p-list').children()){
                    $(item).removeClass('active');
                }
                $(li).addClass('active');
                renderProfile(character);
            } );

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
            for (button of $(controlNodes).children()){
                let info = {name: button.id.split(':')[0], charid: button.id.split('-')[1]};

            }
        };

        this.content = this.frame_t().append(this.body_t());
        renderPlayerList();
    }
    renderProfile(character) {
        let div = $('.display-profile', this.content);
        let selected = div.clone();
        let pframe = this.pframeById(character._id);
        $(selected).append(pframe.content);
        $(this.control_group_t(character)).insertAfter('.foot-info', selected);
        div.replaceWith(selected);



    }
    renderPlayerList(){
        let ul = $('#dm-p-list',this.content).clone();
        this.pFrames.forEach( ( pFrame ) => {
            let pnode = this.player_list_t(pFrame.character);
            $(ul).append(pnode);
        } );

        $('.tracked-items',this.content).replaceWith(ul);
    }
    pframeById(id){
        for(pframe of this.pFrames){
            if(pframe._id == id) return pframe;
        }
        return 0;
    }
}
