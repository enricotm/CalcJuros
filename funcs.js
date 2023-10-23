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

// Add amount div
let aForms = document.getElementById("aForms");
let aForm1 = document.getElementById("aForm1");
let aRemoveBtn = document.getElementById("aRemoveBtn");
let aAddBtn = document.getElementById("aAddBtn");
let aFormValue = 1;

aRemoveBtn.onclick = () => {
    aFormValue--;
    if (aFormValue == 1) {
        aRemoveBtn.classList.add("aBtn-disabled");
        aRemoveBtn.toggleAttribute("disabled", true);
    }

    aForms.removeChild(aForms.lastChild);
    aForms.removeChild(aForms.lastChild);
}

aAddBtn.onclick = () => {
    aFormValue++;
    if (aFormValue == 2) {
        aRemoveBtn.classList.remove("aBtn-disabled");
        aRemoveBtn.toggleAttribute("disabled", false);
    }

    function setInput(name, label) {
        let input = document.getElementsByName(name)[aFormValue-1];
        input.id = name+aFormValue;
        input.value = null;
        input.checked = false;
        if (label) document.getElementsByName(label)[aFormValue-1].setAttribute("for", name+aFormValue);
    }

    let aNewForm = aForm1.cloneNode(true);
    aNewForm.id = "aForm"+aFormValue;
    aForms.appendChild(document.createElement("hr"))
    aForms.appendChild(aNewForm);
    setInput("aPrincipal", null);
    setInput("aRate", null);
    setInput("aPerc", "aPercL");
    setInput("aAA", "aAAL");
    setInput("aYears", "aYearsL");
    setInput("aMonths", "aMonthsL");
}

// Calc proper rate
function calcRate(rate, perc, aa) {
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
function Continuous(amount, principal, rate, months, initial) {
    if (amount == null) {
        if (months == 0)
            return principal;
        else
            return principal*(1+rate)*(((1+rate)**months-1)/rate)+initial*(1+rate)**months;
    } else if (principal == null) {
        return (amount-initial*(1+rate)**months)*rate/(((1+rate)**months-1)*(1+rate));
    } else if (rate == null) {
        let minLimit = 0;
        let maxLimit = 0;
        if (amount >= initial+principal*months) maxLimit = amount/(initial+principal*months);
        else minLimit = -1;
        let result = 0;
        let crtAmount = 0;
        let tries = 0;
        while (crtAmount != amount) { 
            tries++;
            if (tries > 100) return NaN;
            result = (minLimit+maxLimit)/2;
            crtAmount = principal*(1+result)*(((1+result)**months-1)/result)+initial*(1+result)**months;
            // console.log(minLimit, maxLimit, result, crtAmount);
            if (Math.abs(crtAmount - amount) <= 0.000001) {console.log(result, "yes", tries); break}
            else if (crtAmount > amount) maxLimit = result;
            else minLimit = result;
        }
        return result;
    } else if (months == null) {
        return Math.log((amount+principal+principal/rate)/(initial+principal+principal/rate))/Math.log(1+rate);
        // Another option, same result:
        // return Math.log((rate*(amount+principal)+principal)/(rate*(initial+principal)+principal))/Math.log(1+rate);
    }
}

function getAmount() {
    let initial = initialInput.disabled ? NaN : parseFloat(initialInput.value);
    for (let i=1;i<=aFormValue;i++) {
        let principal = parseFloat(document.getElementById("aPrincipal"+i).value);
        let rate = parseFloat(document.getElementById("aRate"+i).value);
        let perc = document.getElementById("aPerc"+i).checked;
        let aa = document.getElementById("aAA"+i).checked;
        let years = parseFloat(document.getElementById("aYears"+i).value);
        let months = parseFloat(document.getElementById("aMonths"+i).value);
        // console.log(initial, principal, rate, perc, aa, years, months);
    
        if (isNaN(initial) && isNaN(principal) || isNaN(rate) || isNaN(years) && isNaN(months)) return errorMessage;
    
        if (isNaN(initial)) initial = 0;
        if (isNaN(principal)) principal = 0;
        if (isNaN(years)) years = 0;
        if (isNaN(months)) months = 0;
    
        initial = Continuous(null, principal, calcRate(rate, perc, aa), years*12+months, initial);
        if (isNaN(initial)) return errorMessage;
    }
    return "R$"+commas((Math.round(initial*100)/100).toFixed(2));
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

    let principal = Continuous(amount, null, calcRate(rate, perc, aa), years*12+months, initial);
    if (isNaN(principal)) return errorMessage;
    return "R$"+commas((Math.round(principal*100)/100).toFixed(2));
}

function getRate() {
    let initial = initialInput.disabled ? NaN : parseFloat(initialInput.value);
    let amount = parseFloat(document.getElementById("rAmount").value);
    let principal = parseFloat(document.getElementById("rPrincipal").value);
    let years = parseFloat(document.getElementById("rYears").value);
    let months = parseFloat(document.getElementById("rMonths").value);
    // console.log(initial, amount, principal, years, months);

    if (isNaN(amount) || isNaN(initial) && isNaN(principal) || isNaN(years) && isNaN(months)) return errorMessage;

    if (isNaN(initial)) initial = 0;
    if (isNaN(principal)) principal = 0;
    if (isNaN(years)) years = 0;
    if (isNaN(months)) months = 0;

    let rate = Continuous(amount, principal, null, years*12+months, initial);
    if (isNaN(rate)) return errorMessage;
    let d = 10**3;
    return Math.round(rate*100*d)/d+"%"+(Math.abs(rate)<1 ? " ("+Math.round(((rate+1)**12-1)*100*d)/d+"%aa)" : "");
}

function getMonths() {
    let initial = initialInput.disabled ? NaN : parseFloat(initialInput.value);
    let amount = parseFloat(document.getElementById("mAmount").value);
    let principal = parseFloat(document.getElementById("mPrincipal").value);
    let rate = parseFloat(document.getElementById("mRate").value);
    let perc = document.getElementById("mPerc").checked;
    let aa = document.getElementById("mAA").checked;
    // console.log(initial, amount, principal, rate, perc, aa);

    if (isNaN(amount) || isNaN(initial) && isNaN(principal) || isNaN(rate)) return errorMessage;

    if (isNaN(initial)) initial = 0;
    if (isNaN(principal)) principal = 0;

    let months = Continuous(amount, principal, calcRate(rate, perc, aa), null, initial);
    if (isNaN(principal)) return errorMessage;
    return Math.round(months*100)/100+" Mos ("+Math.round(months/12*100)/100+" Yrs)";
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
            rTextResult.textContent = "";
            sleep(80).then(() => rTextResult.textContent = getRate());
            break;
        case "mTab":
            mTextResult.textContent = "";
            sleep(80).then(() => mTextResult.textContent = getMonths());
            break;
    }
}