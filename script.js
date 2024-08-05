const BASE_URL = "https://v6.exchangerate-api.com/v6/9ab8df105be12ea1a842c3c0/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");

const icon = document.querySelector('.dropdown i');

const amt = document.querySelector("#amount");

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name == 'from' && currCode == 'USD')
            newOption.selected = true;
        if (select.name == 'to' && currCode == 'INR')
            newOption.selected = true;
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

const updateCal = async () => {
    let fromVal = `${BASE_URL}/${fromCurr.value}`;

    let fromRes = await fetch(fromVal);
    let fromData = await fromRes.json();

    let result = amt.value * fromData.conversion_rates[toCurr.value];

    msg.innerText = `${amt.value} ${fromCurr.value} = ${result} ${toCurr.value}`;
}


btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateCal();
});

icon.addEventListener("click", () => {
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateCal();
    // fromCurr.value)
    // console.log(toCurr.value)
});

amt.oninput = () => {
    updateCal();
}


updateCal();