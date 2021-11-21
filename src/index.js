let familyMembers;

fetch(`http://localhost:3000/familyMembers`) 
    .then((result) => result.json()) 
    .then((allFamilyMembers) => {
        familyMembers = {...allFamilyMembers};
    })

document.addEventListener('DOMContentLoaded', function() {
    console.log("Word");
});