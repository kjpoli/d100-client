class FrameDM extends Frame{
    //pass it the complete list of players
    construtor(players){
        super();

        this.frameId = '#dm-control-frame';
        this.windowTitle = 'Dungeon Master';
        //the player list functions as an inventory
        this.contextualClasses = 'tracked-inv';

        this.pFrames = [];
        for(player of players){
            this.pFrames.push(new FrameProfile(player));
        }

        this.body_t = () => {
            return $.parseHTML(`
              <div id="dm-p-list" class="col-6">
                <ul class="tracked-items list-group">
                </ul>
              </div>
              <div id="dm-display-profile" class="col-6"></div>
            `.trim());
        };

        this.player_list_t = (character) => {
            return $.parseHTML(`
            <li class="list-group-item col-xs color-inv active">
              <i class="ra ${character.icon} item-i"> </i>
              <span class="item-name">${character.name}</span>
              <span class="stat-val"> ${character.level} </span>
            </li>
            `.trim());
        };
    }
    renderPlayerList(){
        let ul = $('.tracked-items',this.content).clone();
        this.character.stats.forEach( ( stat ) => {
            let statnode = this.stat_t(stat);
            if(stat.primary) $(statnode).addClass('color-inv');
            $(ul).append(statnode);
        } );

        $('.tracked-stats',this.content).replaceWith(ul);
    }
}
