//Given a log that consists of 3 answers to questions, return the score:
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

//Given a group of logs, return the total score:
function createTotalScoreFromGroupOfLogs(logs) {
    const totalScore = logs.reduce((accumulator, log) => {
    return accumulator + calculateDailyScore(log);
}, 0)
return totalScore;
}

//Get the names of the months and number of days in the month based on the year:
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