var asemat = {};
//console.log(asemat);

function fetchAsemat() { //haetaan tiedot juna-asemien nimistä ja lyhenteistä, tallennetaan ne objektiin 'asemat'

  return fetch("https://rata.digitraffic.fi/api/v1/metadata/stations")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.forEach(function(asema) {
        if (asema.passengerTraffic === true) {
          var nimi = asema.stationName.replace(" asema", ""); //poistetaan nimestä sana "asema"
          asemat[nimi] = asema.stationShortCode;
        }
      });
      //console.log(data);
      return asemat;
    })
    .then(function(asemat) { //tehdään sisältö datalistiin
      var optionsHtml = '';
      for (var asema in asemat) {
        optionsHtml += `<option value="${asema}">`;
      }
      $('#asemalista').append(optionsHtml);
    });
}



//haetaan halutun aseman aikataulut käyttäjän antamien hakuehtojen mukaan
function haeTiedot(osoite, asema) {

  var startTime = new Date(); // tallennetaan hakemisen aloitusaika

    // Tsekataan hakemisen kesto 2 sekunnin jälkeen
    var timeout1 = setTimeout(function() {
      var currentTime = new Date();
      var elapsedTime = currentTime - startTime; // lasketaan kulunut aika
      if (elapsedTime >= 2000) { 
        $("#info").append($("<span>").text("Hakuasi etsitään...")).slideDown(); // lisätään span viesti diviin #info
      }
    }, 2000);  
    // Tsekataan hakemisen kesto 10 sekunnin jälkeen
    var timeout2 = setTimeout(function() {
      var currentTime = new Date();
      var elapsedTime = currentTime - startTime; 
      if (elapsedTime >= 10000) { 
        $("#info").append($("<span>").text("Haku yhä kesken...")).slideDown(); // lisätään span viesti diviin #info
      }
    }, 10000);

// Simuloi viivästystä 5 sekuntia
//setTimeout(function() {
//console.log("Fetch-vastaus viivästyy..."); 

  fetch ("https://rata.digitraffic.fi/api/v1/live-trains/station/" + osoite)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {

      clearTimeout(timeout1); // perutaan aikaraja 2 sekunnin jälkeen
      clearTimeout(timeout2); // perutaan aikaraja 10 sekunnin jälkeen
      $("#info span").remove(); // poistetaan aiemmin lisätyt spanit
      console.log(data);
      naytaTiedot(data, asema);

    }) //;
    .catch(function(error) {
      clearTimeout(timeout1); // perutaan aikaraja 2 sekunnin jälkeen
      clearTimeout(timeout2); // perutaan aikaraja 10 sekunnin jälkeen
      $("#info span").remove(); // poistetaan aiemmin lisätyt spanit
      $("#info").append($("<span>").text("Hakutulosten hakemisessa tapahtui virhe.")).slideDown(); // lisätään span viesti diviin #info
    });

// }, 5000); // Simuloi viivästystä 5 sekuntia
}

//valitaan, mitä näytetään
function naytaTiedot(data, asema) {

  var lahtoajat = [];
  var nyt = new Date();
  console.log(lahtoajat);

  $.each(data, function(i, paketti) {
    var juna = "";
    var raide = "";
    var aika = "";
    var minne = "";
    var numero = "";
    var aika2 = ""; //onko juna myöhässä?
    
    $.each(paketti.timeTableRows, function(j, aikatauluRivit) {
      if (aikatauluRivit.stationShortCode == asema && aikatauluRivit.type == "DEPARTURE" && (paketti.trainCategory == "Commuter" || paketti.trainCategory == "Long-distance" )) {
        var viimeinenRivi = paketti.timeTableRows.length - 1;
        var viimeinenObjekti = paketti.timeTableRows[viimeinenRivi];
        var paattari1 = viimeinenObjekti.stationShortCode;
        var paattari = "";
        
        if (paketti.commuterLineID == "") {
          juna = "IC " + paketti.trainNumber;
        } else { 
          juna = paketti.commuterLineID; 
        }

        raide = aikatauluRivit.commercialTrack;
        
//I ja P junat pyörivät ympyrää, joten oikean päättärin aikaansaamiseksi täytyy tehdä muutama mutka
var toLen = ["ILA", "HPL", "POH", "KAN", "MLO", "MYR", "LOH", "MRL", "VKS", "VEH", "KTÖ", "AVP"];
var fromLen = ["LNÄ", "HKL", "TKL", "PLA", "TNA", "ML", "PMK", "OLK", "KÄP"];

        $.each(asemat, function(key, value) { //haetaan päättärin shortCodea vastaava nimi objektista 'asemat'
          if (value === paattari1) {
              paattari = key; //kerrotaan, millä ehdoilla päättäri on Lentoasema
              if ( asema === "HKI" && (juna === "P" || juna === "I" )){
                paattari = "Lentoasema"
              } else if (asema =="PSL" && juna === "P" && raide === "11"){
                paattari = "Lentoasema"
              } else if (asema =="PSL" && juna === "I" && raide === "2"){
                paattari = "Lentoasema"
              } else if (juna === "P" && toLen.includes(asema)) {
                paattari = "Lentoasema"
              } else if (juna === "I" && fromLen.includes(asema)) {
                paattari = "Lentoasema"
              }
           return false; // lopetetaan silmukka
          }
        });
        

        minne = paattari;
        numero = aikatauluRivit.trainNumber;

        //console.log("juna, junaNro ja päättäri: " + juna + " " + numero + " " + paattari);
        
        aika = new Date(aikatauluRivit.scheduledTime);

        if (aikatauluRivit.differenceInMinutes != null && aikatauluRivit.differenceInMinutes != 0){ //tsekataan, onko juna myöhässä
          aika2 = "+" + aikatauluRivit.differenceInMinutes + " min"; //lisätään tieto junan myöhästymisestä
        } else {
          aika2 ="";
        }
        
        if (aika >= nyt) {
          lahtoajat.push({
            juna: juna,
            raide: raide,
            numero: numero,
            minne: minne,
            aika2: aika2,
            aika: aika.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            aikaleima: aika
          });
        }
      }
    });
  //}
  });
  
  lahtoajat.sort(function(a, b) {
    return a.aikaleima - b.aikaleima;
  });


  //luodaan table
if (lahtoajat.length > 0) {
  var table = $("<table>");
  var headerRow = $("<tr>").appendTo(table);
    $("<th>").text("Juna").appendTo(headerRow);
    $("<th>").text("Raide").appendTo(headerRow);
    $("<th>").text("Aika").appendTo(headerRow);
    $("<th>").text("").appendTo(headerRow);
    $("<th>").text("Minne").appendTo(headerRow).css('text-align', 'left');


    $.each(lahtoajat, function(index, juna) {
      var row = $("<tr>").appendTo(table);
      $("<td>").text(juna.juna).appendTo(row);
      $("<td>").text(juna.raide).appendTo(row);
      $("<td>").text(juna.aika).appendTo(row);
      $("<td>").text(juna.aika2).appendTo(row).css({'color':'red','text-align':'left'}); //myöhästyminen näytetään punaisella
      $("<td>").text(juna.minne).appendTo(row).css('text-align', 'left');
      //$("<td>").text(juna.numero).appendTo(row);
    });

          
  $("#info").append(table).slideDown("slow");  //näytetään aikatauluTable
        console.log("Valmis!"); 
   } else {     //span, mikäli käyttäjän hakuehdot eivät tuota tulosta
     $("#info").append($("<span>").text("Antamillasi hakuehdoilla ei löytynyt tuloksia. Tarkista, että lähtöasema ja määränpää ovat saman junaradan varrella.")).slideDown(); // lisätään span viesti diviin #info
     resultFound = true; 
   }


$("tr").on("mouseenter", function() {
   $(this).css("background-color", "#cccccc"); //valittu inbutboksi vaihtaa taustaväriä
  }).on("mouseleave", function() {
   $(this).css("background-color", "");
 });


 //alla oleva poistui käytöstä, ei ollut kätevä
//tyhjentää hakusana-inputin ja laittaa placeholderiksi edellisen haun sanan
// var hakuSana = $("#kirjoitaAsema").val();
// $("#kirjoitaAsema").val("").attr("placeholder", hakuSana);

// var hakuSana2 = $("#muualle_input").val();
// $("#muualle_input").val("").attr("placeholder", hakuSana2);

}



//DOCUMENT READY ALKAA TÄSTÄ
$(document).ready(function() { 

  fetchAsemat();

$('#kirjoitaAsema').val(''); //tyhjennetään edellinen haku, mikäli sivu päivitetään
$('#muualle_input').val('');
  

$("#muualle").click(function(){ // inputboksi näkyviin mikäli käyttäjä valitsee tämän vaihtoehdon
  $("#muualle_input").slideToggle();

});

$("#hakuForm").submit(function(event) { //aloitetaan hakeminen
  event.preventDefault(); // estää lomakkeen lähettämisen ennenaikaisesti
  $("#info").empty(); //tyhjennetään edellisen haun aikataulutablen

  var asema = ""
  var ekaArvo = $("#kirjoitaAsema").val(); //käyttäjän kirjoittama asema
  var arvo = ekaArvo.charAt(0).toUpperCase() + ekaArvo.slice(1).toLowerCase(); //laitetaan oikeaan kirjoitusmuotoon
  if (asemat.hasOwnProperty(arvo)) { //haetaan aseman nimeä vastaava stationShortCode objektista 'asemat'
     asema = asemat[arvo];  
    } else {
     alert("Lähtöasemaa ei löydy");
    }

  var osoite="";
  var valittuSuunta = '';
  if ($('#hki').is(':checked')) { //tsekataan käyttäjän valitsema suunta ja muodostetaan oikeat urlit
    valittuSuunta = '/HKI'; 
    osoite = asema + valittuSuunta + "?include_nonstopping=false&limit=50"

  } else if ($('#muualle').is(':checked')) {
    var suuntaInput = $('#muualle_input').val(); // haetaan input-kentän arvo
    var suuntaMuutos = suuntaInput.charAt(0).toUpperCase() + suuntaInput.slice(1).toLowerCase();
      if (asemat.hasOwnProperty(suuntaMuutos)) {
        valittuSuunta =  "/" + asemat[suuntaMuutos];
        osoite = asema + valittuSuunta + "?include_nonstopping=false&limit=50"
      } else {
        alert("Määränpääasemaa ei löydy");
      }

  } else {
    valittuSuunta = '';
    osoite = asema + "?departing_trains=150&include_nonstopping=false"
  }

    haeTiedot(osoite, asema);
});

//hover aikataulutablelle
$("input").focus(function(){
  $(this).css("background-color", "#f2f2f2"); 
});
$("input").blur(function(){
  $(this).css("background-color", "white");
});


});//DOCUMENT READY LOPPUU


$("#kirjoitaAsema").on("keyup", function() {  //jotta käyttäjän syöttämien kirjainten koolla ei ole merkitystä datalistille
  var value = $(this).val().toLowerCase();
  $("#asemalista option").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

