document.addEventListener('DOMContentLoaded', init);
let cart = [];

function init() {

    const fileEl = document.querySelector('.uploader__input');
    const excursions = document.querySelector('.panel__excursions');
    const summary = document.querySelector('.panel__form')

    fileEl.addEventListener('change' , readFile);
    excursions.addEventListener('click' , selectExcursion);
    excursions.addEventListener('submit' , setSummaryDetails);
    summary.addEventListener('click' , removeExcursion);
    summary.addEventListener('submit' , sendOrder)
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
            } );
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
    excursionDetails.classList.remove('excursions__item--prototype');
    excursionDetails.dataset.id = item[0];

    const excursionTitle = excursionDetails.querySelector('.excursions__title--content');
    excursionTitle.innerText = item[1];

    const excursionDescription = excursionDetails.querySelector('.excursions__description');
    excursionDescription.innerText = item[2];

    const excursionPrice = excursionDetails.querySelectorAll('.excursions__price');

    const excursionAdultPrice = excursionPrice[0];
    excursionAdultPrice.innerText = item[3];

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

    clearErrors('[data-excursion-content]');
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

function setSummaryDetails(e) {
    e.preventDefault();

    if( getCurrentExcursionDetails() ) {
        addExcursionIntoSummary(cart);
        setOrderTotalPrice(cart);
    }
}

function getCurrentExcursionDetails() {

    clearErrors('[data-excursion-content]');

    const currentExcursion = document.querySelector('.excursions__item--current');

    const currentExcursionName = currentExcursion.querySelector('.excursions__title--content').innerText;

    const currentExcursionPrices = currentExcursion.querySelectorAll('.excursions__price');
    const currentExcursionAdultPrice = currentExcursionPrices[0].innerText;
    const currentExcursionChildrenPrice = currentExcursionPrices[1].innerText;

    const currentExcursionAdultNumber = currentExcursion.querySelector('[name=adults]');
    const currentExcursionAdultNumberValue = currentExcursionAdultNumber.value;

    const currentExcursionChildrenNumber = currentExcursion.querySelector('[name=children]')
    const currentExcursionChildrenNumberValue = currentExcursionChildrenNumber.value;

     if( isNumber(currentExcursionAdultNumberValue) === false || currentExcursionAdultNumberValue.trim() === '') {
        addError(currentExcursionAdultNumber.parentElement , 'Number of adult must be integer number' , 'data-excursion-content');
     }

     if( isNumber(currentExcursionChildrenNumberValue) === false || currentExcursionChildrenNumberValue.trim() === '' ) {
        addError(currentExcursionChildrenNumber.parentElement , 'Number of children must be integer number' , 'data-excursion-content');
     }

    if ( isNumber(currentExcursionAdultNumberValue) === true && isNumber(currentExcursionChildrenNumberValue) === true ){

        const currentExcursionDetails =
        {
        title: currentExcursionName,
        adultPrice: currentExcursionAdultPrice,
        adultNumber: currentExcursionAdultNumberValue,
        childPrice: currentExcursionChildrenPrice,
        childNumber: currentExcursionChildrenNumberValue,
        id: Math.round( Math.random() * 10000 ),
        }

        cart.push(currentExcursionDetails);

        return true
    }

}

function isNumber(item) {

    const itemWithoutWhiteSpaces = item.trim();

    if( itemWithoutWhiteSpaces.length !== 0 ) {

        const num = Number( item );

        if( !Number.isNaN(num) && Number.isInteger(num) && num >= 0 ) {
            return true;
        }
        else{
            return false;
        }
}
}

function addError(item, errorText, dataName) {
   item.parentElement.setAttribute(dataName , errorText);
}

function clearErrors(data) {

    const errorList = document.querySelectorAll(data);

    if( data === '[data-excursion-content]') {
       errorList.forEach( function(el) {
           el.dataset.excursionContent = ""
        })
    }

    if( data === '[data-order-content]') {
       errorList.forEach( function(el) {
           el.dataset.orderContent = ""
        })
   }
}

function addExcursionIntoSummary(item) {
    const summaryDetailsPrototype = document.querySelector('.summary__item--prototype');

    const summaryDetails = summaryDetailsPrototype.cloneNode(true);
    summaryDetails.classList.remove('summary__item--prototype');
    summaryDetails.dataset.id = item[item.length - 1].id;

    const summaryName = summaryDetails.querySelector('.summary__name');
    summaryName.innerText = item[item.length - 1].title

    const summaryAdultsPrices = summaryDetails.querySelector('.summary__prices--adults');
    summaryAdultsPrices.innerText = `Dorosły: ${item[item.length - 1].adultNumber} x ${item[item.length - 1].adultPrice} PLN`

    const summaryChildrenPrices = summaryDetails.querySelector('.summary__prices--children');
    summaryChildrenPrices.innerText = `Dziecko: ${item[item.length - 1].childNumber} x ${item[item.length - 1].childPrice} PLN`

    const summaryTotalPrice = summaryDetails.querySelector('.summary__total-price');

    const CalculatedTotalPrice = item[item.length - 1].adultNumber * item[item.length - 1].adultPrice + item[item.length - 1].childNumber * item[item.length - 1].childPrice;

    summaryTotalPrice.innerText = `${CalculatedTotalPrice} PLN`;

    summaryDetailsPrototype.parentElement.appendChild(summaryDetails);

    schowSummary();
}

function schowSummary() {
    document.querySelector('.summary').style.display = 'block';
    document.querySelector('.order').style.display = 'block';
}

function setOrderTotalPrice(item) {
    const orderTotalPrice = document.querySelector('.order__total-price-value');
    let price = "";

   for(let i=0; i<item.length; i++) {
       price = parseInt(price + (item[i].adultPrice * item[i].adultNumber + item[i].childPrice * item[i].childNumber));
    }
    orderTotalPrice.innerText = `${price} PLN`;
}

function removeExcursion(e) {
    if( e.target.classList.contains('summary__btn-remove') ) {

        const deletedExcursionId = parseInt(e.target.parentElement.parentElement.dataset.id);

        for(const el in cart) {
            if( cart[el].id === deletedExcursionId ) {
              cart.splice(el , 1)
              setOrderTotalPrice(cart);
            }
        }
        e.target.parentElement.parentElement.remove();
    }
}

function sendOrder(e) {
    e.preventDefault()

    const orderTotalValue = document.querySelector('.order__total-price-value').innerText
    const userEmail = document.querySelector('[name=email]').value;

    if ( orderFormValidate() ) {

        alert(`Dziękujęmy za złożenie zamówienia o wartości ${orderTotalValue}. Wszelkie szczegóły zamówienia zostały wysłane na adres email: ${userEmail}`)
        clearOrderFormField();
        clearExcursionListInSummary();
        hideSummary();
    }
}

function orderFormValidate() {

    clearErrors('[data-order-content]');

    const nameInput = document.querySelector('[name=name]');
    const nameInputValue = nameInput.value;
    const emailInput = document.querySelector('[name=email]');
    const emailInputValue = emailInput.value;

    const regEmail = /.+@.+\.[a-z]{2,}/

    if(nameInputValue.length === 0) {
        addError(nameInput.parentElement , 'That field cannot be empty' , 'data-order-content')
    }

    if (regEmail.test(emailInputValue) === false) {
        addError(emailInput.parentElement , 'Invalid email address' , 'data-order-content')
    }

    if( regEmail.test(emailInputValue) === true && nameInputValue.length > 0) {
        return true
    }
}

function clearOrderFormField() {
    const nameInputValue = document.querySelector('[name=name]').value = "";
    const emailInputValue = document.querySelector('[name=email]').value = "";

    cart = []
}

function clearExcursionListInSummary() {

    const ExcursionListInSummary = document.querySelectorAll('.summary__item');

    for(let i=1; i<ExcursionListInSummary.length; i++) {
        ExcursionListInSummary[i].remove()
    }
}

function hideSummary() {
    document.querySelector('.summary').style.display = 'none';
    document.querySelector('.order').style.display = 'none';
}