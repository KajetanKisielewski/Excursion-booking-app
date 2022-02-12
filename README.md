> ⭐ ***README** to coś więcej niż opis. Poprzez nie **pokazujesz swoje mocne strony** – swoją dokładność, sposób myślenia i podejście do rozwiązywania problemów. Niech Twoje README pokaże, że masz **świetne predyspozycje do rozwoju!***
>
> 🎁 *Zacznij od razu. Skorzystaj z **[szablonu README i wskazówek](https://github.com/devmentor-pl/readme-template)**.*

&nbsp;


# JavaScript: Formularze

Zdobyliśmy zlecenie, które zostało porzucone przez poprzedniego programistę, a polega na składaniu zamówienia na wycieczki, które są importowane z pliku CSV.

Mamy cześć kodu HTML i CSS napisanego. Naszym zadaniem będzie utworzenie logiki i prezentacji.

To oznacza, że tym razem nie tylko działamy w JavaScript, ale będziemy musieli ostylować wg. własnego uznania poszczególne elementy, aby lepiej się prezentowanły.

## Wymagania Klienta

Klient oczekuje, że użytkownik strony będzie mógł załadować sobie za pomoca formularza (`.uploader__input`) [plik CSV](https://pl.wikipedia.org/wiki/CSV_(format_pliku)), na podstawie które zostaną do strony dodane wycieczki.

We wspomianym pliku mamy w każdym wierszu przedstawione dane na temat jednej wycieczki. Wartości są rozdzielone przeciankami są nimi kolejno: *id*, *nazwa*, *opis*, *cena za dorosłego* oraz *cena za dziecko*.

Po załadowaniu wycieczek. Użytkownik może wybrać dowolną wycieczkę poprzez wprowadzenie liczby osób dorosłych i dzieci oraz kliknięcie przycisku "dodaj do zamówienia".

Po kliknięciu na przycisk (`.excursions__field-input--submit`) w podsumowaniu (`.summary`) pojawia się kolejny element na liscie, który zawiera wybrane elmenty. Jednocześnie cena za całość (`.order__total-price-value`) ulega zmianie.

Każda zamówienona wycieczka może zostać usunięta z listy klikając w odpowiedni element tj. `.summary__btn-remove`.

Po wybraniu przez użytkownika odpowiednich wycieczek może on złożyć zamówienie wypełniając formularz zamówiania tj. `.order`.

Przed wysłanie formularza musimy sprawdzić czy pola zostały prawidłowo wypełnione tj. *Imię i nazwisko nie możę być puste*, natomiast *adres email musi być prawidłowy* (np. zawierać znak małpy tj *@)*.

Jeśli dane są nie poprawne to należy utworzyć w kodzie HTML stosowne miejsce i tam dodawać odpowiednie komunikaty.

Gdy wszystko przebiegło prawidłowo należy wykorzystać `alert()` w celu wyświetlenia komunikatu:

> Dziękujęmy za złożenie zamówienia o wartości 199PLN. Wszelkie szczegóły zamówienia zostały wysłane na adres email: adres@wpisanywformularzu.pl.

Natomiast formularz jak również lista wybranych wycieczek zostaje wyczyszczona.

## Implementacja

Zawsze rozwiązując jakiś problem czy wykonując realizację powinniśmy podzielić je na miejscze cześci.

Tutaj ewidentnie można podzielić zadanie na kilka części

* ładowanie wycieczek
* dodawanie wycieczek do listy zamówionych
* obsługa formularza

Każdy z tych elementów powinniśmy wykonać jak wcześniejsze zostało wykonane prawidłowo (działa).

Poszczególne elementy tj. np. "ładowanie wycieczek" też możemy podzielić na miejsce cześci. Zawsze powinnośmy się zastanowić jakie jest kolejne (najbliższe) działanie, które jest niezbędne do osiągnięcia celu.

Mając "ładowanie wycieczek" powinniśmy zrealizować po koleji:
* obsługa wybrania pliku przez użytkownika
* pobranie jego zawartości
* podział zawartości na wiersze
* podział wiersza na poszczególne elementy (id, nazwa itp.)
* utworzenie odpowiednich elementów HTML i wypełnienie danymi
* dodanie ich do drzewa DOM

W ten sposób powinniśmy działać z pozostałymi zadaniami.

### CSV

Przyjrzyjmy się na chwilę [plikowi CSV](./example.csv), który może się prezentować w ten sposób:

```
"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99","50"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40","15"
```

Jeśli te dane mielibyśmy zapisane w zmiennej `const text` to zamienienie tego ciagu znaków na tablicę, w której każdy element to wiersz mogłoby wyglądać w ten sposób:

```
const lines = text.split(/[\r\n]+/gm);
```

W zależności od systemu operacyjnego znak nowej lini to `\n`, `\r` lub `\r\n` dlatego używamy wyrażenie ragularnego w celu podzielenie tekstu na wiersze.

Podział na "kolumny" będzie troszkę trudniejszy ponieważ podział względem przecinka nie zadziała nam zbyt dobrze ponieważ ten znak może się też znajdować w treści opisu.

Ten problem zostawiam już Tobie do rozwiązania ;)

### Zdarzenia

Zuważ, że wycieczki są tworzone dynamicznie przez wybranie odpowedniego pliku. To powoduje, że w momencie załadowania drzewa DOM nie możemy ich wyszukać i tym bardziej utworzyć nasłuchiwania.

Jednak od czego jest propagacja? Może warto zrobić nasłuchiwanie na elemencie, który istnieje w drzewie DOM (`.excursions`) i sprawdzać co wywołuje dane zdarzenie (`e.target` lub `e.currentTarget`).

### Koszyk

Przechowywanie wybranych wycieczek to pewna forma koszyka jak w sklepie internetowym. Mamy przedmiot oraz jego ceną i ilość (x2 bo dla dorosłych i dzieci).

Może po prostu warto utworzyć sobie zmienną `const basket = []` i tam `push`-ować obiekt z odpowiednimi danymi tj.

```
{
    title: 'Ogrodzieniec',
    adultNumber: 1,
    adultPrice: 99,
    childNumber: 2,
    childPrice: 50,
}
```

### Prototypy

Zauważ, że w kodzie wystąpują prototypy (`.*--prototype`) są one używane tylko po to, aby ułatwić prezentację danych. Możesz je modyfikować jeśli uważasz, że to Ci pomoże w tworzeniu logiki (np. dataset).

Docelowo mają być one niewidoczne - możesz je ukryć przy pomocy CSS (`display: none`). Natomiast może warto je wykorzystać do skopiowania struktury kodu HTML, aby nie musieć tego robić w kodzie JS.



&nbsp;

> ⭐ ***README** to coś więcej niż opis. Poprzez nie **pokazujesz swoje mocne strony** – swoją dokładność, sposób myślenia i podejście do rozwiązywania problemów. Niech Twoje README pokaże, że masz **świetne predyspozycje do rozwoju!***
>
> 🎁 *Zacznij od razu. Skorzystaj z **[szablonu README i wskazówek](https://github.com/devmentor-pl/readme-template)**.*

