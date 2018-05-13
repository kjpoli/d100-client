(function addField() {
    let container = document.getElementById('attributeFields');
    let lastField = container.lastElementChild;
    let newFieldNumber = parseInt(lastField.id.susbtr(3)) + 1;
    let newField = lastField.cloneNode(true);
    newField.id = `att${newFieldNumber}`;
    newField.name = `att{newFieldNumber}`;
    container.appendChild(newField);
})();
