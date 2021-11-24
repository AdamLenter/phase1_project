let familyMembers;
let dailyLogs;


const fetchFamily = () => {
    fetch(`http://localhost:3000/familyMembers`) 
       .then((result) => result.json()) 
        .then((allFamilyMembers) => {
            familyMembers = allFamilyMembers;
        })
}


//Menu Functionality:
document.addEventListener("DOMContentLoaded", () => {
    fetchFamily();

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
        monthCell.id = i + 1;
        monthCell.addEventListener("click", (event) => displayDailyPerformance(event.target.id));

        //Now add cells for the individuals' total scores:
        for(familyMember of familyMembers) {
            const familyMemberMonthLogs = familyMember.logs.filter((log) => log.year == year && log.month === (i + 1));
            
            if(familyMemberMonthLogs != undefined) {
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
}