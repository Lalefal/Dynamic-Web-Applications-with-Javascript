var asemat = {};
//console.log(asemat);

function fetchAsemat() { //haetaan tiedot juna-asemien nimistä ja lyhenteistä
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

//haetaan halutun aseman aikataulut
function haeTiedot(osoite, asema) {
  $("#info").empty(); //tyhjennetään edellinen haku
  fetch ("https://rata.digitraffic.fi/api/v1/live-trains/station/" + osoite)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // tee jotain datan kanssa
      console.log(data);
      naytaTiedot(data, asema);
    });
}

//valitaan, mitä näytetään
function naytaTiedot(data, asema) {
  var lahtoajat = [];
  var nyt = new Date();
  
  $.each(data, function(i, paketti) {
    var juna = "";
    var raide = "";
    var aika = "";
    var minne = "";
    var numero = "";
    var aika2 = "";
    
    $.each(paketti.timeTableRows, function(j, aikatauluRivit) {
      if (aikatauluRivit.stationShortCode == asema && aikatauluRivit.type == "DEPARTURE" && paketti.trainCategory == "Commuter") {
        var viimeinenRivi = paketti.timeTableRows.length - 1;
        var viimeinenObjekti = paketti.timeTableRows[viimeinenRivi];
        var paattari1 = viimeinenObjekti.stationShortCode;
        var paattari = "";
        
        
          juna = paketti.commuterLineID; 

        $.each(asemat, function(key, value) {
          if (value === paattari1) {
            paattari = key;
            return false; // lopetetaan silmukka
          }
        });
        
        
        raide = aikatauluRivit.commercialTrack;
        minne = paattari;
        numero = aikatauluRivit.trainNumber;

        console.log("juna, junaNro ja päättäri: " + juna + " " + numero + " " + paattari);
        
        aika = new Date(aikatauluRivit.scheduledTime);

        if (aikatauluRivit.differenceInMinutes != null && aikatauluRivit.differenceInMinutes != 0){
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
    $("<td>").text(juna.aika2).appendTo(row);
    $("<td>").text(juna.minne).appendTo(row);
    //$("<td>").text(juna.numero).appendTo(row);
  });

        
$("#info").append(table).slideDown("slow");  
      console.log("Valmis!"); 

    }



//DOCUMENT READY ALKAA TÄSTÄ
$(document).ready(function() { //DOCUMENT READY ALKAA TÄSTÄ

  fetchAsemat();

$("#muualle").click(function(){
  $("#muualle_input").toggle();
});

$("#hakuForm").submit(function(event) {
  event.preventDefault(); // estää lomakkeen lähettämisen
  var asema = ""
  var ekaArvo = $("#kirjoitaAsema").val();
  var arvo = ekaArvo.charAt(0).toUpperCase() + ekaArvo.slice(1).toLowerCase();
  if (asemat.hasOwnProperty(arvo)) {
     asema = asemat[arvo];
    
  } else {
    alert("Asemaa ei löydy");
    }

  var osoite="";
  var valittuSuunta = '';
  if ($('#hki').is(':checked')) {
    valittuSuunta = '/HKI';
    osoite = asema + valittuSuunta + "?include_nonstopping=false&limit=75"

  } else if ($('#muualle').is(':checked')) {
    var suuntaInput = $('#muualle_input').val(); // haetaan input-kentän arvo
    var suuntaMuutos = suuntaInput.charAt(0).toUpperCase() + suuntaInput.slice(1).toLowerCase();
      if (asemat.hasOwnProperty(suuntaMuutos)) {
        valittuSuunta =  "/" + asemat[suuntaMuutos];
        osoite = asema + valittuSuunta + "?include_nonstopping=false&limit=75"
      } else {
        alert("Asemaa ei löydy");
      }
  } else {
    valittuSuunta = '';
    osoite = asema + "?departing_trains=50&include_nonstopping=false"
  }


    haeTiedot(osoite, asema);
});

});//DOCUMENT READY LOPPUU


$("#kirjoitaAsema").on("keyup", function() { 
  var value = $(this).val().toLowerCase();
  $("#asemalista option").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

