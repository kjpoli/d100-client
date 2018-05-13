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
              <div class="card bg-faded" id="${this.frameId}">
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
        $(this.content).appendTo('#drag-container');
        $(this.content).resizable(this.sizing);
        $(this.content).draggable({
            appendTo: "#drag-container",
            containment: '#drag-container',
            handle: ".card-header"
        });
    }
    hide() {
        $(this.content).hide();
    }
    show(){
        $(this.content).show();
    }
}
