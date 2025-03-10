const BASE_URL = "https://v6.exchangerate-api.com/v6/469cf1c703a1cf3b9af97efe/pair";

const dropdowns = document.querySelectorAll(".dropdown select");
const exchange = document.querySelector(".exchange-icon");
const amountInput = document.querySelector("#amount_Input");
const btn = document.querySelector("form button");

const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Populate dropdowns with currency options
for (const select of dropdowns) {
    for (const currencyCode in countryList) {
        let newOption = document.createElement("option");

        newOption.innerText = currencyCode;
        newOption.value = currencyCode;

        if (select.name === "from" && currencyCode === "USD") {
            newOption.selected = true;
        }
        else if (select.name === "to" && currencyCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}


// Update flag based on selected currency
const updateFlag = (ele) => {
    let currencyCode = ele.value;
    let countryCode = countryList[currencyCode];

    if (!countryCode) {
        console.error("Country code not found for currency:", currencyCode);
        return;
    }

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = ele.parentElement.querySelector("img");
    img.src = newSrc;
}


// Swap 'from' and 'to' currencies
exchange.addEventListener("click", () => {
    const fromSelect = document.querySelector("select[name='from']");
    const toSelect = document.querySelector("select[name='to']");

    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    updateFlag(fromSelect);
    updateFlag(toSelect);
});


// Validate amount input
amountInput.addEventListener("input", () => {
    if (isNaN(amountInput.value)) {
        amountInput.value = 1;
    }
});


// Fetch exchange rate from API and update the message
const convertCurrency = async () => {

    let amount = amountInput.value;
    try {

        if (amount === "") {
            amountInput.value = 1;
            amount = 1;
        }

        const URL = `${BASE_URL}/${fromCurrency.value}/${toCurrency.value}`;
        let response = await fetch(URL);
        let data = await response.json();

        let rate = data.conversion_rate;
        const convertedAmount = (amount * rate).toFixed(2);

        msg.innerText = `${amount} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;

        msg.style.backgroundColor = "yellow";
        msg.style.lineHeight = "30px";

    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Failed to fetch exchange rate.";
        msg.style.backgroundColor = "red";
        msg.style.color = "white";
        msg.style.lineHeight = "30px";
    }

}


// Event listener for the button
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    convertCurrency();
});


// Update exchange rate on page load
window.addEventListener("load", () => {
    convertCurrency();
})