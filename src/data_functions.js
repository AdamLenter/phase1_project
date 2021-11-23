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