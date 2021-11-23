function createScreen(screenHeading, subHeading) {
    //Creates a new screen with a heading and optional subheading:
    document.getElementById("welcomeScreen").style.display = "none";

    const div = document.getElementById("fitnessInfo");
    div.innerHTML = "";

    const heading = document.createElement("h1");
    heading.textContent = screenHeading;
    div.appendChild(heading);

    if(subHeading != "") {
        const h2 = document.createElement("h2");
        h2.textContent = subHeading;
        div.appendChild(h2);
    }
    return div;
}

function createTable(div, tableCaption) {
    //Creates a table with a given caption
    const table = document.createElement("table");
    div.appendChild(table);
    
    const caption = document.createElement("caption");
    caption.textContent = tableCaption;
    table.appendChild(caption);

    return table;
}

function createTableRow(table) {
    //Creates a new row on a table
    const tableRow = document.createElement("tr");
    table.appendChild(tableRow);
    return tableRow;
}

function createTableHeadingCell(tableRow, headingText) {
    //Creates a heading how in a table row:
    const headingCell = document.createElement("th");
    headingCell.textContent = headingText;
    tableRow.appendChild(headingCell);
    return headingCell;
}

function createNameHeadings(tableHeadingRow) {
    //Put the first and last names of family members in cells in a heading row: 
    for(familyMember of familyMembers) {
        const cell = createTableHeadingCell(tableHeadingRow, familyMember.firstName + " " + familyMember.lastName)
    }
    return;
}

function createTableDataCell(tableRow, cellText, bold1) {
    //Create a cell in a table. Determine if it is bold or not:
    const dataCell = document.createElement("td");
    dataCell.textContent = cellText;
    tableRow.appendChild(dataCell);

    if(bold1 === 1) {
        dataCell.style.fontWeight = 'bold';
    }
    return dataCell;
}  

function generateTableScreen(screenHeading, subHeading, tableCaption) {
    const div = createScreen(screenHeading, subHeading);
    const table = createTable(div, tableCaption);
    const headerRow = createTableRow(table);
    
    return [div, table, headerRow];
}

function createForm(div) {
    const form = document.createElement("form");
    div.appendChild(form);

    return form;
}

function createFieldset(form) {
    const fieldset = document.createElement("fieldset");
    form.appendChild(fieldset);

    return fieldset;
}

function createTextBoxWithLabel(fieldset, labelText, defaultValue) {
    const label = document.createElement("label");
    label.textContent = labelText;
    fieldset.appendChild(label);

    const textbox = document.createElement("input");
    textbox.type = "textbox";
    textbox.value = defaultValue;
    fieldset.appendChild(textbox);

    return textbox;
}

function createButtonDivWithButton(form, submitButtonText) {
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("buttons");
    form.appendChild(buttonDiv);

    const button = document.createElement("button");
    button.textContent = submitButtonText;
    buttonDiv.appendChild(button);

    return button;
}

function createLineBreaks(elementToAppendTo, numberOfLineBreaks) {
    for(let i = 0; i <= numberOfLineBreaks; i++) {
        const linebreak = document.createElement("br");
        elementToAppendTo.appendChild(linebreak);
    }
}

function createCenteredLink(elementToAppend, linkText) {
    const linkDiv = document.createElement("div");
    linkDiv.classList.add("centered_paragraph");
    elementToAppend.appendChild(linkDiv);

    const link = document.createElement("a");
    link.target = "#";
    link.textContent = linkText;
    linkDiv.appendChild(link);

    return link;
}

function displayYes1No0(value) {
    switch(value) {
        case 1: 
            return "Yes";
            break;

        case 0: 
            return "No";
            break;

        default: 
            return undefined;
            break;
    }
}