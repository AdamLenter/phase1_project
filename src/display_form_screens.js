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

function displayEnterEditFamilyMemberForm(familyMemberID) {
    let screenHeading;
    let defaultFirstName;
    let defaultLastName
    
    if(familyMemberID != undefined) {
        //There is a family member. In edit mode:
        screenHeading = "Edit Family Member";

        const familyMember = familyMembers.find((familyMember) => familyMember.id == familyMemberID);
        defaultFirstName = familyMember.firstName;
        defaultLastName = familyMember.lastName;
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
                //Gather the family
                fetchFamily(showFamilyMembers);
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
                    "lastName": lastNameTextbox.value, 
                    "logs": []
                })
            }
        fetch(`http://localhost:3000/familyMembers`, configurationObject)
            .then((response)=>response.json())
            .then((familyMember) => {
                //Retrieve the new list of contacts and return to the family member form:
                fetchFamily(showFamilyMembers);
            })
        })
    }
}