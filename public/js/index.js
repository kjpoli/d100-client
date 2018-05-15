var addAtt = document.getElementById('addAttribute');

if (addAtt != null) {
    addAtt.addEventListener('click', (function () {
        // field container
        let container = document.getElementById('attributeFields');
        
        // get the number at the end of the id and inc
        let lastRow = container.lastElementChild;
        let lastRowNum = parseInt(lastRow.id.substr(6));
        let newRowNum = ++lastRowNum;
        
        // clone old field and change id/name
        let newRow = lastRow.cloneNode(true);
        newRow.id = `attRow${newRowNum}`; 

        let newRowBox = newRow.querySelector('.primaryAttBox'); 
        newRowBox.id = `primaryAtt${newRowNum}`;
        newRowBox.name = `primaryAtt${newRowNum}`;
        newRowBox.checked = false;

        let newRowField = newRow.querySelector('.attField');
        newRowField.id = `att${newRowNum}`;
        newRowField.name = `att${newRowNum}`;
        newRowField.value = "";
        
        container.appendChild(newRow);
    }));
}

/*
var primaryAtt = document.getElementsByClass('primaryAttribute');

primaryAtt.addEventListener('click', (function () {

}));*/
