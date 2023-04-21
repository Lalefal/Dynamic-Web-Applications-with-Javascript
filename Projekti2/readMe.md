Web-sovellusten kehittäminen Javascriptillä TO00BL10-3018

Projekti 2a, Aikatauluhaku

Linkki <a href="https://lalefal-aikatauluhaku.netlify.app/" target="_blank">Netlifyihin</a>

Mitä tuli tehtyä

Sovellus, jossa käyttäjä valitsee lähtöaseman ja saa näkyviin valitulta asemalta lähtevät junat:
   - Junan kirjain
   - Junan lähtöraide
   - Junan lähtöaika (nykyisestä ajasta eteenpäin)
   - Junan määränpää
 
Käyttäjä voi valita lähtöaseman alasvetovalikosta tai kirjoittamalla aseman nimen itse.
 - Tein ensin alasvetovalikkovaihtoehdon. Kun sain sen toimimaan, tein myös input field-vaihtoehdon
 - Valittavana on pääradan asemat
 - Jos asema valitaan alasvetovalikosta, haku käynnistyy automaattisesti
 - Jos aseman nimi kirjoitetaan itse, haku käynnistyy painamalla enteriä tai "Hae"-buttonia
 - Jos käyttäjä kirjoittaa aseman, jota ei löydy, asiasta huomautetaan alertilla
 - Haun jälkeen input fieldiin tulee place holderiksi haetun aseman nimi
<br>
Haastavinta tehtävässä oli päästä käsiksi haluttuun tietoon: saatu objekti on muodossa<br><br>

[ {0[ {0}{1}{...}{68} ]} {1[ {0}{1}{...}{64} ]} {...[ {0}{1}{...}{68} ]} {104[ {0}{1}{...}{68} ]} ]
<br><br><br>
Kaikista vaikein oli saada haettua näytettävien junian pääteasemat:<br>

[ {0[ {0}{1}{...}{**68:tämä**} ]} {1[ {0}{1}{...}{**64:tämä**} ]} {...[ {0}{1}{...}{**68: tämä**} ]} {104[ {0}{1}{...}{**68: tämä**} ]} ]

<br><br>
Usean päivän yrityksen ja erehdyksen kautta sain valittua oikeat tiedot näytettäväksi ja olen oikein tyytyväinen lopputulokseen :)

<br><br>
Muita huomioita:
- Yritin kauan muokata input fieldin alle tulevaa datalistiä saman levyiseksi kuin input field. En saanut
  ominaisuutta toimimaan kunnolla, joten luovuin siitä. Jälkeenpäin huomasin, että datalistin sijainti riippuu
  käytettävästä selaimesta: Edgessä se menee itsestään input fieldin alle samanlevyisenä kuin input field. Chromessa
  datalist näkyy kapeana listana input fieldin vasemmassa listassa (tätä en saanut muokattua haluamakseni).

Lähteet
- Luentomateriaalit ja workshop-tehtävät
- <a href="https://www.w3schools.com/js/default.asp" target="_blank">w3schools.com</a> 
- Digitraffic: <a href="https://www.digitraffic.fi/rautatieliikenne/" target="_blank">Rautatieliikenne</a> 
- Ulkoasu on tehty w3schoolin <a href="https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_temp_webpage&stacked=h" target="_blank">templaten</a> avulla
- Välillä tuli juteltua ChatGPT:n kanssa    

Liikennetietojen lähde <a href="https://www.digitraffic.fi" target="_blank">Fintraffic</a> Lisenssi CC 4.0 BY
