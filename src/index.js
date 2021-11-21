let familyMembers = [];
let familyMemberIDs = [];
let dailyLogs = [];

function calculateDailyScore(dailyLog) {
    const dailyPoints = dailyLog.foodBalance + dailyLog.foodQuantity + dailyLog.exercise;
        
    switch(dailyPoints) {
        case 3:
            return 5;
            break;

        case 2:
            return 3;
            break;

        default: 
            return 0;
            break;
    }
}

fetch(`http://localhost:3000/familyMembers`) 
    .then((result) => result.json()) 
    .then((allFamilyMembers) => {
        for(let i = 0; i < allFamilyMembers.length; i++) {
            familyMembers[allFamilyMembers[i].id] = {
                firstName: allFamilyMembers[i].firstName, 
                lastName: allFamilyMembers[i].lastName
            }
        
        familyMemberIDs.push(allFamilyMembers[i].id);
        }
    })

fetch(`http://localhost:3000/dailyLogs`) 
    .then((result) => result.json()) 
    .then((allLogs) => {
        for(let i = 0; i < allLogs.length; i++) {
            if(dailyLogs[allLogs[i].familyMemberID] === undefined) {
                dailyLogs[allLogs[i].familyMemberID] = [];
            }

            if(dailyLogs[allLogs[i].familyMemberID][allLogs[i].year] === undefined) {
                dailyLogs[allLogs[i].familyMemberID][allLogs[i].year] = [];
            }
            
            if(dailyLogs[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month] === undefined) {
                dailyLogs[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month] = [];
            }

            dailyLogs[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month][allLogs[i].dateNumber] = {
                foodBalance: allLogs[i].foodBalance, 
                foodQuantity: allLogs[i].foodQuantity, 
                exercise: allLogs[i].exercise, 
                score: calculateDailyScore(allLogs[i])
            };
        }
    })

function createScreen(screenHeading) {
    document.getElementById("welcomeScreen").style.display = "none";

    const div = document.getElementById("fitnessInfo");
    div.innerHTML = "";

    const heading = document.createElement("h1");
    div.appendChild(heading);
    return div;
}

function createTable(div, tableCaption) {
    const table = document.createElement("table");
    div.appendChild(table);
    
    const caption = document.createElement("caption");
    caption.textContent = tableCaption;
    table.appendChild(caption);

    return table;
}

function createTableRow(table) {
    const tableRow = document.createElement("tr");
    table.appendChild(tableRow);
    return tableRow;
}

function createTableHeadingCell(tableRow, headingText) {
    const headingCell = document.createElement("th");
    headingCell.textContent = headingText;
    tableRow.appendChild(headingCell);
    return headingCell;
}

function createTableDataCell(tableRow, cellText) {
    const dataCell = document.createElement("td");
    dataCell.textContent = cellText;
    tableRow.appendChild(dataCell);
    return dataCell;
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

function showFamilyMembers() {
    const screenDiv = createScreen("Show Family Members");
    const table = createTable(screenDiv, "Family Members");
    const headingRow = createTableRow(table);

    const firstNameHeading = createTableHeadingCell(headingRow, "First Name");
    const lastNameHeading = createTableHeadingCell(headingRow, "Last Name");
    const editRowHeading = createTableHeadingCell(headingRow, "");

    for(let i = 0; i < familyMemberIDs.length; i++) {
        const familyMemberRow = createTableRow(table);
        const firstNameCell = createTableDataCell(familyMemberRow, familyMembers[familyMemberIDs[i]].firstName);
        const lastNameCell = createTableDataCell(familyMemberRow, familyMembers[familyMemberIDs[i]].lastName);
        
        const editCell = document.createElement("td");
        familyMemberRow.appendChild(editCell);
        
        const editLink = document.createElement("a");
        editLink.target = "#";
        editLink.textContent = "Edit";
        editLink.id = familyMemberIDs[i];
        editCell.appendChild(editLink);

        editLink.addEventListener("click", (event) => {
            displayEnterEditFamilyMemberForm(event.target.id);
        })
    }

    let link = createCenteredLink(screenDiv, "Create new family member");
    link.addEventListener("click", (event) => {
        displayEnterEditFamilyMemberForm()
    })
}

function displayEnterEditFamilyMemberForm(familyMemberID) {
    let screenHeading;
    let defaultFirstName;
    let defaultLastName
    
    if(familyMemberID != undefined) {
        //There is a family member. In edit mode:
        screenHeading = "Edit Family Member";
        defaultFirstName = familyMembers[familyMemberID].firstName;
        defaultLastName = familyMembers[familyMemberID].lastName;
    }
    else {
        screenHeading = "Add New Family Member";
        defaultFirstName = "";
        defaultLastName = "";
    }
    
    const enterEditFamilyScreen = createScreen(screenHeading);
    const form = createForm(enterEditFamilyScreen);
    form.id = familyMemberID;
    const fieldset = createFieldset(form);

    const firstNameTextbox = createTextBoxWithLabel(fieldset, "First name: ", defaultFirstName);
    const lastNameTextbox = createTextBoxWithLabel(fieldset, "Last name: ", defaultLastName);

    let button = createButtonDivWithButton(form, "Submit");

    if(familyMemberID != undefined) {
        //The family member id is not undefined. we are in edit mode:
        button.id = familyMemberID;
        
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const familyMemberID = event.target.id;
            
            const configurationObject = {
                method: "PATCH",
    
                headers: {
                    "Content-Type": "Application/json", 
                    "Accept": "Application/json"
                },
                body: JSON.stringify({
                    "firstName": firstNameTextbox.value, 
                    "lastName": lastNameTextbox.value
                })
            }
        fetch(`http://localhost:3000/familyMembers/${familyMemberID}`, configurationObject)
            .then((response)=>response.json())
            .then((familyMember) => {
                //Update the array to reflect the new name:
                familyMembers[familyMemberID].firstName = firstNameTextbox.value;
                familyMembers[familyMemberID].lastName = lastNameTextbox.value;

                //Return to the family member form:
                showFamilyMembers();
        })
    })
    }
    else {
        //In enter new contact mode:
        button.addEventListener("click", (event) => {
            event.preventDefault();
            
            const configurationObject = {
                method: "POST",
    
                headers: {
                    "Content-Type": "Application/json", 
                    "Accept": "Application/json"
                },
                body: JSON.stringify({
                    "firstName": firstNameTextbox.value, 
                    "lastName": lastNameTextbox.value
                })
            }
        fetch(`http://localhost:3000/familyMembers`, configurationObject)
            .then((response)=>response.json())
            .then((familyMember) => {
                //Add the new family member to the array of family members:
                const familyMemberID = familyMember.id;
                familyMembers[familyMemberID] = {
                    firstName: familyMember.firstName, 
                    lastName: familyMember.lastName, 
                }

                //Add the id to the list of family member ids:
                familyMemberIDs.push(familyMemberID);

                //Return to the family member form:
                showFamilyMembers();
            })
        })
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("menu_icon").addEventListener("click", (event) => {
        if(document.getElementById("navigationMenu").style.display === "block") {
            //The menu is currently displayed. Hide it:
            document.getElementById("navigationMenu").style.display = "none"
        }
        else {
            //The menu is not displayed. Show it:
            document.getElementById("navigationMenu").style.display = "block";
        }
    })

    document.getElementById("navigationMenu").addEventListener("mouseleave", (event) => {
        document.getElementById("navigationMenu").style.display = "none";
    })

    document.getElementById("menuFamilyMembers").addEventListener("click", (event) => {
        document.getElementById("navigationMenu").style.display = "none";
        showFamilyMembers()
    })
})