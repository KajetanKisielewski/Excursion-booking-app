document.addEventListener('DOMContentLoaded', init);

function init() {

    const fileEl = document.querySelector('.uploader__input');
    fileEl.addEventListener('change' , readFile);

    const nextExcursion = document.querySelector('.excursions__nav--next');
    nextExcursion.addEventListener('click' , chooseExcursion)

    const prevExcursion =  document.querySelector('.excursions__nav--prev');
}


// GET CSV DATA


function readFile(e) {
    const file = e.target.files[0];
    const regFileExtension  = /^.+\.+c+s+v$/;

    if(file && regFileExtension.test(file.name) === true) {
        const reader = new FileReader();

        reader.onload = function(readerEvent) {
            const content = readerEvent.target.result;
            const rowsInContent = content.split(/[\r\n]+/gm);

            rowsInContent.forEach( function(element) {
                const element1 = element.substr(1, element.length-2).split(/["+"]\W+/);
                setExcursionDetails(element1);
            } )
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
    excursionTitle.innerText = item[1]

    const excursionDescription = excursionDetails.querySelector('.excursions__description');
    excursionDescription.innerText = item[2]

    const excursionPrice = excursionDetails.querySelectorAll('.excursions__price');

    const excursionAdultPrice = excursionPrice[0];
    excursionAdultPrice.innerText = item[3]

    const excursionChildrenPrice = excursionPrice[1];
    excursionChildrenPrice.innerText = item[4];

    excursionDetailsPrototype.parentElement.appendChild(excursionDetails);
    excursionDetailsPrototype.style.display = "none" ;
}


function chooseExcursion() {

    const Excursions = document.querySelector('.panel__excursions');
    const Excursion = document.querySelectorAll('.excursions__item');
    console.log(Excursion)
}