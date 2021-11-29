function displayEnterEditDailyLogForm(familyMemberAndDate, enter1Edit2) {
    const info = getInfoFromFamilyMemberAndDate(familyMemberAndDate);

    const months = getMonths(info['year']);
    const monthNumber = parseInt(info['month'], 10);
    const dateNumber = parseInt(info['dateNumber'], 10);
    const year = parseInt(info['year'], 10);

    let screenHeading
    if(enter1Edit2 === 1) {
        //In enter mode:
        screenHeading = "Enter Daily Log";
    }

    const familyMemberInfo = familyMembers.find((familyMember) => familyMember.id == info["familyMemberID"]);

    const subHeading = `${familyMemberInfo.firstName} ${familyMemberInfo.lastName} - ${months[info["month"] - 1]["monthName"]} ${info["dateNumber"]}, ${info["year"]}`;

    const enterEditLogScreen = createScreen(screenHeading, subHeading);

    const form = document.createElement("form");
    enterEditLogScreen.appendChild(form);

    const fieldset = document.createElement("fieldset");
    form.appendChild(fieldset);

    
    if(enter1Edit2 == 1) {
        //In enter mode:
        const yesNoOption = createYesNoSelectOptions(1);
        createSelect(fieldset, "I ate a healthy balance of food:", "foodBalanceSelect", yesNoOption);
        createSelect(fieldset, "I ate an appropriate number of calories:", "foodQuantitySelect", yesNoOption);
        createSelect(fieldset, "I exercised vigorously for at least 30 minutes:", "exerciseSelect", yesNoOption);

        submitButton = createButtonDivWithButton(form, "Submit");

        submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            
            const configurationObject = {
                method: "PATCH",
                op: "add", 
                path: "/logs",
    
                headers: {
                    "Content-Type": "Application/json", 
                    "Accept": "Application/json", 

                },
                body: JSON.stringify({
                    "month": monthNumber, 
                    "dateNumber": dateNumber, 
                    "year": year, 
                    "foodBalance": parseInt(document.getElementById("foodBalanceSelect").value, 10), 
                    "foodQuantity": parseInt(document.getElementById("foodQuantitySelect").value, 10), 
                    "exercise": parseInt(document.getElementById("exerciseSelect").value, 10)
                })
            }
        fetch(`http://localhost:3000/familyMembers/${parseInt(info['familyMemberID'], 10)}`, configurationObject)
            .then((response)=>response.json())
            .then((dailyLog) => {
                displayDailyPerformance(`${monthNumber}.${year}`);
            });
        })
        
    createLineBreaks(enterEditLogScreen, 1);
    let previousScreenLink = createCenteredLink(enterEditLogScreen, "Return to previous screen");
    previousScreenLink.id = `${monthNumber}.${year}`;
    previousScreenLink.addEventListener("click", (event) => displayDailyPerformance(event.target.id));
    }
}