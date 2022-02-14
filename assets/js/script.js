document.addEventListener('DOMContentLoaded', init);
let cart = [];

function init() {

    const fileEl = document.querySelector('.uploader__input');
    const excursions = getExcursionPanel();
    const summary = document.querySelector('.panel__form');

    fileEl.addEventListener('change' , readFile);
    excursions.addEventListener('click' , selectExcursion);
    excursions.addEventListener('submit' , setSummaryDetails);
    summary.addEventListener('click' , removeExcursion);
    summary.addEventListener('submit' , sendOrder);
}

function readFile(e) {
    const file = e.target.files[0];
    const regFileExtension  = /^.+\.+c+s+v$/;

    if(file && regFileExtension.test(file.name) === true) {
        const reader = new FileReader();

        reader.onload = function(readerEvent) {
            const content = readerEvent.target.result;
            const rowsInContent = splitContentForRows(content);

            rowsInContent.forEach( function(data) {
                const excursionData = prepereExcursionData(data);
                renderExcursion(excursionData);
            } );
            showCurrentExcursion();
        };
        reader.readAsText(file, 'UTF-8');
    }
    else {
        alert('Incorrect file')
    }
}

function renderExcursion(excursionData) {
    const excursionItem = createExcursionItem();
    setExcursionDetails(excursionData, excursionItem);
    addIntoExcursionPanel(excursionItem);
}

function setExcursionDetails(excursionData, excursionItem) {
    setExcursionID(excursionData, excursionItem);
    setExcursionTitle(excursionData, excursionItem);
    setExcursionDescription(excursionData, excursionItem);
    setExcursionPrice(excursionData, excursionItem);
}

function addIntoExcursionPanel(excursionItem) {
    const excursionItemPrototype = getExcursionItemPrototype();
    excursionItemPrototype.parentElement.appendChild(excursionItem);
}

function showCurrentExcursion() {
    const currentExcursion = getExcursionItemPrototype().nextElementSibling;
    toggleCurrentClass(currentExcursion);
    setPanelsVisibility();
}

function selectExcursion(e) {
    if(e.target.classList.contains('fa-arrow-right')) {
        selectNextExcursion();
        clearExcursionFormField();
    }
    if(e.target.classList.contains('fa-arrow-left')) {
        selectPreviousExcursion();
        clearExcursionFormField()
    }

    clearErrors('[data-excursion-content]');
}


function selectNextExcursion() {
    const currentExcursion = getCurrentExcursion();
    const nextExcursion = currentExcursion.nextElementSibling;
    const firstExcursions = getExcursionItemPrototype().nextElementSibling;

    nextExcursion === null ? setFirstExcursion(currentExcursion , firstExcursions) : setNextExcursion(currentExcursion , nextExcursion);
}

function selectPreviousExcursion() {
    const currentExcursion = getCurrentExcursion();
    const previousExcursion = currentExcursion.previousElementSibling;
    const lastExcursions = getExcursionPanel().lastElementChild;

    previousExcursion === getExcursionItemPrototype() ? setLastExcursion(currentExcursion, lastExcursions) : setPreviousExcursion(currentExcursion, previousExcursion);
}

function setNextExcursion(currentExcursion, nextExcursion) {
    toggleCurrentClass(currentExcursion);
    toggleCurrentClass(nextExcursion);
}

function setFirstExcursion(currentExcursion, firstExcursions) {
    toggleCurrentClass(currentExcursion);
    toggleCurrentClass(firstExcursions);
}


function setPreviousExcursion(currentExcursion, previousExcursion) {
    toggleCurrentClass(currentExcursion);
    toggleCurrentClass(previousExcursion);
}

function setLastExcursion(currentExcursion, lastExcursion) {
    toggleCurrentClass(currentExcursion);
    toggleCurrentClass(lastExcursion);
}

function getExcursionPanel() {
    return document.querySelector('.panel__excursions');
}

function getCurrentExcursion() {
    return document.querySelector('.excursions__item--current');
}

function toggleCurrentClass(item) {
    item.classList.contains('excursions__item--current') ? item.classList.remove('excursions__item--current') : item.classList.add('excursions__item--current');
}

function setPanelsVisibility() {
    const mainPanel = document.querySelector('.panel');
    mainPanel.style.justifyContent = "space-between";

    const excursionPanel = getExcursionPanel();
    excursionPanel.style.display = "flex";
}

function setExcursionID(excursionData, excursionItem) {
    excursionItem.dataset.id = excursionData[0];
}

function setExcursionTitle(excursionData, excursionItem) {
    const excursionTitle = excursionItem.querySelector('.excursions__title--content');
    excursionTitle.innerText = excursionData[1];
}

function setExcursionDescription(excursionData, excursionItem) {
    const excursionDescription = excursionItem.querySelector('.excursions__description');
    excursionDescription.innerText = excursionData[2];
}

function setExcursionPrice(excursionData, excursionItem) {
    const excursionPrice = excursionItem.querySelectorAll('.excursions__price');

    const excursionAdultPrice = excursionPrice[0];
    excursionAdultPrice.innerText = excursionData[3];

    const excursionChildrenPrice = excursionPrice[1];
    excursionChildrenPrice.innerText = excursionData[4];
}

function createExcursionItem() {
    const excursionItem = getExcursionItemPrototype().cloneNode(true);
    excursionItem.classList.remove('excursions__item--prototype');
    return excursionItem;
}

function getExcursionItemPrototype() {
    return document.querySelector('.excursions__item--prototype');
}

function prepereExcursionData(element) {
    return element.substr(1, element.length-2).split(/["+"]\W+/);
}

function splitContentForRows(content) {
    return content.split(/[\r\n]+/gm);
}

function setSummaryDetails(e) {
    e.preventDefault();

    if( validateExcursionDetails() ) {
        addExcursionToCart();
        renderSummaryItem(cart);
        setOrderTotalPrice(cart);
        clearExcursionFormField()
    }
}

function validateExcursionDetails() {

    if( !isInteger( getCurrentExcursionAdultNumberValue() )) {
        addError( getCurrentExcursionAdultNumberField(), 'Number of adult must be integer number' , 'data-excursion-content');
        return false;
    }
    else if( !isInteger( getCurrentExcursionChildrenNumberValue() )) {
        addError( getCurrentExcursionChildrenNumberField(), 'Number of children must be integer number' , 'data-excursion-content');
        return false;
    }
    return true
}

function addExcursionToCart() {
    const currentExcursionDetails = createCurrentExcursionDetails();
    cart.push( currentExcursionDetails );
}

function renderSummaryItem(data) {
    const summaryItem = createSummaryItem();
    setSummaryItemDetails(data, summaryItem);
    addIntoSummaryPanel(summaryItem);
    schowSummaryPanel();
}

function setOrderTotalPrice(data) {
    const orderTotalPrice = getOrderTotalPriceField();
    let price = "";

    for(let i=0; i<data.length; i++) {
        price = parseInt(price + (data[i].adultPrice * data[i].adultNumber + data[i].childPrice * data[i].childNumber));
    }
    orderTotalPrice.innerText = `${price} PLN`;
}

function clearExcursionFormField() {
    getCurrentExcursionAdultNumberField().value = "";
    getCurrentExcursionChildrenNumberField().value = "";
}

function createCurrentExcursionDetails() {

    return currentExcursionDetails = {
        title: getCurrentExcursionName(),
        adultPrice: getCurrentExcursionAdultPrice(),
        adultNumber: getCurrentExcursionAdultNumberValue(),
        childPrice: getCurrentExcursionChildrenPrice(),
        childNumber: getCurrentExcursionChildrenNumberValue(),
        id: Math.round( Math.random() * 10000 ),
    };
}

function getCurrentExcursionName() {
    const currentExcursion = getCurrentExcursion();
    return currentExcursion.querySelector('.excursions__title--content').innerText;
}

function getCurrentExcursionPrices() {
    const currentExcursion = getCurrentExcursion();
    return currentExcursion.querySelectorAll('.excursions__price');
}

function getCurrentExcursionAdultPrice() {
    const currentExcursionPrices = getCurrentExcursionPrices();
    return currentExcursionPrices[0].innerText;
}

function getCurrentExcursionChildrenPrice() {
    const currentExcursionPrices = getCurrentExcursionPrices();
    return currentExcursionPrices[1].innerText;
}

function getCurrentExcursionAdultNumberField() {
    const currentExcursion = getCurrentExcursion();
    return currentExcursion.querySelector('[name=adults]');
}

function getCurrentExcursionAdultNumberValue() {
    return getCurrentExcursionAdultNumberField().value;
}

function getCurrentExcursionChildrenNumberField() {
    const currentExcursion = getCurrentExcursion();
    return currentExcursion.querySelector('[name=children]');
}

function getCurrentExcursionChildrenNumberValue() {
    return getCurrentExcursionChildrenNumberField().value;
}

function isInteger(item) {
    const itemWithoutWhiteSpaces = item.trim();

    if( itemWithoutWhiteSpaces.length !== 0 ) {
        const num = Number( item );
        if( !Number.isNaN(num) && Number.isInteger(num) && num >= 0 ) { return true; }
    }
    return false;
}

function addError(item, errorText, dataName) {
   item.parentElement.parentElement.setAttribute(dataName , errorText);
}

function clearErrors(data) {
    const errorList = document.querySelectorAll(data);

    if( data === '[data-excursion-content]') {
       errorList.forEach( function(el) {
           el.dataset.excursionContent = ""
        })
    }
    errorList.forEach( function(el) {
        el.dataset.orderContent = ""
     })
}

function setSummaryItemDetails(data, summaryItem) {
    setSummaryItemID(data, summaryItem);
    setSummaryItemTitle(data, summaryItem);
    setSummaryPrices(data, summaryItem);
}

function setSummaryItemID(data, summaryItem) {
    summaryItem.dataset.id = data[data.length - 1].id;
}

function setSummaryItemTitle(data, summaryItem) {
    const summaryTitle = summaryItem.querySelector('.summary__name');
    summaryTitle.innerText = data[data.length - 1].title;
}

function setSummaryPrices(data, summaryItem) {
    const summaryAdultsPrices = summaryItem.querySelector('.summary__prices--adults');
    summaryAdultsPrices.innerText = `Dorosły: ${data[data.length - 1].adultNumber} x ${data[data.length - 1].adultPrice} PLN`;

    const summaryChildrenPrices = summaryItem.querySelector('.summary__prices--children');
    summaryChildrenPrices.innerText = `Dziecko: ${data[data.length - 1].childNumber} x ${data[data.length - 1].childPrice} PLN`;

    const summaryTotalPrice = summaryItem.querySelector('.summary__total-price');
    const calculatedTotalPrice = data[data.length - 1].adultNumber * data[data.length - 1].adultPrice + data[data.length - 1].childNumber * data[data.length - 1].childPrice;

    summaryTotalPrice.innerText = `${calculatedTotalPrice} PLN`;
}

function createSummaryItem() {
    const summaryItem = getSummaryItemPrototype().cloneNode(true);
    summaryItem.classList.remove('summary__item--prototype');
    return summaryItem;
}

function getSummaryItemPrototype() {
    return document.querySelector('.summary__item--prototype');
}

function addIntoSummaryPanel(summaryItem) {
    const summaryItemPrototype = getSummaryItemPrototype();
    summaryItemPrototype.parentElement.appendChild(summaryItem);
}

function schowSummaryPanel() {
    getSummaryPanel().style.display = 'block';
    getOrderPanel().style.display = 'block';
}

function hideSummaryPanel() {
    getSummaryPanel().style.display = 'none';
    getOrderPanel().style.display = 'none';
}

function getSummaryPanel() {
    return document.querySelector('.summary');
}

function getOrderPanel() {
    return document.querySelector('.order');
}

function getOrderTotalPriceField() {
    return document.querySelector('.order__total-price-value');
}

function removeExcursion(e) {
    if( e.target.classList.contains('summary__btn-remove') ) {

        const deletedExcursionId = parseInt(e.target.parentElement.parentElement.dataset.id);

        for(const el in cart) {
            if( cart[el].id === deletedExcursionId ) {
              cart.splice(el , 1);
              setOrderTotalPrice(cart);
            }
        }
        e.target.parentElement.parentElement.remove();
    }
}
function sendOrder(e) {
    e.preventDefault();

    const orderTotalValue = getOrderTotalPriceField().innerText;
    const userEmailValue = getEmailInput().value;

    if ( orderFormValidate() ) {

        alert(`Dziękujęmy za złożenie zamówienia o wartości ${orderTotalValue}. Wszelkie szczegóły zamówienia zostały wysłane na adres email: ${userEmailValue}`)
        clearOrderFormField();
        clearExcursionListInSummary();
        hideSummaryPanel();
        cart = [];
    }
}

function orderFormValidate() {
    clearErrors('[data-order-content]');

    console.log(getNameInput())
    const nameInputValue = getNameInput().value;
    const emailInputValue = getEmailInput().value;
    const regEmail = /.+@.+\.[a-z]{2,}/

    if(nameInputValue.length === 0) {
        addError( getNameInput(), 'That field cannot be empty' , 'data-order-content');
    }
    if (regEmail.test(emailInputValue) === false) {
        addError( getEmailInput(), 'Invalid email address' , 'data-order-content');
    }
    if( regEmail.test(emailInputValue) && nameInputValue.length > 0) {
        return true
    }
}

function clearOrderFormField() {
    getNameInput().value = "";
    getEmailInput().value = "";
}

function clearExcursionListInSummary() {
    const excursionListInSummary = document.querySelectorAll('.summary__item');

    for(let i=1; i<excursionListInSummary.length; i++) {
        excursionListInSummary[i].remove()
    }
}

function getNameInput() {
    return document.querySelector('[name=name]');
}

function getEmailInput() {
    return document.querySelector('[name=email]');
}


