let familyMembers;
let dailyLogs;


function fetchFamily() {
    fetch(`http://localhost:3000/familyMembers`) 
       .then((result) => result.json()) 
        .then((allFamilyMembers) => {
            familyMembers = allFamilyMembers;
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
    }

//Menu Functionality:
document.addEventListener("DOMContentLoaded", () => {
    fetchFamily();
})