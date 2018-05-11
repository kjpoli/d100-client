class FrameProfile extends Frame {
    constructor(obj){
        this.frameId = '#profile-frame';
        this.contextualClasses = 'display-profile';
        this.windowTitlte = 'Character';
        this.character = obj.character;

        this.body_t = (obj) => {
            return $.parseHTML(`
            <i class="ra ${obj.icon} ra-5x"> </i>
            <div class="display-bio">
                <h1 class="entry-header"> ${obj.charName} </h1>
                <hr class="separator" />
                <h4 class="foot-info"> <span class="lvl"> Level ${obj.charLevel} |</span> ${obj.charClass} </h4>
                <ul class="tracked-stats list-group row">
                </ul>
            </div>

        `);
        };
        this.stat_t = (obj) => {
            return $.parseHTML(`
                <li class="list-group-item col-xs> <span class="tracked-stat">${obj.name} :</span>
                <span class="stat-val"> ${obj.val} </span> </li>
            `);
        };
    }
    //replaces ul with recreated stat list
    // pass it char.stats[]
    // TODO: change individual stats without rerendering ul
    renderStats(obj){
        let ul = document.createElement('ul');
        ul.className = 'tracked-stats list-group row';
        obj.forEach( ( stat ) => {
            let statnode = this.stat_t(stat);
            if(stat.primary) $(statnode).addClass('color-inv');
            ul.appendChild(statnode);
        } );

        $('.tracked-stats')[0].replaceWith(ul);
    }


}
