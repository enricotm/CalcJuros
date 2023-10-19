// Vars
let errorMessage = "Invalid"

// Change tabs
let aTab = document.getElementById("aTab");
let pTab = document.getElementById("pTab");
let rTab = document.getElementById("rTab");
let mTab = document.getElementById("mTab");
let activeTab = aTab;

let aForm = document.getElementById("aForm");
let pForm = document.getElementById("pForm");
let rForm = document.getElementById("rForm");
let mForm = document.getElementById("mForm");
let activeForm = aForm;

let aTextResult = document.getElementById("aTextResult");
let pTextResult = document.getElementById("pTextResult");
let rTextResult = document.getElementById("rTextResult");
let mTextResult = document.getElementById("mTextResult");
let activeTextResult = aTextResult;

let forms = document.getElementById("forms");

function changeTabs(tab, form, textResult) {
    activeTab.classList.remove("aba-selected");
    activeTab = tab;
    activeTab.classList.add("aba-selected");
    activeTab.id == "aTab" ? forms.style.borderTopLeftRadius = "0px" : forms.style.borderTopLeftRadius = "15px";
    activeTab.id == "mTab" ? forms.style.borderTopRightRadius = "0px" : forms.style.borderTopRightRadius = "15px";

    activeForm.toggleAttribute("hidden", true);
    activeForm = form;
    activeForm.toggleAttribute("hidden", false);

    activeTextResult.toggleAttribute("hidden", true);
    activeTextResult = textResult;
    activeTextResult.toggleAttribute("hidden", false);
}

aTab.onclick = () => changeTabs(aTab, aForm, aTextResult);
pTab.onclick = () => changeTabs(pTab, pForm, pTextResult);
rTab.onclick = () => changeTabs(rTab, rForm, rTextResult);
mTab.onclick = () => changeTabs(mTab, mForm, mTextResult);

// Disable Initial Value
let switchInitial = document.getElementById("initialSwitch");
let initialInput = document.getElementById("initialInput");

switchInitial.onchange = () => initialInput.toggleAttribute("disabled");

// Get proper rate
function getRate(rate, perc, aa) {
    if (perc) rate = rate/100;
    if (aa) rate = (rate+1)**(1/12)-1;
    return rate;
}

// Useful functions
function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Math Functions

// function Simple(amount, principal, rate, months) {
//     if (amount == null) {
        
//     } else if (principal == null) {

//     } else if (rate == null) {
//         return (amount/principal)**(1/months)-1;
//     } else if (months == null) {

//     }
// }

function Continuous(amount, principal, rate, months, initial) {
    if (amount == null) {
        if (months == 0)
            return principal;
        else
            return principal*(1+rate)*(((1+rate)**months-1)/rate)+initial*(1+rate)**months;
    } else if (principal == null) {
        return (amount-initial*(1+rate)**months)*rate/(((1+rate)**months-1)*(1+rate));
    } else if (rate == null) {

    } else if (months == null) {

    }
}

function getAmount() {
    let initial = initialInput.disabled ? NaN : parseFloat(initialInput.value);
    let principal = parseFloat(document.getElementById("aPrincipal").value);
    let rate = parseFloat(document.getElementById("aRate").value);
    let perc = document.getElementById("aPerc").checked;
    let aa = document.getElementById("aAA").checked;
    let years = parseFloat(document.getElementById("aYears").value);
    let months = parseFloat(document.getElementById("aMonths").value);
    // console.log(initial, principal, rate, perc, aa, years, months);

    if (isNaN(initial) && isNaN(principal) || isNaN(rate) || isNaN(years) && isNaN(months)) return errorMessage;

    if (isNaN(initial)) initial = 0;
    if (isNaN(principal)) principal = 0;
    if (isNaN(years)) years = 0;
    if (isNaN(months)) months = 0;

    let amount = Continuous(null, principal, getRate(rate, perc, aa), years*12+months, initial);
    if (isNaN(amount)) return errorMessage;
    return "R$"+commas((Math.round(amount*100)/100).toFixed(2));
}

function getPrincipal() {
    let initial = initialInput.disabled ? NaN : parseFloat(initialInput.value);
    let amount = parseFloat(document.getElementById("pAmount").value);
    let rate = parseFloat(document.getElementById("pRate").value);
    let perc = document.getElementById("pPerc").checked;
    let aa = document.getElementById("pAA").checked;
    let years = parseFloat(document.getElementById("pYears").value);
    let months = parseFloat(document.getElementById("pMonths").value);
    // console.log(initial, amount, rate, perc, aa, years, months);

    if (isNaN(amount) || isNaN(rate) || isNaN(years) && isNaN(months)) return errorMessage;

    if (isNaN(initial)) initial = 0;
    if (isNaN(years)) years = 0;
    if (isNaN(months)) months = 0;

    let principal = Continuous(amount, null, getRate(rate, perc, aa), years*12+months, initial);
    if (isNaN(principal)) return errorMessage;
    else return "R$"+commas((Math.round(principal*100)/100).toFixed(2));
}

// Calc Button
let calcBtn = document.getElementById("calcBtn");

calcBtn.onclick = () => {
    switch (activeTab.id) {
        case "aTab":
            aTextResult.textContent = "";
            sleep(80).then(() => aTextResult.textContent = getAmount());
            break;
        case "pTab":
            pTextResult.textContent = "";
            sleep(80).then(() => pTextResult.textContent = getPrincipal());
            break;
        case "rTab":
            break;
        case "mTab":
            break;
    }
}