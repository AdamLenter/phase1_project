let familyMembers = [];
let familyMemberIDs = [];
let dailyLogs = [];
let totalFamilyMemberScore = [];
let totalFamilyMemberAnnualScore = [];
let totalFamilyMemberMonthlyScore = [];
let startYear = 100000;
let endYear = 0;


function getYYYYMMDDDate(current0yesterday1) {
    const currentDate = new Date();
    const dateOffset = currentDate.getTimezoneOffset();
    const testDate = currentDate.setDate(currentDate.getDate() - current0yesterday1)
    

    const returnDate = new Date(currentDate.getTime() + (dateOffset*60*1000)); 
    return(currentDate.toISOString().split('T')[0]);
}

const currentDate = getYYYYMMDDDate(0);
const yesterdayDate = getYYYYMMDDDate(1);

function getMonths(year) {
    let numberOfDaysInFebruary = 28;

    if(year%4 === 0) {
        //The year is divisible by 4. This is a leap year unless it is divisible by 100:
        if(year%100 === 0) {
            //The year is divisible by 100. It is not a leap year unless it is divisble by 400:
            if(year%400 === 0) {
                //The year is divsible by 400. It is a leap year:
                numberOfDaysInFebruary = 29;
            }
        }
    else {
        //The year is not divisible by 100. It is a leap year:
        numberOfDaysInFebruary = 29;
        }
    }

    const months = [
        {
        monthNumber: 1, 
        monthName: "January", 
        numberOfDays: 31
        },
        {
        monthNumber: 2, 
        monthName: "February", 
        numberOfDays: numberOfDaysInFebruary
        },
        {
        monthNumber: 3, 
        monthName: "March", 
        numberOfDays: 31
        },
        {
        monthNumber: 4, 
        monthName: "April", 
        numberOfDays: 30
        },
        {
        monthNumber: 5, 
        monthName: "May", 
        numberOfDays: 31
        },
        {
        monthNumber: 6, 
        monthName: "June", 
        numberOfDays: 30
        },
        {
        monthNumber: 7, 
        monthName: "July", 
        numberOfDays: 31
        },
        {
        monthNumber: 8, 
        monthName: "August", 
        numberOfDays: 31
        },
        {
        monthNumber: 9, 
        monthName: "September", 
        numberOfDays: 30
        },
        {
        monthNumber: 10, 
        monthName: "October", 
        numberOfDays: 31
        },
        {
        monthNumber: 11, 
        monthName: "November", 
        numberOfDays: 30
        },
        {
        monthNumber: 12, 
        monthName: "December", 
        numberOfDays: 30
        },
    ]
return months;
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

function getInfoFromFamilyMemberAndDate(familyMemberAndDate) {
    let returnData = [];
    returnData["familyMemberID"] = familyMemberAndDate.substring(0, familyMemberAndDate.indexOf("."));
    
    const date = familyMemberAndDate.substring(familyMemberAndDate.indexOf(".") + 1);
    
    returnData["year"] = date.substring(0, date.indexOf("."));
    
    const monthAndDateNumber = date.substring(date.indexOf(".") + 1);
    
    returnData["month"] = monthAndDateNumber.substring(0, monthAndDateNumber.indexOf("."));
    returnData["dateNumber"] = monthAndDateNumber.substring(monthAndDateNumber.indexOf(".") + 1);

    return returnData;
}

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
                totalFamilyMemberMonthlyScore[allLogs[i].familyMemberID][allLogs[i].year] = [];

                //Update the starting and ending years:
                startYear = Math.min(startYear, allLogs[i].year)
                endYear = Math.max(endYear, allLogs[i].year)
            }
            
            if(dailyLogs[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month] === undefined) {
                //The contact doesn't have an array of logs for the current month. Create one: 
                dailyLogs[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month] = [];

                //Also create a monthly total for the month:
                totalFamilyMemberMonthlyScore[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month] = 0;
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
            totalFamilyMemberMonthlyScore[allLogs[i].familyMemberID][allLogs[i].year][allLogs[i].month] += score;
        }
    })

function createScreen(screenHeading, subHeading) {
    document.getElementById("welcomeScreen").style.display = "none";

    const div = document.getElementById("fitnessInfo");
    div.innerHTML = "";

    const heading = document.createElement("h1");
    heading.textContent = screenHeading;
    div.appendChild(heading);

    if(subHeading) {
        const h2 = document.createElement("h2");
        h2.textContent = subHeading;
        div.appendChild(h2);
    }
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
        const yearCell = createTableDataCell(yearRow, year, 1);
        yearCell.id = year;

        yearCell.addEventListener("click", (event) => {
            showYearScoreboard(event.target.id);
        }) 

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

function showYearScoreboard(year) {
    const months = getMonths(year);

    const screenDiv = createScreen("Year Scoreboard - " + year);
    const table = createTable(screenDiv, "Scoreboard");
    const headingRow = createTableRow(table);

    const monthHeading = createTableHeadingCell(headingRow, "Month");
    createNameHeadings(headingRow);

    //Now create rows by month:
    for(let i = 0; i  <= 11; i++) {
        const monthNumber = i+1;
        const monthRow = createTableRow(table);

        //Display the month in a cell:
        const monthCell = createTableDataCell(monthRow, months[i].monthName, 1);
        monthCell.id = `${year}.${monthNumber}`;

        monthCell.addEventListener("click", (event) => {
            showDailyScoreboard(event.target.id);
        }) 

        for(let i = 0; i < familyMemberIDs.length; i++) {
            if(totalFamilyMemberMonthlyScore[familyMemberIDs[i]] && totalFamilyMemberMonthlyScore[familyMemberIDs[i]][year]  && totalFamilyMemberMonthlyScore[familyMemberIDs[i]][year][monthNumber]) {
                //There is a value for the family member and year and month:
                const cell = createTableDataCell(monthRow, totalFamilyMemberMonthlyScore[familyMemberIDs[i]][year][monthNumber]);
            }
            else {
                //There is no value:
                const cell = createTableDataCell(monthRow, "-");
            }
        }
    }

    const totalRow = createTableRow(table)

    const totalCell = createTableDataCell(totalRow, "TOTAL: ", 1);

    for(let i = 0; i < familyMemberIDs.length; i++) {
        if(totalFamilyMemberAnnualScore[familyMemberIDs[i]] && totalFamilyMemberAnnualScore[familyMemberIDs[i]][year]) {
            //There is a value for the family member and year:
            const cell = createTableDataCell(totalRow, totalFamilyMemberAnnualScore[familyMemberIDs[i]][year], 1);
        }
        else {
            //There is no value:
            const cell = createTableDataCell(totalRow, "-", 1);
        }
    }
}

function showDailyScoreboard(yearAndMonth) {
    const year = parseInt(yearAndMonth.substring(0, yearAndMonth.indexOf(".")), 10);
    const monthNumber = parseInt(yearAndMonth.substring(yearAndMonth.indexOf(".") + 1), 10);

    const months = getMonths(year);
    const monthName = months[monthNumber - 1].monthName;

    const screenDiv = createScreen(`Month Scoreboard - ${monthName} ${year}`);
    const table = createTable(screenDiv, "Scoreboard");
    const headingRow = createTableRow(table);

    const dayHeading = createTableHeadingCell(headingRow, "Day");
    createNameHeadings(headingRow);

    //Now create rows by month:
    for(let dateNumber = 0; dateNumber  <= months[monthNumber - 1].numberOfDays; dateNumber++) {
        const dayRow = createTableRow(table);

        //Display the day in a cell:
        const dayCell = createTableDataCell(dayRow, dateNumber, 1);

        for(let i = 0; i < familyMemberIDs.length; i++) {
            if(dailyLogs[familyMemberIDs[i]] && dailyLogs[familyMemberIDs[i]][year] && dailyLogs[familyMemberIDs[i]][year][monthNumber] && dailyLogs[familyMemberIDs[i]][year][monthNumber][dateNumber]) {
                //There is a value for the family member and year and month:
                const cell = createTableDataCell(dayRow);
                const link = document.createElement("a");

                link.targer = "#";
                link.id = `${familyMemberIDs[i]}.${year}.${monthNumber}.${dateNumber}`;
                link.textContent = dailyLogs[familyMemberIDs[i]][year][monthNumber][dateNumber].score;
                cell.appendChild(link);
                link.addEventListener("click", (event) => showLog(event.target.id));
            }
            else {
                //There is no value:
                if(dateNumber < 10) {
                    testDate = `${year}-${monthNumber}-0${dateNumber}`;
                }
                else {
                    testDate = `${year}-${monthNumber}-${dateNumber}`;
                }
                
                if(testDate < yesterdayDate) {
                    //The date is prior to yesterday. Therefore, it cannot be set:
                    const cell = createTableDataCell(dayRow, "(not set)")
                }
                else if(testDate > currentDate) {
                    //The date is after the present date. Therefore, nothing should be displayed:
                    const cell = createTableDataCell(dayRow, "-");
                }
                else {
                    //The date is either yesterday or today. Therefore, it can be set:
                    const cell = createTableDataCell(dayRow);
                    const link = document.createElement("a");
                    link.target = "#";
                    link.id = `${familyMemberIDs[i]}.${year}.${monthNumber}.${dateNumber}`;
                    link.textContent = "click to set";
                    cell.appendChild(link);

                    link.addEventListener("click", (event) => {
                        console.log(event);
                    })
                }                
            }
        }
    }

    const totalRow = createTableRow(table)

    const totalCell = createTableDataCell(totalRow, "TOTAL: ", 1);

    for(let i = 0; i < familyMemberIDs.length; i++) {
        if(totalFamilyMemberMonthlyScore[familyMemberIDs[i]] && totalFamilyMemberMonthlyScore[familyMemberIDs[i]][year] && totalFamilyMemberMonthlyScore[familyMemberIDs[i]][year][monthNumber]) {
            //There is a value for the family member and year:
            const cell = createTableDataCell(totalRow, totalFamilyMemberMonthlyScore[familyMemberIDs[i]][year][monthNumber], 1);
        }
        else {
            //There is no value:
            const cell = createTableDataCell(totalRow, "-", 1);
        }
    }

    createLineBreaks(screenDiv, 5);
}

function showLog(familyMemberAndDate) {
    const info = getInfoFromFamilyMemberAndDate(familyMemberAndDate);
    const months = getMonths(info["year"]);
    
    const monthName = months[info["month"] - 1].monthName;

    const dailyLog = dailyLogs[info["familyMemberID"]][info["year"]][info["month"]][info["dateNumber"]];
    
    const logScreen = createScreen("Daily Log", `${familyMembers[info["familyMemberID"]].firstName} ${familyMembers[info["familyMemberID"]].lastName} - ${monthName} ${info["dateNumber"]}, ${info["year"]} `);

    const paragraph = document.createElement("p");
    logScreen.appendChild(paragraph);

    paragraph.innerHTML = `I ate a healthy balance of food: <strong>${displayYes1No0(dailyLog.foodBalance)}</strong>
        <br />
        I ate an appropriate number of calories: <strong>${displayYes1No0(dailyLog.foodQuantity)}</strong>
        <br /> 
        I exercised vigorously for at least 30 minutes: <strong>${displayYes1No0(dailyLog.exercise)}</strong>
        <br />`;
    
    logScreen.appendChild(paragraph);

    const yesterdayDate = getYYYYMMDDDate(1);
    let testDate;

    if(info["dateNumber"] < 10) {
        testDate = `${info["year"]}-${info["month"]}-0${info["dateNumber"]}`;
    }
    else {
        testDate = `${info["year"]}-${info["month"]}-${info["dateNumber"]}`;
    }
    
    if(testDate >= yesterdayDate) {
        {
            console.log(testDate);
            console.log(yesterdayDate);
        //This is not before yesterday. It can be edited:
        let link = createCenteredLink(logScreen, "Click here to edit");
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