class Frame {
    constructor(obj){
        this.params = obj;
        //template is a function, not a string
        this.template = (obj) => {
            return (`
              <div class="card bg-faded" id="`${obj.frameId}`">
                <div class="card-header">
                  ${obj.windowTitle}

                </div>
            <div class="card-block bg-faded `${obj.contextualClasses}`">
            </div>
            `);
        };
        this.content = this.template(obj);
        this.frameId = '#' + this.obj.frameId;
    }
    insertIntoDOM() {
        $(this.content).draggable({
            appendTo: "#drag-container",
            containment: '#drag-container',
            handle: ".card-header"
        });
    }
    hide() {
        $(this.frameId).hide()
    }
    show(){
        $(this.frameId).show();
    }
}
