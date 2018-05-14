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
