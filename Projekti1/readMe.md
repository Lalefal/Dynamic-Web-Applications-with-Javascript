Web-sovellusten kehittäminen Javascriptillä TO00BL10-3018
Projekti 1, ToDo-lista

Linkki Netlifyihin 
https://to00bl10projekti1.netlify.app/

Mitä tuli tehtyä
Melkein toimiva todo-lista. Listalle syötetään uusi tieto listan alareunassa olevassa input fieldissä.
"Lisää rivi"-nappia painaessa funktio lisääRivi
  1. Tarkistaa, että syöte on vähintään 2 merkkiä
  2. Jos syöte on lyhyempi tai se puuttuu, käyttäjää huomautetaan asiasta alertilla ja oranssilla värillä
  3. Jos syöte hyväksytään, se ilmestyy listalle ja tallentuu local storageen
  4. Lopuksi input field tyhjenee ja siihen tulee uusi placeholder-teksti
  
Kun listalla oleva asia on tehty, checkboxia klikkaamalla tekstin saa yliviivattua (funktio yliViiva).
"Poista valitut"-nappi poistaa listasta ja local storagesta ne rivit, joissa checkbox on valittu (funktio poistaRivi).

Napit toimivat addEventListenerin kautta.

Jos käyttäjä poistuu sivulta, edellisellä kerralla tekemättä jääneet asiat pysyvät listalla ja tulevat 
näkyviin seuraavalla käynnillä (funktio haeTiedot). Vaatii jatkokehitystä, että myös edellisen kerran yliviivaukset tulisivat näkyviin.

Tehtävää tuli jumpattua monta päivää ja aloitin sen kolme kertaa alusta koska en saanut sitä toimimaan haluamallani tavalla. 
Lopullinen tuotos on yhä turhan vaikeasti tehty, erityisesti ongelmia tuotti tallennus, tallennettujen tietojen hakeminen ja
poistaminen. Ongelma aiheutui avain-arvo-parien avaimista, joiden nimeäminen ei toimi kunnolla: eivät ole riittävän uniikkeja.
Neljättä päivää jumpatessa päätin kysäistä apua ChatGPT:ltä. Eipä tuokaan heti (tai edes myöhemmin) osannut ratkaista vastaan tulleita ongelmia, 
mutta ainakin kehityin kysymyksen muotoilussa ja tarkentamisessa sekä lisäkysymysten esittämisessä.
Ja tavoitteenani on oppia JavaScriptiä, joten käytin aikaa myös siihen, että ymmärsin miten (toimiva) funktio toimii.

Muutama bugi siis löytyy, mutta olen silti tyytyväinen tuotokseen, sen verran haastavaa sen rakentaminen oli :)

Lähteet
- luentomateriaalit ja workshop-tehtävät
- tuntiesimerkit ja opettajan Codepen
- w3schools.com
- stackoverflowsta löytyi ratkaisu yhteen ongelmaan
- uusi bestikseni ChatGTP
