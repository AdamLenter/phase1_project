document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    console.log("Hello");
    console.log(yyyy + "-" + mm + "-" + dd);


    fetch(`http://localhost:3000/dailyLogs`) 
        .then((result) => result.json()) 
        .then((dailyLogs) => tabulate(monsters));
})