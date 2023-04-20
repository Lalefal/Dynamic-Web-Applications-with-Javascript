//aseman valinta asemalistasta
document.getElementById("asema").addEventListener("change", asemaValinta);
//aseman kirjoitus itse, haku alkaa painamalla "Hae"-buttonia
document.getElementById("haku").addEventListener("click", asemaHaku);
//aseman kirjoitus itse, haku alkaa painamalla enteriä
document.getElementById("asemaHaku").addEventListener("keydown", function(event) {
    let key = event.key;
    if (key == "Enter" || key == "Return"){ 
        asemaHaku();
    }
});


  

var jsonObj;

//aseman kirjoitus itse
function asemaHaku(){
    var selection = document.getElementById("asemaHaku");
    var asema = "";
    var mjono = selection.value.toLowerCase(); //toLowerCase, jotta syötteen kirjainkoolla ei ole merkitystä
    var mjono2 = selection.value; //laitetaan käyttäjän kirjoittama asema talteen
    switch(mjono) { //vaihdetaan kirjoitettu asema lyhenteeksi
        //Nämäkin varmaan saisi haettua jostain
        case "helsinki":
        case "keskusta":
        case "hesa":
            asema = "HKI"
            break;
        case "pasila":
            asema = "PSL"
            break;
        case "käpylä":
            asema = "KÄP"
            break;
        case "oulunkylä":
        case "ogeli":
            asema = "OLK"
            break;
        case "pukinmäki":
            asema = "PMK"
            break;
        case "puksu":
            asema = "PMK"
            break;
        case "malmi":
            asema = "ML"
            break;
        case "tapanila":
            asema = "TNA"
            break;
        case "puistola":
            asema = "PLA"
            break;
        case "tikkurila":
        case "tiksi":
            asema = "TKL"
            break;
        case "hiekkaharju":
            asema = "HKH"
            break;
        case "koivukylä":
        case "koivis":
            asema = "KVY"
            break;
        case "rekola":
            asema = "RKL"
            break;
        case "korso":
            asema = "KRO"
            break;
        case "savio":
            asema = "SAV"
            break;
        case "kerava":
            asema = "KE"
            break;
        default:
            alert("Hakemaasi asemaa ei löydy."); //jos käyttäjä kirjoittaa aseman, jota ei ole valikoimassa
            break;
    }
    //lisätään valittu asema urliin, //Liikennepaikan saapuvat ja lähtevät junat (lukumäärärajoitus departing_trains=100)
    var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/"+asema+"?departing_trains=100&include_nonstopping=false&train_categories=Commuter";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            jsonObj = JSON.parse(xmlhttp.responseText);
            console.log(jsonObj);

            naytaTiedot(jsonObj, asema); 
            }
        }
        
        document.getElementById("asemaHaku").value = ""; // tyhjentää input-kentän
        document.getElementById("asemaHaku").placeholder="Asema: " + mjono2; //jättää näkyviin edellisen haun
    }
//aseman valinta asemalistasta
function asemaValinta(){
    var selection = document.getElementById("asema");
    var asema = selection.options[selection.selectedIndex].value;
    var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/"+asema+"?departing_trains=100&include_nonstopping=false&train_categories=Commuter";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            jsonObj = JSON.parse(xmlhttp.responseText);
                console.log(jsonObj);

            naytaTiedot(jsonObj, asema);
        }
    }
    document.getElementById("asemaHaku").placeholder="Kirjoita aseman nimi";
}

//tämä valitsee ja näyttää halutun tiedon jsonObjektista, valitun aseman mukaisesti
function naytaTiedot(jsonObj, asema) {

    
    var lahtoajat = [];  //Objektin tiedot täytyy itse järjestää kellonajan mukaan, objektissa ne on junan numeron mukaisessa järjestyksessä
    var nyt = new Date(); // haetaan tämänhetkinen aika, jotta saadaan näytettyä vain tulevat junat

    for (var i = 0; i < jsonObj.length; i++) {  //käydään läpi kaikki arrayn sisällä olevat objektit
        
        var paketti = jsonObj[i]; 
        var juna = ""; //junan kirjain
        var raide = ""; //junan lähtöraide
        var aika = ""; //junan lähtöaika
        var minne = ""; //junan pääteasema
        var numero = ""; //junan numero bugien etsintää varten

        for (var j = 0; j < paketti.timeTableRows.length; j++) { 
            //käydään läpi objektin timeTableRows sisältä löytyvä array, jonka sisällä on objekteja (jokaisen junan pysähdyspaikat ja -ajat)
            
            var aikatauluRivit = paketti.timeTableRows[j]; 

            if (aikatauluRivit.stationShortCode == asema && aikatauluRivit.type == "DEPARTURE") { 
                //näytetään valitun aseman tiedot, "ARRIVAL"-aikoja ei tarvita     
                
                var viimeinenRivi = paketti.timeTableRows.length - 1; //etsitään arrayn viimeinen objekti, joka kertoo pääteaseman
                var viimeinenObjekti = paketti.timeTableRows[viimeinenRivi];
                var paattari = viimeinenObjekti.stationShortCode;

                juna = paketti.commuterLineID; //junan kirjain

                switch(paattari) { //vaihdetaan lyhenteen sanoiksi
                    case "HKI":
                        if (juna === "I") { 
                            paattari = "Lentoasema"; 
                        } else if ( asema === "HKI" && juna === "P") {
                            paattari = "Lentoasema"
                        } else {
                            paattari = "Helsinki";
                        }                    
                        break;
                    case "KE":
                        paattari = "Kerava"
                        break;
                    case "RI":
                        paattari = "Riihimäki"
                        break;
                    case "LH":
                        paattari = "Lahti"
                        break;
                    case "TPE":
                        paattari = "Tampere"
                        break;
                    case "KV":
                        paattari = "Kouvola"
                        break;
                    case "HL":
                        paattari = "Hämeenlinna"
                        break;
                    case "LPV":
                        paattari = "Leppävaara"
                        break;
                    case "KLH":
                        paattari = "Kauklahti"
                        break;
                    case "KKN":
                        paattari = "Kirkkonummi"
                        break;
                    case "STI":
                        paattari = "Siuntio"
                        break;
                    default:
                        paattari = "En tiedä";
                        break;
                } 

                juna = paketti.commuterLineID; //junan kirjain
                raide = aikatauluRivit.commercialTrack; //junan lähtöraide
                minne = paattari; //junan pääteasema
                numero = aikatauluRivit.trainNumber;  

                console.log("juna, junaNro ja päättäri: " + juna + " " + numero + " " + paattari);

                aika = new Date(aikatauluRivit.scheduledTime); //junan lähtöajat

                if (aika >= nyt) { //valitaan kaikista päivän junista näytettäväksi vain tulevat junat
                    
                    lahtoajat.push({
                        juna: juna,
                        raide: raide,
                        numero: numero,
                        minne: minne,
                        aika: aika.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), //objektissa on dateTime -> muutos pelkäksi kellonajaksi
                        aikaleima: aika                    
                    });
                }
            }         
        }
    }

    // lajitellaan lähtöajat aikaleimojen perusteella
    lahtoajat.sort(function(a, b) {
    return a.aikaleima - b.aikaleima;
    });
    var info = "<table> <tr> <th> Juna </th> <th> Raide </th> <th> Lähtöaika </th> <th> Määränpää </th></tr>" ;
    for (var k = 0; k < lahtoajat.length; k++) {
    //for (var k = 0; k < 10; k++) { //rajoitetaan näytettävien lähtöjen määrää kymmeneen
    var lahto = lahtoajat[k];
    
        info += '<tr>';
        info += '<td>' + lahto.juna + '</td>';
        info += '<td>' + lahto.raide + '</td>';
        info += '<td>' + lahto.aika+ '</td>';
        info += '<td>' + lahto.minne + '</td>';
        
        info += '</tr>';

}
    info +="</table>";
    
    document.getElementById("info").innerHTML = info;
    
        console.log("Valmis!"); 

}


  
