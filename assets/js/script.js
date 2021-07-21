document.addEventListener('DOMContentLoaded', init);
let cart = [];

function init() {
    const fileEl = document.querySelector('.uploader__input');
    fileEl.addEventListener('change' , readFile);

    const excursions = document.querySelector('.panel__excursions');
    excursions.addEventListener('click' , selectExcursion);

    excursions.addEventListener('submit' , summaryDetails);
}



function readFile(e) {
    const file = e.target.files[0];
    const regFileExtension  = /^.+\.+c+s+v$/;

    if(file && regFileExtension.test(file.name) === true) {
        const reader = new FileReader();

        reader.onload = function(readerEvent) {
            const content = readerEvent.target.result;
            const rowsInContent = content.split(/[\r\n]+/gm);

            rowsInContent.forEach( function(element) {
                const excursion = element.substr(1, element.length-2).split(/["+"]\W+/);
                setExcursionDetails(excursion);
            } )
            showCurrentExcursion();
        };
        reader.readAsText(file, 'UTF-8');
    }
    else {
        alert('Incorrect file')
    }
}

function setExcursionDetails(item) {

    const excursionDetailsPrototype = document.querySelector('.excursions__item');

    const excursionDetails = excursionDetailsPrototype.cloneNode(true);
    excursionDetails.classList.remove('excursions__item--prototype' , 'excursions__item--current');
    excursionDetails.dataset.id = item[0];

    const excursionTitle = excursionDetails.querySelector('.excursions__title--content');
    excursionTitle.innerText = item[1]

    const excursionDescription = excursionDetails.querySelector('.excursions__description');
    excursionDescription.innerText = item[2]

    const excursionPrice = excursionDetails.querySelectorAll('.excursions__price');

    const excursionAdultPrice = excursionPrice[0];
    excursionAdultPrice.innerText = item[3]

    const excursionChildrenPrice = excursionPrice[1];
    excursionChildrenPrice.innerText = item[4];

    excursionDetailsPrototype.parentElement.appendChild(excursionDetails);
}

function showCurrentExcursion() {

    const mainPanel = document.querySelector('.panel');
    mainPanel.style.justifyContent = "space-between";

    const excursionBoard = document.querySelector('.panel__excursions');
    excursionBoard.style.display = "flex"

    const currentExcursion = document.querySelector('.excursions__item--prototype').nextElementSibling;
    currentExcursion.classList.add('excursions__item--current');
}

function selectExcursion(e) {
    if(e.target.classList.contains('fa-arrow-right')) {
        selectNextExcursion();
    }

    if(e.target.classList.contains('fa-arrow-left')) {
        selectPreviousExcursion();
    }
}

function selectNextExcursion() {

    const currentExcursion = document.querySelector('.excursions__item--current');

    const nextExcursion = currentExcursion.nextElementSibling;

    if(nextExcursion !== null) {
        currentExcursion.classList.remove('excursions__item--current');
        nextExcursion.classList.add('excursions__item--current');
    }

    if(nextExcursion === null) {
        const firstExcursions = document.querySelector('.excursions__item--prototype').nextElementSibling;
        currentExcursion.classList.remove('excursions__item--current');
        firstExcursions.classList.add('excursions__item--current');
    }
}

function selectPreviousExcursion() {

    const currentExcursion = document.querySelector('.excursions__item--current');

    const previousExcursion = currentExcursion.previousElementSibling;

    if(previousExcursion !== null) {
        currentExcursion.classList.remove('excursions__item--current');
        previousExcursion.classList.add('excursions__item--current');
    }

    if(previousExcursion === null) {
        const lastExcursions = document.querySelector('.panel__excursions').lastElementChild;
        currentExcursion.classList.remove('excursions__item--current');
        lastExcursions.classList.add('excursions__item--current');
    }
}

function summaryDetails(e) {
    e.preventDefault();

    getCurrentExcursionDetails();
    setSummaryDetails(cart)
    setOrderTotalPrice(cart);
}

function getCurrentExcursionDetails() {

    const currentExcursion = document.querySelector('.excursions__item--current');

    currentExcursionName = currentExcursion.querySelector('.excursions__title--content').innerText;

    currentExcursionPrices = currentExcursion.querySelectorAll('.excursions__price');
    currentExcursionAdultPrice = currentExcursionPrices[0].innerText;
    currentExcursionChildrenPrice = currentExcursionPrices[1].innerText;

    currentExcursionAdultNumber = currentExcursion.querySelector('[name=adults]').value;
    currentExcursionChildrenNumber = currentExcursion.querySelector('[name=children]').value;

    const currentExcursionDetails =
    {
        title: currentExcursionName,
        adultPrice: currentExcursionAdultPrice,
        adultNumber: currentExcursionAdultNumber,
        childPrice: currentExcursionChildrenPrice,
        childNumber: currentExcursionChildrenNumber,
    }

    cart.push(currentExcursionDetails);

}

function setSummaryDetails(item) {
    const summaryDetailsPrototype = document.querySelector('.summary__item--prototype');
    const summaryDetails = summaryDetailsPrototype.cloneNode(true);
    summaryDetails.classList.remove('summary__item--prototype');
    summaryDetails.classList.add('summary__item--current')

    const summaryName = document.querySelector('.summary__name');
    summaryName.innerText = item[item.length - 1].title

    const summaryAdultsPrices = document.querySelector('.summary__prices--adults');
    summaryAdultsPrices.innerText = `Dorosły: ${item[item.length - 1].adultNumber} x ${item[item.length - 1].adultPrice} PLN`

    const summaryChildrenPrices = document.querySelector('.summary__prices--children');
    summaryChildrenPrices.innerText = `Dziecko: ${item[item.length - 1].childNumber} x ${item[item.length - 1].childPrice} PLN`


    const summaryTotalPrice = document.querySelector('.summary__total-price');

    const CalculatedTotalPrice =

     item[item.length - 1].adultNumber * item[item.length - 1].adultPrice + item[item.length - 1].childNumber * item[item.length - 1].childPrice;

    summaryTotalPrice.innerText = `${CalculatedTotalPrice} PLN`;
    console.log(summaryTotalPrice);
    console.log(CalculatedTotalPrice);

    console.log(summaryDetails)
    summaryDetailsPrototype.parentElement.appendChild(summaryDetails);
}





function setOrderTotalPrice(item) {

    let orderTotalPrice = document.querySelector('.order__total-price-value');
    let price = "";

   for(let i=0; i<item.length; i++) {
       price = parseInt(price + (item[i].adultPrice * item[i].adultNumber + item[i].childPrice * item[i].childNumber));
    }
    orderTotalPrice.innerText = price;
}