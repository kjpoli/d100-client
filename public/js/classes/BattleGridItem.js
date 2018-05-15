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
