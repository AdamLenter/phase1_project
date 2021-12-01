//Screen to see lifetime performance
function showOverallScoreboard() {
    let startingYear = 100000;
    let endingYear = 0;

    for(familyMember of familyMembers) {
        startingYear = familyMember.logs.reduce((accumulator, log) => {
            return Math.min(accumulator, log.year);
        }, startingYear)

        endingYear = familyMember.logs.reduce((accumulator, log) => {
            return Math.max(accumulator, log.year);
        }, endingYear)
    }

    //Create a screen for the table:
    const tableScreen = generateTableScreen("Overall Scoreboard", "", "Scoreboard");

    //Create a header row with "Year" in the first column with a link to data for the year:
    const headerRow = createTableRow(tableScreen[2]);
    const yearHeaderCell = createTableHeadingCell(headerRow, "Year");
    
    createNameHeadings(headerRow);

    //Now Cycle through the years and show the contact's totals for the year:
    for(let year = startingYear; year <= endingYear; year++) {
        const dataRow = createTableRow(tableScreen[2]);

        //Add a cell for the year:
        const yearCell = createTableDataCell(dataRow, year, 1);
        yearCell.id = year;
        yearCell.addEventListener("click", (event) => displayAnnualPerformance(event.target.id));

        //Now add cells for the individuals' total scores:
        for(familyMember of familyMembers) {
            const familyMemberYearLogs = familyMember.logs.filter((log) => log.year === year);
            
            if(familyMemberYearLogs != undefined) {
                //There is at least one element in the row. Find the total:
                createTableDataCell(dataRow, createTotalScoreFromGroupOfLogs(familyMemberYearLogs));
            }
            else {
                //The family member does not have any logs:
                createTableDataCell(dataRow, 0);
            }
        }
    }

    //Now create a total row:
    const totalRow = createTableRow(tableScreen[2]);
    const totalCell = createTableDataCell(totalRow, "TOTAL: ", 1);

    //Provide a total cell for each family member:
    for(familyMember of familyMembers) {
        createTableDataCell(totalRow, createTotalScoreFromGroupOfLogs(familyMember.logs), 1);
    }
}

//Screen to see single year performance
function displayAnnualPerformance(year) {
    //Get the months for the year:
    const months = getMonths(year);

    //Create a screen for the table:
    const tableScreen = generateTableScreen(`Single Year Scoreboard - ${year}`, "", "Scoreboard");

    //Create a header row with "Month" in the first column with a link to data for the year:
    const headerRow = createTableRow(tableScreen[2]);
    const yearHeaderCell = createTableHeadingCell(headerRow, "Month");
    
    //We are going to cycle through the family members, making a header row with their names and creating a total score:
    let totalScore = [];
    
    for(familyMember of familyMembers) {
        createTableHeadingCell(headerRow, `${familyMember.firstName} ${familyMember.lastName}`);
        totalScore[familyMember.id] = 0;
    }

    //Now Cycle through the months and show the contact's totals for the month:
    for(let i = 0; i < 12; i++) {
        const dataRow = createTableRow(tableScreen[2]);

        //Add a cell for the month:
        const monthCell = createTableDataCell(dataRow, months[i].monthName, 1);
        monthCell.id = `${i + 1}.${year}`;
        monthCell.addEventListener("click", (event) => displayDailyPerformance(event.target.id));

        //Now add cells for the individuals' total scores:
        for(const familyMember of familyMembers) {
            const familyMemberMonthLogs = familyMember.logs.filter((log) => log.year == year && log.month === (i + 1));
            
            if(familyMemberMonthLogs) {
                //There is at least one element in the row. Find the total:
                monthScore = createTotalScoreFromGroupOfLogs(familyMemberMonthLogs);
                createTableDataCell(dataRow, monthScore);

                //Add the month score to the individual's total:
                totalScore[familyMember.id] += monthScore;
            }
            else {
                //The family member does not have any logs:
                createTableDataCell(dataRow, 0);
            }
        }
    }
    //Now create a total row:
    const totalRow = createTableRow(tableScreen[2]);
    const totalCell = createTableDataCell(totalRow, "TOTAL: ", 1);

    //Provide a total cell for each family member:
    for(familyMember of familyMembers) {
        createTableDataCell(totalRow, totalScore[familyMember.id], 1);
    }

    createLineBreaks(tableScreen[0], 1);
    const returnLink = createCenteredLink(tableScreen[0], "Return to previous screen");
    returnLink.addEventListener("click", (event) => showOverallScoreboard());
    createLineBreaks(tableScreen[0], 5);
}

//Screen to see single month performance
function displayDailyPerformance(monthAndYear) {
    //Get the month and year:
    const month = parseInt(monthAndYear.substring(0, monthAndYear.indexOf(".")), 10);
    const year = monthAndYear.substring(monthAndYear.indexOf(".") + 1);

    //Get the months for the year:
    const months = getMonths(year);

    //We need to get the previous date and current date:
    const currentDate = getYYYYMMDDDate(0);
    const yesterdayDate = getYYYYMMDDDate(1);

    //Create a screen for the table:
    const tableScreen = generateTableScreen(`Single Month Scoreboard - ${months[month - 1].monthName} ${year}`, "", "Scoreboard");

    //Create a header row with "Date" in the first column with a link to data for the year:
    const headerRow = createTableRow(tableScreen[2]);
    const yearHeaderCell = createTableHeadingCell(headerRow, "Date");
    
    //We are going to cycle through the family members, making a header row with their names and creating a total score:
    let totalScore = [];
    
    for(familyMember of familyMembers) {
        createTableHeadingCell(headerRow, `${familyMember.firstName} ${familyMember.lastName}`);
        totalScore[familyMember.id] = 0;
    }

    //Now Cycle through the months and show the contact's totals for the month:
    let dailyScore;
    let testDate;

    let testMonth;
    if(month < 10) {
        //The month is single digit. Make add a 0 for the test:
        testMonth = `0${month}`;
    }
    else {
        //The month is double digit:
        testMonth = `${month}`;
    }

    for(let i = 0; i < months[month - 1].numberOfDays; i++) {
        const dataRow = createTableRow(tableScreen[2]);

        //Add a cell for the month:
        const dateCell = createTableDataCell(dataRow, i + 1, 1);
        
        //Now add cells for the individuals' total scores:
        for(familyMember of familyMembers) {
            const familyMemberDateLog = (familyMember.logs.find((log) => log.year == year && log.month === month && log.dateNumber === (i + 1)));
            
            if(familyMemberDateLog != undefined) {
                //There is a score. Display it:
                dailyScore = calculateDailyScore(familyMemberDateLog)
                const dailyScoreCell = createTableDataCell(dataRow, "");
                const dailyScoreLink = document.createElement("a");
                dailyScoreLink.id = `${familyMember.id}.${year}.${month}.${(i+1)}`;
                dailyScoreLink.target = "#";
                dailyScoreLink.textContent = dailyScore;
                dailyScoreCell.appendChild(dailyScoreLink);
                
                dailyScoreLink.addEventListener("click", (event) => displaySingleDayPerformance(event.target.id));
                //Add the date score to the individual's total:
                totalScore[familyMember.id] += dailyScore;
            }
            else {
                //The family member does not have a date score:
                if(i < 9) {
                    testDate = `${year}-${testMonth}-0${i + 1}`;
                }
                else {
                    testDate = `${year}-${testMonth}-${i + 1}`;
                }
                if(testDate < yesterdayDate) {
                    //There is no score, but it can't be set anymore:
                    createTableDataCell(dataRow, "(not set)");
                }
                else if(testDate > currentDate) {
                    //This is a future date:
                    createTableDataCell(dataRow, "-");
                }
                else {
                    //The score is not set but it can be:
                    const setScoreCell = createTableDataCell(dataRow, "");
                    const setScoreLink = document.createElement("a");
                    setScoreLink.id = `${familyMember.id}.${year}.${month}.${(i+1)}`;
                    setScoreLink.target = "#";
                    setScoreLink.textContent = "click to set";
                    setScoreCell.appendChild(setScoreLink);
                    
                    setScoreLink.addEventListener("click", (event) => displayEnterEditDailyLogForm(event.target.id, 1));
                }
            }
        }
    }
   
    //Now create a total row:
    const totalRow = createTableRow(tableScreen[2]);
    const totalCell = createTableDataCell(totalRow, "TOTAL: ", 1);

    //Provide a total cell for each family member:
    for(familyMember of familyMembers) {
        createTableDataCell(totalRow, totalScore[familyMember.id], 1);
    }

    createLineBreaks(tableScreen[0], 1);
    const returnLink = createCenteredLink(tableScreen[0], "Return to previous screen");
    returnLink.addEventListener("click", (event) => displayAnnualPerformance(year));
    createLineBreaks(tableScreen[0], 5);
}

function displaySingleDayPerformance(familyMemberAndDate) {
    const info = getInfoFromFamilyMemberAndDate(familyMemberAndDate);
    const months = getMonths(info["year"]);
    
    const monthName = months[info["month"] - 1].monthName;

    //Get the family member's logs:
    const familyMemberLogs = familyMembers.find((familyMember) => familyMember.id == info["familyMemberID"]);

    const dailyLog = familyMemberLogs.logs.find((log) => log.year == info["year"] && log.month == info["month"] && log.dateNumber == info["dateNumber"]);

    const logScreen = createScreen("Daily Log", `${familyMemberLogs.firstName} ${familyMemberLogs.lastName} - ${monthName} ${info["dateNumber"]}, ${info["year"]} `);

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

    let testMonth;
    let testDateNumber;

    if(info["month"] < 10) {
        testMonth = `0${info["month"]}`;
    }
    else {
        testMonth = `${info["dateMonth"]}`;
    }
    
    if(info["dateNumber"] < 10) {
        testDateNumber = `0${info["dateNumber"]}`;
    }
    else {
        testDateNumber = `${info["dateNumber"]}`;
    }

    const testDate = `${info.year}-${testMonth}-${testDateNumber}`;

    if(testDate >= yesterdayDate) {
        {
        //This is not before yesterday. It can be edited:
        const link = createCenteredLink(logScreen, "Click here to edit");
        link.id = familyMemberAndDate;

        link.addEventListener("click", (event) => displayEnterEditDailyLogForm(event.target.id, 2));
        }
    }

    createLineBreaks(logScreen, 1);
    let previousScreenLink = createCenteredLink(logScreen, "Return to previous screen");
    previousScreenLink.id = `${info["month"]}.${info["year"]}`;
    previousScreenLink.addEventListener("click", (event) => displayDailyPerformance(event.target.id));
}

function showFamilyMembers() {
    const tableScreen = generateTableScreen("Family Members", "", "Family Member Info");
    //Create a header row with "Year" in the first column with a link to data for the year:
    const headerRow = createTableRow(tableScreen[2]);
    const firstNameHeaderCell = createTableHeadingCell(headerRow, "First Name");
    const lastNameHeaderCell = createTableHeadingCell(headerRow, "Last Name");
    const editHeaderCell = createTableHeadingCell(headerRow);

    for(familyMember of familyMembers) {
        const dataRow = createTableRow(tableScreen[2]);

        //Add a cell for the year:
        const firstNameCell = createTableDataCell(dataRow, familyMember['firstName']);
        const lastNameCell = createTableDataCell(dataRow, familyMember['lastName']);
        const editCell = createTableDataCell(dataRow, "");

        const editLink = document.createElement("a");
        editLink.textContent = "edit";
        editLink.id = familyMember.id;
        editCell.appendChild(editLink);

        editCell.addEventListener("click", (event) => displayEnterEditFamilyMemberForm(event.target.id));
    }

    createLineBreaks(tableScreen[0], 1);

    let link = createCenteredLink(tableScreen[0], "Create new family member");
    link.addEventListener("click", (event) => {
        displayEnterEditFamilyMemberForm()
    })
}