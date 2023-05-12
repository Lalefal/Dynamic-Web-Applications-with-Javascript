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
  fetch ("https://rata.digitraffic.fi/api/v1/live-trains/station/" + osoite)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      naytaTiedot(data, asema);
    });
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

        console.log("juna, junaNro ja päättäri: " + juna + " " + numero + " " + paattari);
        
        aika = new Date(aikatauluRivit.scheduledTime);

        if (aikatauluRivit.differenceInMinutes != null && aikatauluRivit.differenceInMinutes != 0){ //tsekataan, onko juna myöhässä
          aika2 = "+" + aikatauluRivit.differenceInMinutes + " min";
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
var table = $("<table>");
var headerRow = $("<tr>").appendTo(table);
  $("<th>").text("Juna").appendTo(headerRow);
  $("<th>").text("Raide").appendTo(headerRow);
  $("<th>").text("Aika").appendTo(headerRow);
  $("<th>").text("").appendTo(headerRow);
  $("<th>").text("Minne").appendTo(headerRow);


  $.each(lahtoajat, function(index, juna) {
    var row = $("<tr>").appendTo(table);
    $("<td>").text(juna.juna).appendTo(row);
    $("<td>").text(juna.raide).appendTo(row);
    $("<td>").text(juna.aika).appendTo(row);
    $("<td>").text(juna.aika2).appendTo(row).css('color', juna.aika2 === 'true' ? 'red' : 'inherit');
    $("<td>").text(juna.minne).appendTo(row);
    //$("<td>").text(juna.numero).appendTo(row);
  });

        
$("#info").append(table).slideDown("slow");  //näytetään aikatauluTable
      console.log("Valmis!"); 


      
$("tr").on("mouseenter", function() {
   $(this).css("background-color", "#cccccc");
  }).on("mouseleave", function() {
   $(this).css("background-color", "");
 });


var hakuSana = $("#kirjoitaAsema").val();
$("#kirjoitaAsema").val("").attr("placeholder", hakuSana);

var hakuSana2 = $("#muualle_input").val();
$("#muualle_input").val("").attr("placeholder", hakuSana2);

    }



//DOCUMENT READY ALKAA TÄSTÄ
$(document).ready(function() { 

  fetchAsemat();

$("#muualle").click(function(){ // inputboksi näkyviin
  $("#muualle_input").slideToggle("slow");

});

$("#hakuForm").submit(function(event) { //aloitetaan hakeminen
  event.preventDefault(); // estää lomakkeen lähettämisen
  $("#info").empty(); //tyhjennetään edellinen haku



  var asema = ""
  var ekaArvo = $("#kirjoitaAsema").val(); //käyttäjän kirjoittama asema
  var arvo = ekaArvo.charAt(0).toUpperCase() + ekaArvo.slice(1).toLowerCase(); //laitetaan oikeaan kirjoitusmuotoon
  if (asemat.hasOwnProperty(arvo)) { //haetaan aseman nimeä vastaava stationShortCode objektista 'asemat'
     asema = asemat[arvo];  
  } else {
    alert("Asemaa ei löydy");
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
        alert("Asemaa ei löydy");
      }
  } else {
    valittuSuunta = '';
    osoite = asema + "?departing_trains=150&include_nonstopping=false"
  }

    haeTiedot(osoite, asema);
});

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

