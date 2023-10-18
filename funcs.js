// Change tabs
let btnAmount = document.getElementById("abaAmount");
let btnPrincipal = document.getElementById("abaPrincipal");
let btnRate = document.getElementById("abaRate");
let btnMonths = document.getElementById("abaMonths");

let formAmount = document.getElementById("formAmount");
let formPrincipal = document.getElementById("formPrincipal");
let formRate = document.getElementById("formRate");
let formMonths = document.getElementById("formMonths");

function changeTabs(tab, form) {
    console.log(tab, form)
    btnAmount.classList.remove("aba-selected");
    btnPrincipal.classList.remove("aba-selected");
    btnRate.classList.remove("aba-selected");
    btnMonths.classList.remove("aba-selected");

    formAmount.toggleAttribute("hidden", true);
    formPrincipal.toggleAttribute("hidden", true);
    formRate.toggleAttribute("hidden", true);
    formMonths.toggleAttribute("hidden", true);

    tab.classList.add("aba-selected");
    form.toggleAttribute("hidden", false);
}

btnAmount.onclick = () => changeTabs(btnAmount, formAmount);
btnPrincipal.onclick = () => changeTabs(btnPrincipal, formPrincipal);
btnRate.onclick = () => changeTabs(btnRate, formRate);
btnMonths.onclick = () => changeTabs(btnMonths, formMonths);

// Disable Initial Value
let switchInitial = document.getElementById("initialSwitch");
let initial = document.getElementById("initialInput");

switchInitial.onchange = () => initial.toggleAttribute("disabled");