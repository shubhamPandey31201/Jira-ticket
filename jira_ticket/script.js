let addBtn = document.querySelector(".add");
let removeBtn = document.querySelector(".remove");
let mainCon = document.querySelector(".main-container");
let modalCon = document.querySelector(".modal-container");
let textArea = document.querySelector(".textArea-container");
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");
let pColors = ["lightPink", "lightBlue", "lightGreen", "lightPurple"];
let defaultPriorityColor = pColors[pColors.length - 1];

let displayFlag = false;
let removeFlag = false;

// after creating Ticket and refreshing it or again opening will cause the created ticket to disaapear
// so to avoid this disappearing of ticket we use web storage api.
// web storage is a set of mechanism where we store in key value . both key and value should be in string only 
// web storage has two data base area one is localStorage and other is sessionstorage 
// sessionstorage is for temporary use after refreshing and reloading or reopening the data con't be retrieve
// but in localStorage you data can  be retrieve even after refreshing and reloading or reopening
// localStorage has data storage limit that is 5mb it depends open the browser
// key value pair should be in string form 
// to convert anything into string we use JSON.strigify();
// JSON is java script object notation
// JSON is a standard format to represent our data
// json is light weight
// data transmission mostly happens in json form only 
// to convert json string to actual object we use json.parse();
// simply we can say JSON.stringify() is encoding to string and JSON.parse() is decoding to its actual datatype or object
// we can get access to localStorage through browser
// browser has provided us windows interface( i.e windows object ) where localStorage will be globally avialable
// some methods of localStorage are 
// localStorage.setItem("key","value"); // for adding a key value pair to local storage
// localStorage.getItem("key"); // for getting a key value pair from local storage
// localStorage.remove("key"); // it is used for removing one key value pair
// localStorage.clear(); // it is used for clearing everything from localStorage



let ticketArr = [];
let filteredArr = [];
if (localStorage.getItem("jira-ticket")) {
    // Retrieve and display tickets
    ticketArr = JSON.parse(localStorage.getItem("jira-ticket"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColr, ticketObj.ticketTask, ticketObj.ticketId);
    })
}


for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentBoxColor = toolBoxColors[i].classList[0];
        let filterArr = ticketArr.filter((ticks) => {
            return ticks.ticketColr === currentBoxColor;
        })
        let allTickets = document.querySelectorAll(".ticket");
        allTickets.forEach((Ticket) => {
            Ticket.remove();
        })

        filterArr.forEach((tticks) => {
            createTicket(tticks.ticketColr, tticks.ticketTask, tticks.ticketId);
        })
        filteredArr = filterArr;



    })
    toolBoxColors[i].addEventListener("dblclick", (e) => {

        let remainingTicket = document.querySelectorAll(".ticket");
        remainingTicket.forEach((remTick) => {
            remTick.remove();

        })

        ticketArr.forEach((tick) => {
            createTicket(tick.ticketColr, tick.ticketTast, tick.ticketId);
        })

    })

}

addBtn.addEventListener("click", (e) => {
    displayFlag = !displayFlag;
    let modalContain = document.querySelector(".modal-container");

    if (displayFlag == true) {
        modalContain.style.display = "flex";

    }
    else {
        modalContain.style.display = "none";
    }

})

let lock = "fa-lock";
let unlock = "fa-lock-open";

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
})

allPriorityColors.forEach((priorityColor) => {
    priorityColor.addEventListener("click", (e) => {
        allPriorityColors.forEach((removeDefault) => {
            removeDefault.classList.remove("default");
        })
        priorityColor.classList.add("default");
        defaultPriorityColor = priorityColor.classList[0];
    })
})

modalCon.addEventListener("keydown", (e) => {
    let Key = e.key;
    if (Key == "Shift") {
        createTicket(defaultPriorityColor, textArea.value);  // shortid is a function provided by the package that will generate random number
        modalCon.style.display = "none";
        displayFlag = false;

        setModalToDefault()


    }
})

// for generating random id number go to  short id unpkg script site



function createTicket(ticketColr, ticketTask, ticketId) {
    let id = ticketId || shortid();
    let newTicket = document.createElement("div");
    newTicket.setAttribute("class", "ticket");
    newTicket.innerHTML = `
        <div class="ticket-priority ${ticketColr}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="ticket-content">${ticketTask}</div>
        <div class="lock">
                <i class="fa-solid fa-lock"></i>
        </div>
    `
    mainCon.appendChild(newTicket);
    if (!ticketId) {

        ticketArr.push({ ticketColr, ticketTask, ticketId: id });

        localStorage.setItem("jira-ticket", JSON.stringify(ticketArr));



    }

    removeHandler(newTicket, id);
    lockHandle(newTicket, id);
    handleColor(newTicket, id);


}
function handleColor(newTicket, id) {
    let colorArea = newTicket.querySelector(".ticket-priority");
    colorArea.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        let currentColor = colorArea.classList[1];
        let currentColorIndex = pColors.findIndex((cColor) => {
            return cColor == currentColor;  // it will return the index of the color when matched

        })
        currentColorIndex++;
        let newColorIndex = currentColorIndex % pColors.length;
        let nextColor = pColors[newColorIndex];

        colorArea.classList.remove(currentColor);
        colorArea.classList.add(nextColor);

        ticketArr[ticketIdx].ticketColr = nextColor;
        localStorage.setItem("jira-ticket", JSON.stringify(ticketArr));


    })
}
function removeHandler(newTicket, id) {
    newTicket.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        if (removeFlag == false) {
            return;
        }

        ticketArr.splice(ticketIdx, 1);

        localStorage.setItem("jira-ticket", JSON.stringify(ticketArr));


        newTicket.remove();

    })

}

function lockHandle(newTicket, id) {
    let ticketLock = newTicket.querySelector(".lock");
    let lockCheck = ticketLock.children[0];
    let taskArea = newTicket.querySelector(".ticket-content");

    lockCheck.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);

        if (lockCheck.classList.contains(lock)) {
            lockCheck.classList.remove(lock);
            lockCheck.classList.add(unlock);
            taskArea.setAttribute("contenteditable", "true");






        }
        else {
            lockCheck.classList.remove(unlock);
            lockCheck.classList.add(lock);
            taskArea.setAttribute("contenteditable", "false");
        }

        ticketArr[ticketIdx].ticketTask = taskArea.innerText;
        localStorage.setItem("jira-ticket", JSON.stringify(ticketArr));

    })



}
function setModalToDefault() {
    modalCon.style.display = "none";
    textArea.value = "";
    defaultPriorityColor = pColors[pColors.length - 1];
    allPriorityColors.forEach((priorityColorElem) => {
        priorityColorElem.classList.remove("default");
    })
    allPriorityColors[allPriorityColors.length - 1].classList.add("default");
}
function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketId === id;
    })
    return ticketIdx;
}