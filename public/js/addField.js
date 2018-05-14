(function addField() {
    let container = document.getElementById('attributeFields');
    let lastField = container.lastElementChild;
    let lastFieldId = lastField.id;
    let newFieldIdStr = lastFieldId.substr(3);
    let newFieldNumber = newFieldIdStr.substr(3);
    let newField = lastField.cloneNode(true);
    newField.id = `att${newFieldNumber}`;
    newField.name = `att{newFieldNumber}`;
    container.appendChild(newField);
})();
