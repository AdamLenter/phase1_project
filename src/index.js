let familyMembers = [];
let familyMemberIDs = [];
let dailyLogs = [];
let totalFamilyMemberScore = [];
let totalFamilyMemberAnnualScore = [];
let totalFamilyMemberMonthlyScore = [];
let startYear = 100000;
let endYear = 0;

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
            const score = calculateDailyScore(allLogs[i]);
            
            if(dailyLogs[allLogs[i].familyMemberID] === undefined) {
                //The family member does not have a list of logs yet:
                dailyLogs[allLogs[i].familyMemberID] = [];
                totalFamilyMemberScore[allLogs[i].familyMemberID] = 0;

                //Create an annual and monthly score array:
                totalFamilyMemberAnnualScore[allLogs[i].familyMemberID] = [];
                totalFamilyMemberMonthlyScore[allLogs[i].familyMemberID] = [];
            }

            if(dailyLogs[allLogs[i].familyMemberID][allLogs[i].year] === undefined) {
                //The family member does not have a list of logs for the given year. Create one.
                dailyLogs[allLogs[i].familyMemberID][allLogs[i].year] = [];

                //Create an annual total for the year:
                totalFamilyMemberAnnualScore[allLogs[i].familyMemberID][allLogs[i].year] = 0;

                //Update the starting and ending years:
                startYear = Math.min(startYear, allLogs[i].year)
                endYear = Math.max(endYear, allLogs[i].year)
            }
            
            if(dailyLogs[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month] === undefined) {
                dailyLogs[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month] = [];
            }

            //Now add the log to the appropriate array:
            dailyLogs[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month][allLogs[i].dateNumber] = {
                foodBalance: allLogs[i].foodBalance, 
                foodQuantity: allLogs[i].foodQuantity, 
                exercise: allLogs[i].exercise, 
                score: score
            };

            //Add the score to all of the appropriate totals:
            totalFamilyMemberScore[allLogs[i].familyMemberID] += score;
            totalFamilyMemberAnnualScore[allLogs[i].familyMemberID][allLogs[i].year] += score;
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

function createNameHeadings(tableHeadingRow) {
    for(let i = 0; i < familyMemberIDs.length; i++) {
        const cell = createTableHeadingCell(tableHeadingRow, familyMembers[familyMemberIDs[i]].firstName + " " + familyMembers[familyMemberIDs[i]].lastName)
    }
    return;
}

function createTableDataCell(tableRow, cellText, bold1) {
    const dataCell = document.createElement("td");
    dataCell.textContent = cellText;
    tableRow.appendChild(dataCell);

    if(bold1 === 1) {
        dataCell.style.fontWeight = 'bold';
    }
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

    createLineBreaks(screenDiv, 1);

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

function showOverallScoreboard() {
    const screenDiv = createScreen("Lifetime Scoreboard");
    const table = createTable(screenDiv, "Scoreboard");
    const headingRow = createTableRow(table);

    const yearHeading = createTableHeadingCell(headingRow, "Year");
    createNameHeadings(headingRow);

    //Now create rows by year:
    for(let year = startYear; year <= endYear; year++) {
        const yearRow = createTableRow(table);

        //Display the year in a cell:
        const yearCell = createTableDataCell(yearRow, year);

        for(let i = 0; i < familyMemberIDs.length; i++) {
            if(totalFamilyMemberAnnualScore[familyMemberIDs[i]] && totalFamilyMemberAnnualScore[familyMemberIDs[i]][year]) {
                //There is a value for the family member and year:
                const cell = createTableDataCell(yearRow, totalFamilyMemberAnnualScore[familyMemberIDs[i]][year]);
            }
            else {
                //There is no value:
                const cell = createTableDataCell(yearRow, "-");
            }
        }
    }

    const totalRow = createTableRow(table)

    const totalCell = createTableDataCell(totalRow, "TOTAL: ", 1);

    for(let i = 0; i < familyMemberIDs.length; i++) {
        if(totalFamilyMemberScore[familyMemberIDs[i]]) {
            //There is a value for the family member and year:
            const cell = createTableDataCell(totalRow, totalFamilyMemberScore[familyMemberIDs[i]], 1);
        }
        else {
            //There is no value:
            const cell = createTableDataCell(totalRow, "-", 1);
        }
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

    document.getElementById("menuOverallScoreboard").addEventListener("click", (event) => {
        document.getElementById("navigationMenu").style.display = "none";
        showOverallScoreboard()
    })
})