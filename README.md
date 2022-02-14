# JavaScript - Excursion booking app

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
  - [How it works](how-it-works)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I Learned](#what-i-learned)
  - [Solutions](solutions)
    - [CSV file](csv-file)
    - [Pure CSS tooltips](pure-css-tooltips)
  - [Useful resources](useful-resources)
- [Author](#author)
- [Special thanks](#special-thanks)


## Overview

![](./assets/img/Animation.gif)


### Links:

- Code: [See my code](https://github.com/KajetanKisielewski/Excursion-booking-app)
- Live: [Check it out](https://kajetankisielewski.github.io/Excursion-booking-app/)


### The challenge

This project was created to develop and improve my skills in JavaScript Forms. The task was to create an application for ordering excursions. Excursions are added to the website by uploading a CSV* file via the form.

***To test how project works please download CSV file from my repository.**

### How it works

In the CSV file at every row we have information about single excursion: *ID*, *Excursion name*, *Description*, *Price for adult* and *Price for children*.

After uploading the CSV file, user is able to choose any excursion by entering the number of adult and children and clicked the confirm button * **Dodaj do zamówienia** *

After clicking the confirm button, at summary panel appears chosen excursion, in every moment user can remove excursion by click the  * **X** *. Total Price is dynamicly update.

The next step is to fill the form by entering the *name* and *email*, then user must confirm the order by clicking the button * **Zamawiam** *. If all was do correctly, user get information about thanksing for sumbit an order and sending the details at provided email.

## My Process

### Built with

- HTML
- CSS ( includes custom properties )
- BEM methodology
- Regex
- JavaScript


### What I learned

Working at this project I gained knowledge about regex expressions, I realized how powerfull tool is that. I learned about a new format for storing data in text files, i.e. CSV. I became familiar with the FileReader object and learned to work with it. ***One of the greatest values ​​learned from this project was realizing how important and helpful it is to write clean and easy to modify code, avoid repetition and use the principle of single responsibility.***

### Solutions

**Below I present interesting solutions:**

#### CSV file

Let's take a look at a CSV file, which might look like this:

```html
"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99","50"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40","15"
```

First challenge was split this content at rows, I achieved in the following way:

````js
function splitContentForRows(content) {
    return content.split(/[\r\n]+/gm);
}
````

The division into columns was definitely more difficult, the intended effect I achieved in the following way:

````js
function prepereExcursionData(element) {
    return element.substr(1, element.length-2).split(/["+"]\W+/);
}
````

#### Pure CSS tooltips

JS - function that adds error text to the data attribute:

````js
function addError(item, errorText, dataName) {
   item.parentElement.parentElement.setAttribute(dataName , errorText);
}
````

CSS - pseudoelement:

````css
.itemClass::after {
    content: attr(dataName)
}
````

## Useful resources

- [Regex - study materials [PL]](http://kursjs.pl/kurs/regular/regular.php)
- [Regex - 'Learn Regular Expressions In 20 Minutes'](https://www.youtube.com/watch?v=rhzKDrUiJVk&ab_channel=WebDevSimplified)

## Author

- Github - [Kajetan Kisielewski](https://github.com/KajetanKisielewski)
- LinkedIn - [Kajetan Kisielewski](https://www.linkedin.com/in/kajetan-kisielewski-157b60208/)

## Special thanks

Thanks to my [Mentor - devmentor.pl](https://devmentor.pl/) - for providing me with this task and for code review.


