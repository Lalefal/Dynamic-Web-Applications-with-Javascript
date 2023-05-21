Web-sovellusten kehittäminen Javascriptillä TO00BL10-3018

Projekti 2b, Aikatauluhaku jQueryllä

Mitä tuli tehtyä

<a href="https://lalefal-junahaku.netlify.app/" target="_blank">Sovellus</a>, jolla käyttäjä voi hakea haluamansa juna-aseman aikataulut.
Käyttäjä voi valita 
- lähtöaseman
- junan suunnan: kaikki suunnat, Helsinkiin päin menevät tai valittu kohdeaseman.

Parannuksena edelliseen versioon:
- inputin datalist sekä asemien nimiä vastaavat lyhenteet haetaan Digitrafficin apista
- valittavana on kaikki Suomen juna-asemat, joissa henkilöjunat pysähtyvät
- mikäli juna on myöhässä, aikataululistauksessa näkyy arvioitu myöhästyminen minuutteina
- aikataululistauksessa on hover
- aktiivinen inputfield vaihtaa väriä

- käyttäjä saa alertin, mikäli aseman nimeä ei löydy
- käyttäjä saa tiedon, mikäli annetuilla hakuehdoilla ei löydy tuloksia
- käyttäjä saa tiedon "Hakuasi etsitään", kun hakuun on kulunut 2 sekuntia sekä tiedon "Haku yhä kesken...", kun aikaa on kulunut 10 sekuntia

Sovellus oli kolmen eri ryhmän kokeiltavana ja muokkasin sitä käyttäjien palautteen perusteella.



Lähteet
 - Luentomateriaalit
 - <a href="https://www.w3schools.com/jquery/default.asp" target="_blank">w3schools.com</a> 
 - Digitraffic: <a href="https://www.digitraffic.fi/rautatieliikenne/" target="_blank">Rautatieliikenne</a> 
 - Ulkoasu on tehty w3schoolin <a href="https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_temp_webpage&stacked=h" target="_blank">templaten</a> avulla
 - Välillä tuli juteltua ChatGPT:n kanssa    

Liikennetietojen lähde <a href="https://www.digitraffic.fi" target="_blank">Fintraffic</a> Lisenssi CC 4.0 BY
