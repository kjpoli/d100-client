class Frame {

    constructor(obj){
        this.pid = window.cid;
        this.cid = window.cid;
        this.frameId = '#blank-frame';
        this.params = obj;
        //template is a function, not a string
        // arrow functions do not re map the this keyword
        // use class members where applicable pass obj for things like filling lists and whatnot
        this.frame_t = (obj) => {
            return $.parseHTML(`
              <div class="card bg-faded" id="${this.frameId}">
                <div class="card-header">
                  ${this.windowTitle}

                </div>
            <div class="card-block bg-faded ${this.contextualClasses}>

            </div>
            `);
        };
        this.content = $.parseHTML(this.frame_t(this.params));
    }
    //only run once per frame on document ready
    // use hide and show after
    insert() {
        $(this.content).draggable({
            appendTo: "#drag-container",
            containment: '#drag-container',
            handle: ".card-header"
        });
    }
    hide() {
        $(this.frameId).hide();
    }
    show(){
        $(this.frameId).show();
    }
}
