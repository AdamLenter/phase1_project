let familyMembers = [];
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
        familyMembers = {...allFamilyMembers};
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

document.addEventListener('DOMContentLoaded', function() {
    console.log("Word");
});