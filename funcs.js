let btnAmount = document.getElementById("abaAmount");
let btnPrincipal = document.getElementById("abaPrincipal");
let btnRate = document.getElementById("abaRate");
let btnMonths = document.getElementById("abaMonths");

function changeTabs(tab) {
    console.log(tab)
    btnAmount.classList.remove("aba-selected");
    btnPrincipal.classList.remove("aba-selected");
    btnRate.classList.remove("aba-selected");
    btnMonths.classList.remove("aba-selected");

    tab.classList.add("aba-selected");
}

btnAmount.onclick = () => changeTabs(btnAmount);
btnPrincipal.onclick = () => changeTabs(btnPrincipal);
btnRate.onclick = () => changeTabs(btnRate);
btnMonths.onclick = () => changeTabs(btnMonths);