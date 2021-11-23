document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    
    const familyMemberDailyLogs = [];
    const yearlyScore = [];
    let startingYear = 100000;
    let endingYear = 0;
    
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

    function getDailyLogFromDetials(dailyLogs, familyMemberID, year, monthNumber, dateNumber) {
        for(let j = 0; j < dailyLogs.length; j++) {
            if(dailyLogs[j].familyMemberID == familyMemberID && dailyLogs[j].year == year && dailyLogs[j].month == monthNumber && dailyLogs[j].dateNumber == dateNumber) {
                //This is the correct value. Return it.
                return dailyLogs[j];
            }
        }
    }
        
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
    });

    function showFamilyMembers() {
        fetch(`http://localhost:3000/familyMembers`) 
        .then((result) => result.json()) 
        .then((familyMembers) => {
            const familyMembersTable = createTableScreen("Family Members", ["First Name", "Last Name", ""]);

            for(let i = 0; i < familyMembers.length; i++) {
                const familyMemberRow = document.createElement("tr");
                familyMembersTable.appendChild (familyMemberRow);

                const firstName = document.createElement("td");
                firstName.textContent = familyMembers[i].firstName;
                familyMemberRow.appendChild(firstName);

                const lastName = document.createElement("td");
                lastName.textContent = familyMembers[i].lastName;
                familyMemberRow.appendChild(lastName);

                const editLinkCell = document.createElement("td");
                familyMemberRow.appendChild(editLinkCell);

                const editLink = document.createElement("a");
                editLink.target = "#";
                editLink.textContent = "edit";
                editLink.id = familyMembers[i].id
                editLinkCell.appendChild(editLink);

                editLink.addEventListener("click", (event) => {
                    showEditFamilYMemberForm(event.target.id);
                })
            }

            const content = document.getElementById("content");
            
            const linebreak = document.createElement("br");
            content.appendChild(linebreak);

            const addContactDiv = document.createElement("div");
            addContactDiv.classList.add("centered_paragraph");
            content.appendChild(addContactDiv);

            const addContactLink = document.createElement("a");
            addContactLink.textContent = "Add a new family member";
            addContactDiv.appendChild(addContactLink);

            addContactLink.addEventListener("click", (event) => displayEnterEditFamilyMemberForm())
        })
    }

    function showEditFamilYMemberForm(familyMemberID) {
        fetch(`http://localhost:3000/familyMembers/${familyMemberID}`) 
            .then((result) => result.json()) 
            .then((familyMember) => { 
                displayEnterEditFamilyMemberForm(familyMember);
            })
    }

    function displayEnterEditFamilyMemberForm(familyMember) {
        let screenHeading;
        let defaultFirstName;
        let defaultLastName
        
        if(typeof familyMember != "undefined") {
            //There is a family member. In edit mode:
            screenHeading = "Edit Family Member";
            defaultFirstName = familyMember.firstName;
            defaultLastName = familyMember.lastName;
        }
        else {
            screenHeading = "Add New Family Member";
            defaultFirstName = "";
            defaultLastName = "";
        }
        
        const screenContent = document.getElementById("content");

        screenContent.innerHTML = "";
        
        const screenH1 = document.createElement("h1");
        screenH1.textContent = screenHeading;
        screenContent.appendChild(screenH1);

        const form = document.createElement("form");
        screenContent.appendChild(form);

        const fieldset = document.createElement("fieldset");
        form.appendChild(fieldset);

        const firstNameLabel = document.createElement("label");
        firstNameLabel.textContent = "First name: ";
        fieldset.appendChild(firstNameLabel);

        const firstNameInput = document.createElement("input");
        firstNameInput.type = "textbox";
        firstNameInput.value = defaultFirstName;
        fieldset.appendChild(firstNameInput);

        const lastNameLabel = document.createElement("label");
        lastNameLabel.textContent = "Last name: ";
        fieldset.appendChild(lastNameLabel);

        const lastNameInput = document.createElement("input");
        lastNameInput.type = "textbox";
        lastNameInput.value = defaultLastName;
        fieldset.appendChild(lastNameInput);

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("buttons");
        form.appendChild(buttonDiv);

        const button = document.createElement("button");
        button.textContent = "Submit";

        if(typeof familyMember != "undefined") {
            //In edit mode.
            button.id = familyMember.id;
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const configurationObject = {
                    method: "PATCH",
        
                    headers: {
                        "Content-Type": "Application/json", 
                        "Accept": "Application/json"
                    },
                    body: JSON.stringify({
                        "firstName": firstNameInput.value, 
                        "lastName": lastNameInput.value
                    })
                }
            fetch(`http://localhost:3000/familyMembers/${event.target.id}`, configurationObject)
                .then((response)=>response.json())
                .then((familyMember) => {
                    showFamilyMembers();
            })
        })
        }
        else {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                
                const configurationObject = {
                    method: "POST",
        
                    headers: {
                        "Content-Type": "Application/json", 
                        "Accept": "Application/json"
                    },
                    body: JSON.stringify({
                        "firstName": firstNameInput.value, 
                        "lastName": lastNameInput.value
                    })
                }
            fetch(`http://localhost:3000/familyMembers`, configurationObject)
                .then((response)=>response.json())
                .then((familyMember) => {
                    showFamilyMembers();
                })
            })
        }

        buttonDiv.appendChild(button)
    }

    document.getElementById("menuOverallScoreboard").addEventListener("click", (event) => {
        document.getElementById("navigationMenu").style.display = "none";
        showOverallScoreboard()
    });

    function showOverallScoreboard() {
        fetch(`http://localhost:3000/familyMembers`) 
        .then((result) => result.json()) 
        .then((familyMembers) => { 
            fetch(`http://localhost:3000/dailyLogs`) 
                .then((result) => result.json()) 
                .then((dailyLogs) => {
                    for(let j = 0; j < dailyLogs.length; j++) {
                        if(typeof yearlyScore[dailyLogs[j].familyMemberID] === "undefined") {
                            //We don't have a yearly score array for this contact yet:
                            yearlyScore[dailyLogs[j].familyMemberID] = [];
                        }
                        
                        if(typeof yearlyScore[dailyLogs[j].familyMemberID][dailyLogs[j].year] === "undefined") {
                            //We don't have a yearly score for this contact and year:
                            yearlyScore[dailyLogs[j].familyMemberID][dailyLogs[j].year] = calculateDailyScore(dailyLogs[j]);
                        }
                        else {
                            //We have a value. Add this to it:
                            yearlyScore[dailyLogs[j].familyMemberID][dailyLogs[j].year] += calculateDailyScore(dailyLogs[j]);
                        }

                    startingYear = Math.min(startingYear, dailyLogs[j].year);
                    endingYear = Math.max(endingYear, dailyLogs[j].year);
                    }

                displayOverallScoreboard(familyMembers, yearlyScore, startingYear, endingYear);
                })
            })
        }

    function createTableScreen(screenHeading, tableHeadings) {
        const tableScreenContent = document.getElementById("content");
        
        tableScreenContent.innerHTML = "";
        
        const screenH1 = document.createElement("h1");
        screenH1.textContent = screenHeading;
        tableScreenContent.appendChild(screenH1);

        const table = document.createElement("table");
        tableScreenContent.appendChild(table);

        const tableHeaderRow = document.createElement("tr");
        table.appendChild(tableHeaderRow);

        for(let i = 0; i < tableHeadings.length; i++) {
            const tableHeadingCell = document.createElement("th");
            tableHeadingCell.textContent = tableHeadings[i];
            tableHeaderRow.appendChild(tableHeadingCell);
        }
        return table;
    }

    function createTotalRow(table, totalRowData) {
        const totalRow = document.createElement("tr");
        table.appendChild(totalRow);

        const totalLabel = document.createElement("td");
        totalLabel.innerHTML = "<b>TOTAL:</b>";
        totalRow.appendChild(totalLabel);

        for(let i = 0; i < totalRowData.length; i++) {
            const totalRowCell = document.createElement("td");
            totalRowCell.innerHTML = `<b>${totalRowData[i]}</b>`;
            totalRow.appendChild(totalRowCell);
            }
        }

    function displayOverallScoreboard(familyMembers, yearlyScore, startingYear, endingYear) {
        const totalScore = [];
        
        const tableHeadings = [];

        tableHeadings.push("Year");

        for(let i = 0; i < familyMembers.length; i++) {
            tableHeadings.push(familyMembers[i].firstName + " " + familyMembers[i].lastName);
            totalScore[familyMembers[i].id] = 0;
        }

        const yearlyScoreTable = createTableScreen("Overall Scoreboard", tableHeadings);

        for(let currentYear = startingYear; currentYear <= endingYear; currentYear++) {
            const yearRow = document.createElement("tr");
            yearlyScoreTable.appendChild(yearRow);

            const yearCell = document.createElement("th");
            yearCell.id = `yearStatistics${currentYear}`;
            yearCell.textContent = currentYear;
            yearRow.appendChild(yearCell);
            yearCell.addEventListener("click", (event) => {
                const year = event.target.id.substring(14);
                showYearStatistics(year)
            });

            for(let z = 0; z < familyMembers.length; z++) {
                const scoreCell = document.createElement("td");
                
                if(typeof yearlyScore[familyMembers[z].id] === "undefined" || typeof yearlyScore[familyMembers[z].id][currentYear] === "undefined") {
                    //The family member does not have a score or the year:
                    scoreCell.textContent = 0;
                }
                else {
                    //The family member has a score:
                    scoreCell.textContent = yearlyScore[familyMembers[z].id][currentYear];
                    totalScore[familyMembers[z].id] += yearlyScore[familyMembers[z].id][currentYear];
                }
                yearRow.appendChild(scoreCell);
            }
        }

        //Create the total row:
        const totalCells = []
        for(q = 0; q < familyMembers.length; q++) {
            totalCells.push(totalScore[familyMembers[q].id]);
        }
        createTotalRow(yearlyScoreTable, totalCells);
    }

    function showYearStatistics(year) {
        const monthlyScore = [];

        fetch(`http://localhost:3000/familyMembers`) 
        .then((result) => result.json()) 
        .then((familyMembers) => { 
            for(i = 0; i < familyMembers.length; i++) {
                monthlyScore[familyMembers[i].id] = [];
            }

            fetch(`http://localhost:3000/dailyLogs`) 
                .then((result) => result.json()) 
                .then((dailyLogs) => {
                    for(j = 0; j < dailyLogs.length; j++) {
                        if(dailyLogs[j].year == year) {
                            //This is a year match.
                            if(typeof monthlyScore[dailyLogs[j].familyMemberID] === "undefined") {
                                //We do not have this array yet. Declare it:
                                monthlyScore[dailyLogs[j].familyMemberID] = [];
                            }
                            if(typeof monthlyScore[dailyLogs[j].familyMemberID][dailyLogs[j].month] === "undefined") {
                                //There is no count for this row:
                                monthlyScore[dailyLogs[j].familyMemberID][dailyLogs[j].month] = calculateDailyScore(dailyLogs[j]);
                            }
                            else{
                                //it already exists. add it to the total:
                                monthlyScore[dailyLogs[j].familyMemberID][dailyLogs[j].month] += calculateDailyScore(dailyLogs[j]);
                            }
                        }
                    }
                displayYearStatistics(year, familyMembers, monthlyScore);
            })
        })
    }

    function displayYearStatistics(year, familyMembers, monthlyScore) {
        const totalScore = [];
        
        const tableHeadings = [];

        tableHeadings.push("Month");

        months = getMonths(year);

        for(let i = 0; i < familyMembers.length; i++) {
            tableHeadings.push(familyMembers[i].firstName + " " + familyMembers[i].lastName);
            totalScore[familyMembers[i].id] = 0;
        }

        const monthylScoreTable = createTableScreen(`Monthly Scoreboard - ${year}`, tableHeadings);

        for(let currentMonth = 1; currentMonth <= 12; currentMonth++) {
            const monthRow = document.createElement("tr");
            monthylScoreTable.appendChild(monthRow);

            const monthCell = document.createElement("th");
            monthCell.id = `monthStatistics${currentMonth}.${year}`;
            monthCell.textContent = months[currentMonth - 1].monthName;
            monthRow.appendChild(monthCell);
            monthCell.addEventListener("click", (event) => {
                const month = event.target.id.substring(15, event.target.id.indexOf("."));
                const year = event.target.id.substring(event.target.id.indexOf(".") + 1);
                showMonthStatistics(year, month);
            });

            for(let z = 0; z < familyMembers.length; z++) {
                const scoreCell = document.createElement("td");
                
                if(typeof monthlyScore[familyMembers[z].id] === "undefined" || typeof monthlyScore[familyMembers[z].id][currentMonth] === "undefined") {
                    //The family member does not have a score or the month:
                    scoreCell.textContent = 0;
                }
                else {
                    //The family member has a score:
                    scoreCell.textContent = monthlyScore[familyMembers[z].id][currentMonth];
                    totalScore[familyMembers[z].id] += monthlyScore[familyMembers[z].id][currentMonth];
                }
                monthRow.appendChild(scoreCell);
            }
        }

        const totalRowData = [];
        for(let q = 0; q < familyMembers.length; q++) {
            totalRowData.push(totalScore[familyMembers[q].id])
        }

        createTotalRow(monthylScoreTable, totalRowData);

        const content = document.getElementById("content");

        const linebreak = document.createElement("br");
        content.appendChild(linebreak);

        const returnLinkDiv = document.createElement("div");
        returnLinkDiv.classList.add("centered_paragraph");
        content.appendChild(returnLinkDiv);

        const returnLink = document.createElement("a");
        returnLink.target = "#";
        returnLink.textContent = `Return to the overall scoreboard`;
        returnLinkDiv.appendChild(returnLink);

        returnLink.addEventListener("click", (event) => showOverallScoreboard());
    }

    function showMonthStatistics(year, month) {
        fetch(`http://localhost:3000/familyMembers`) 
        .then((result) => result.json()) 
        .then((familyMembers) => { 
            const dailyScore = [];

            for(i = 0; i < familyMembers.length; i++) {
                dailyScore[familyMembers[i].id] = [];
            }

            fetch(`http://localhost:3000/dailyLogs`) 
                .then((result) => result.json()) 
                .then((dailyLogs) => {
                    for(j = 0; j < dailyLogs.length; j++) {
                        if(dailyLogs[j].year == year && dailyLogs[j].month == month) {
                            //This is a year and month match.
                            dailyScore[dailyLogs[j].familyMemberID][dailyLogs[j].dateNumber] = calculateDailyScore(dailyLogs[j]); 
                        }
                    }
                    displayMonthStatistics(year, month, familyMembers, dailyScore);
            })
        })
    }

    function displayMonthStatistics(year, monthNumber, familyMembers, dailyScore) {
        const months = getMonths(year);
        let monthName;
        let numberOfDays;

        const dailyRecord = [];

        const currentDate = getYYYYMMDDDate(0);
        const yesterdayDate = getYYYYMMDDDate(1);
        let testDate;

        for(let i = 0; i < months.length; i++) {
            if(months[i].monthNumber == monthNumber) {
                //This is the current Month:
                monthName = months[i].monthName;
                numberOfDays = months[i].numberOfDays;
                break;
            }
        }
        
        const tableHeadings = [];
        const totalScore = [];

        tableHeadings.push("Date");

        for(let i = 0; i < familyMembers.length; i++) {
            tableHeadings.push(familyMembers[i].firstName + " " + familyMembers[i].lastName);
            totalScore[familyMembers[i].id] = 0;
        }

        const monthScoreTable = createTableScreen(`Scoreboard ${monthName} ${year}`, tableHeadings);

        //Create rows:
        for(dateNumber = 1; dateNumber <= numberOfDays; dateNumber++) {
            const dateRow = document.createElement("tr");
            monthScoreTable.appendChild(dateRow);

            const dateLabel = document.createElement("th");
            dateLabel.textContent = dateNumber;
            dateRow.appendChild(dateLabel);

            for(j = 0; j < familyMembers.length; j++) {
                const scoreCell = document.createElement("td");
                dateRow.appendChild(scoreCell);
                
                if(typeof dailyScore[familyMembers[j].id] === "undefined" || typeof dailyScore[familyMembers[j].id][dateNumber] === "undefined") {
                    //There is no  record:
                    if(dateNumber < 10) {
                        testDate = `${year}-${monthNumber}-0${dateNumber}`;
                    }
                    else {
                        testDate = `${year}-${monthNumber}-${dateNumber}`;
                    }
                    
                    if(testDate < yesterdayDate) {
                        scoreCell.textContent = "(not set)";
                    }
                    else if(testDate > currentDate) {
                        scoreCell.textContent = "-";
                    }
                    else {
                        const scoreCellLink = document.createElement("a");
                        scoreCellLink.Target = "#";
                        scoreCellLink.innerHTML = "set";
                        scoreCell.appendChild(scoreCellLink);
                        scoreCellLink.id = `${year}_${monthNumber}_${monthName}_${dateNumber}_${familyMembers[j].id}`;
                        scoreCellLink.addEventListener("click", (event) => displayEnterEditDailyLog(event.target.id, 1));
                    }
                }
                else {
                    //There is a value:
                    const scoreCellLink = document.createElement("a");
                    scoreCellLink.Target = "#";
                    scoreCellLink.innerHTML = `${dailyScore[familyMembers[j].id][dateNumber]}`;
                    scoreCell.appendChild(scoreCellLink);
                    scoreCellLink.id = `${year}_${monthNumber}_${monthName}_${dateNumber}_${familyMembers[j].id}`;
                    scoreCellLink.addEventListener("click", (event) => showDailyLog(event.target.id));

                    totalScore[familyMembers[j].id] += dailyScore[familyMembers[j].id][dateNumber];
                }
            }
        }
    //Create the total row:
    const totalCells = []
    for(q = 0; q < familyMembers.length; q++) {
        totalCells.push(totalScore[familyMembers[q].id]);
    }
    createTotalRow(monthScoreTable, totalCells);

    const content = document.getElementById("content");

    const linebreak = document.createElement("br");
    content.appendChild(linebreak);

    const returnLinkDiv = document.createElement("div");
    returnLinkDiv.classList.add("centered_paragraph");
    content.appendChild(returnLinkDiv);

    const returnLink = document.createElement("a");
    returnLink.target = "#";
    returnLink.textContent = `Return to ${year} scoreboard`;
    returnLinkDiv.appendChild(returnLink);

    returnLink.addEventListener("click", (event) => showYearStatistics(year));
    
    for(let z = 0; z < 5; z++) {
        const spacer = document.createElement("br")
        document.getElementById("content").appendChild(spacer);
        }
    }

    function createSelect(elementOnWhichToAppend, selectLabel, selectID, options) {
        const label = document.createElement("label");
        label.textContent = selectLabel;
        elementOnWhichToAppend.appendChild(label);
        
        const select = document.createElement("select");
        select.id = selectID;
        elementOnWhichToAppend.appendChild(select);

        for(let i = 0; i < options.length; i++) {
            const option = document.createElement("option");
            option.value = options[i].value;
            option.textContent = options[i].text;
            option.selected = options[i].selected;
            select.appendChild(option);
        }

    return;
    }

    function createYesNoSelectOptions(optionYesSelected1NoSelected0) {
        let yesSelected;
        let noSelected;

        if(optionYesSelected1NoSelected0 == 1) {
            yesSelected = "selected ";
            noSelected = ""
        }
        else {
            yesSelected = "";
            noSelected = "selected "
        }

        const yesNoOption = [
            {
            value: 1, 
            text: "Yes", 
            selected: yesSelected
        },
            {
            value: 0, 
            text: "No", 
            selected: noSelected
        }
        ]
    
    return yesNoOption;
    }

    function showDailyLog(dateAndFamilyMemberInformation) {
        fetch(`http://localhost:3000/familyMembers`) 
        .then((result) => result.json()) 
        .then((familyMembers) => { 
            const info = dateAndFamilyMemberInformation.split("_");
            const year = info[0];
            const monthNumber = info[1];
            const monthName = info[2];
            const dateNumber = info[3];
            const familyMemberID = info[4];

            let firstName;
            let lastName;
            for(let i = 0; i < familyMembers.length; i++) {
                if(familyMembers[i].id == familyMemberID) {
                    //This is the family member. Get his/her name:
                    firstName = familyMembers[i].firstName;
                    lastName = familyMembers[i].lastName;
                    break;        
                }
            }

            fetch(`http://localhost:3000/dailyLogs`) 
                .then((result) => result.json()) 
                .then((dailyLogs) => {
                    
                const dailyLog = getDailyLogFromDetials(dailyLogs, familyMemberID, year, monthNumber, dateNumber);

                const screenContent = document.getElementById("content");
                screenContent.innerHTML = "";

                const screenH1 = document.createElement("h1");
                screenH1.textContent = "Daily Log";
                screenContent.appendChild(screenH1);

                const nameh2 = document.createElement("h2");
                nameh2.textContent = `${firstName} ${lastName}`;
                screenContent.appendChild(nameh2);
                
                const dateh2 = document.createElement("h2");
                dateh2.textContent = `${monthName} ${dateNumber}, ${year}`;
                screenContent.appendChild(dateh2);

                const paragraph = document.createElement("p");
                paragraph.innerHTML = `I ate a healthy balance of food: <strong>${displayYes1No0(dailyLog.foodBalance)}</strong>
                    <br />
                    I ate an appropriate number of calories: <strong>${displayYes1No0(dailyLog.foodQuantity)}</strong>
                    <br /> 
                    I exercised vigorously for at least 30 minutes: <strong>${displayYes1No0(dailyLog.exercise)}</strong>
                    <br />`;
                screenContent.appendChild(paragraph);

                const editLink = document.createElement("a");
                editLink.target = "#";
                editLink.textContent = "Click here to edit";
                paragraph.appendChild(editLink);
                editLink.addEventListener("click", (event) => displayEnterEditDailyLog(dateAndFamilyMemberInformation, 2));

                displayReturnToMonthStatisticsScreenLink(monthNumber, year);   
            })
        })
    }
    
    function displayEnterEditDailyLog(dateAndFamilyMemberInformation, enter1Edit2) {
        fetch(`http://localhost:3000/familyMembers`) 
        .then((result) => result.json()) 
        .then((familyMembers) => { 
            const info = dateAndFamilyMemberInformation.split("_");
            const year = info[0];
            const monthNumber = info[1];
            const monthName = info[2];
            const dateNumber = info[3];
            const familyMemberID = info[4];

            let firstName;
            let lastName;
            for(let i = 0; i < familyMembers.length; i++) {
                if(familyMembers[i].id == familyMemberID) {
                    //This is the family member. Get his/her name:
                    firstName = familyMembers[i].firstName;
                    lastName = familyMembers[i].lastName;
                    break;        
                }
            }
            
            const screenContent = document.getElementById("content");
            screenContent.innerHTML = "";

            const screenH1 = document.createElement("h1");

            if(enter1Edit2 == 1) {
                //In enter mode:
                screenH1.textContent = "Enter Daily Log";
            }
            else {
                //In edit mode:
                screenH1.textContent = "Edit Daily Log";
            }
            
            screenContent.appendChild(screenH1);

            const nameh2 = document.createElement("h2");
            nameh2.textContent = `${firstName} ${lastName}`;
            screenContent.appendChild(nameh2);
            
            const dateh2 = document.createElement("h2");
            dateh2.textContent = `${monthName} ${dateNumber}, ${year}`;
            screenContent.appendChild(dateh2);

            const form = document.createElement("form");
            screenContent.appendChild(form);

            const fieldset = document.createElement("fieldset");
            form.appendChild(fieldset);

            
            if(enter1Edit2 == 1) {
                //In enter mode:
                const yesNoOption = createYesNoSelectOptions(1);
                createSelect(fieldset, "I ate a healthy balance of food:", "foodBalanceSelect", yesNoOption);
                createSelect(fieldset, "I ate an appropriate number of calories:", "foodQuantitySelect", yesNoOption);
                createSelect(fieldset, "I exercised vigorously for at least 30 minutes:", "exerciseSelect", yesNoOption);

                const buttonDiv = document.createElement("div");
                buttonDiv.classList.add("buttons");
                form.appendChild(buttonDiv);

                const submitButton = document.createElement("button");
                submitButton.textContent = "Submit";
                buttonDiv.appendChild(submitButton);
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    
                    const configurationObject = {
                        method: "POST",
            
                        headers: {
                            "Content-Type": "Application/json", 
                            "Accept": "Application/json"
                        },
                        body: JSON.stringify({
                            "familyMemberID": parseInt(familyMemberID, 10), 
                            "month": parseInt(monthNumber, 10), 
                            "dateNumber": parseInt(dateNumber, 10), 
                            "year": parseInt(year, 10), 
                            "foodBalance": parseInt(document.getElementById("foodBalanceSelect").value, 10), 
                            "foodQuantity": parseInt(document.getElementById("foodQuantitySelect").value, 10), 
                            "exercise": parseInt(document.getElementById("exerciseSelect").value, 10)
                        })
                    }
                fetch("http://localhost:3000/dailyLogs", configurationObject)
                    .then((response)=>response.json())
                    .then((dailyLog) => {
                        showMonthStatistics(year, monthNumber)
                    });
                })
                
            displayReturnToMonthStatisticsScreenLink(monthNumber, year);
            }
        else
            {
            //In edit mode. We need to get the defaults:
            fetch(`http://localhost:3000/dailyLogs`) 
                .then((result) => result.json()) 
                .then((dailyLogs) => {
                    const dailyLog = getDailyLogFromDetials(dailyLogs, familyMemberID, year, monthNumber, dateNumber); 
                    const balanceYesNoOption = createYesNoSelectOptions(dailyLog.foodBalance);
                    const quantityYesNoOption = createYesNoSelectOptions(dailyLog.foodQuantity);
                    const exerciseYesNoOption = createYesNoSelectOptions(dailyLog.exercise);
                    
                    createSelect(fieldset, "I ate a healthy balance of food:", "foodBalanceSelect", balanceYesNoOption);
                    createSelect(fieldset, "I ate an appropriate number of calories:", "foodQuantitySelect", quantityYesNoOption);
                    createSelect(fieldset, "I exercised vigorously for at least 30 minutes:", "exerciseSelect", exerciseYesNoOption);

                    const buttonDiv = document.createElement("div");
                    buttonDiv.classList.add("buttons");
                    form.appendChild(buttonDiv);

                    const submitButton = document.createElement("button");
                    submitButton.textContent = "Edit";
                    buttonDiv.appendChild(submitButton);
                    submitButton.addEventListener("click", (event) => {
                        event.preventDefault();
                        
                        const configurationObject = {
                            method: "PATCH",
                
                            headers: {
                                "Content-Type": "Application/json", 
                                "Accept": "Application/json"
                            },
                            body: JSON.stringify({
                                "familyMemberID": parseInt(familyMemberID, 10), 
                                "month": parseInt(monthNumber, 10), 
                                "dateNumber": parseInt(dateNumber, 10), 
                                "year": parseInt(year, 10), 
                                "foodBalance": parseInt(document.getElementById("foodBalanceSelect").value, 10), 
                                "foodQuantity": parseInt(document.getElementById("foodQuantitySelect").value, 10), 
                                "exercise": parseInt(document.getElementById("exerciseSelect").value, 10)
                            })
                        }
                    fetch(`http://localhost:3000/dailyLogs/${dailyLog.id}`, configurationObject)
                        .then((response)=>response.json())
                        .then((dailyLog) => {
                            showMonthStatistics(year, monthNumber)
                        });
                    })

                    const linebreak = document.createElement("br");
                    screenContent.appendChild(linebreak);

                    const returnLinkDiv = document.createElement("div");
                    returnLinkDiv.classList.add("centered_paragraph");
                    screenContent.appendChild(returnLinkDiv);

                    const returnLink = document.createElement("a");
                    returnLink.target = "#";
                    returnLink.textContent = `Return to previous screen`;
                    returnLinkDiv.appendChild(returnLink);
                    
                    const info = dateAndFamilyMemberInformation.split("_");
            
                    returnLink.addEventListener("click", (event) => showDailyLog(dateAndFamilyMemberInformation));
                    })
            }
        })  
    }

    function displayReturnToMonthStatisticsScreenLink(month, year) {
        const content = document.getElementById("content");

        const linebreak = document.createElement("br");
        content.appendChild(linebreak);

        const returnLinkDiv = document.createElement("div");
        returnLinkDiv.classList.add("centered_paragraph");
        content.appendChild(returnLinkDiv);

        const returnLink = document.createElement("a");
        returnLink.target = "#";
        returnLink.textContent = `Return to previous screen`;
        returnLinkDiv.appendChild(returnLink);

        returnLink.addEventListener("click", (event) => showMonthStatistics(year, month));
    }

    function getYYYYMMDDDate(current0yesterday1) {
        const currentDate = new Date();
        const dateOffset = currentDate.getTimezoneOffset();
        const testDate = currentDate.setDate(currentDate.getDate() - current0yesterday1)
        

        const returnDate = new Date(currentDate.getTime() + (dateOffset*60*1000)); 
        return(currentDate.toISOString().split('T')[0]);
    }
    
    showMonthStatistics(yyyy, mm);
})