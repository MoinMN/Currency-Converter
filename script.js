// Use your API key
const BASE_URL = "https://v6.exchangerate-api.com/v6/9ab8df105be12ea1a842c3c0/latest";

const dropdowns = document.querySelectorAll(".currency-select");
const btn = document.querySelector(".convert-btn");
const fromCurr = document.querySelector("[name='from']");
const toCurr = document.querySelector("[name='to']");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector("#amount");
const swapBtn = document.querySelector("#swapBtn");
const fromFlag = document.querySelector(".from-currency .flag-img");
const toFlag = document.querySelector(".to-currency .flag-img");

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag when currency changes
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    if (element.name === "from") {
        fromFlag.src = newSrc;
    } else {
        toFlag.src = newSrc;
    }
};

// Swap currencies
swapBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Swap values
    const tempCurr = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempCurr;

    // Update flags
    updateFlag(fromCurr);
    updateFlag(toCurr);

    // Update currency symbol
    updateCurrencySymbol();

    // Recalculate if amount exists
    if (amountInput.value) {
        updateExchangeRate();
    }
});

// Get exchange rate
const updateExchangeRate = async () => {
    let amount = amountInput.value;
    if (amount === "" || amount < 1) {
        amount = 1;
        amountInput.value = "1";
    }

    // Add loading state
    document.querySelector(".container").classList.add("loading");
    msg.innerText = "Converting...";

    try {
        const URL = `${BASE_URL}/${fromCurr.value}`;
        let response = await fetch(URL);
        let data = await response.json();
        let rate = data.conversion_rates[toCurr.value];

        let finalAmount = (amount * rate).toFixed(2);

        // Format numbers with commas
        const formatNumber = (num) => {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(num);
        };

        msg.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-light);">
          ${formatNumber(finalAmount)} ${toCurr.value}
        </div>
        <div style="font-size: 0.875rem; color: var(--text-muted); font-weight: 400;">
          ${formatNumber(amount)} ${fromCurr.value} = ${formatNumber(finalAmount)} ${toCurr.value}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">
          1 ${fromCurr.value} = ${rate.toFixed(4)} ${toCurr.value}
        </div>
      </div>
    `;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate. Please try again.";
        console.error("Error:", error);
    } finally {
        // Remove loading state
        document.querySelector(".container").classList.remove("loading");
    }
};

// Update currency symbol based on selected currency
const updateCurrencySymbol = () => {
    const currencySymbols = {
        USD: "$", EUR: "€", GBP: "£", JPY: "¥", INR: "₹",
        AUD: "A$", CAD: "C$", CHF: "Fr", CNY: "¥", SEK: "kr",
        NZD: "NZ$", KRW: "₩", SGD: "S$", HKD: "HK$", NOK: "kr",
        MXN: "$", BRL: "R$", ZAR: "R", RUB: "₽", TRY: "₺"
    };

    const symbol = currencySymbols[fromCurr.value] || "$";
    document.querySelector(".currency-symbol").innerText = symbol;
};

// Form submission
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Real-time conversion on input with debounce
let debounceTimeout;
amountInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    if (amountInput.value && amountInput.value > 0) {
        debounceTimeout = setTimeout(() => {
            updateExchangeRate();
        }, 500);
    }
});

// Update currency symbol when from currency changes
fromCurr.addEventListener("change", () => {
    updateCurrencySymbol();
    if (amountInput.value) {
        updateExchangeRate();
    }
});

// Update exchange rate when to currency changes
toCurr.addEventListener("change", () => {
    if (amountInput.value) {
        updateExchangeRate();
    }
});

// Initialize on page load
window.addEventListener("load", () => {
    updateCurrencySymbol();
    updateExchangeRate();
});