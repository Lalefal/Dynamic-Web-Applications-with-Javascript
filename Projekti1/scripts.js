
document.getElementById("lisaa").addEventListener("click", lisaaRivi);
document.getElementById("poista").addEventListener("click", poistaRivi);



function lisaaRivi() { //tsekataan, että sana on vähintään 2 merkkiä, lisätään se toDo-listalle ja tallennetaan LocalStorageen
    var tekstikentta = document.getElementById("tieto"); //inputfield + syöte
    if (tekstikentta.value.length < 2) {
        alert("Sanan on oltava vähintään kaksi merkkiä pitkä.");
        tekstikentta.style.background="orange"; 
    } else { 
     
        var lista = document.getElementById("lista");
    
        var rivit = lista.rows.length; 
        var rivi = lista.insertRow(rivit);
    
        rivi.insertCell(0).innerHTML= '<input type="checkbox" name="tehtava" onclick="if(this.checked){yliViiva(this)}">';
        rivi.insertCell(1).innerHTML= tekstikentta.value; //lisätään riville checkbox ja syötetty tieto

        // tietojen tallennus. Ystäväni ChatGPT auttoi tämän tekemisessä
        var tallenna = JSON.parse(localStorage.getItem('tallenna')) || {}; // haetaan tallennusobjekti local storagessa, tai luodaan uusi tyhjä objekti
        // var avain = Object.keys(tallenna).length + 1; // lasketaan objektin pituus ja lisätään yksi, jolloin saadaan uusi, uniikki arvo avaimelle
        //tallenna[avain] = tekstikentta.value; // lisätään uusi avain ja sen arvo objektiin
//tähän tarvitsisi lisätä tarkitus: montako numeroa on jo käytössä, siihen +1.
//nyt tallentaa aiempien tietojen päälle jos sivu ladataan uudelleen     
var avaimet = Object.keys(tallenna);
var uusiAvain = avaimet.length > 0 ? parseInt(avaimet[avaimet.length-1])+1 : 1; // lasketaan uusi avain
tallenna[uusiAvain] = tekstikentta.value; // lisätään uusi avain ja sen arvo objektiin
//tämä ratkaisi tallennusongelman, mutta rivien poisto ei toimi kunnolla
//rivit saa poistettua vain, jos poistamisen aloittaa listan viimeisestä rivistä
//jos poistaa alusta tai keskeltä, poistaminen ei enää toimi

        localStorage.setItem('tallenna', JSON.stringify(tallenna)); // tallennetaan objekti local storageen

        tekstikentta.style.background="white"; //inputfieldin palautus alkutilaan
        tekstikentta.value="";
        tekstikentta.placeholder="mitä muuta..";
} }
 
  
function poistaRivi() { //poistaa valitun / valitut rivit listalta ja LocalStoragesta
    //ei toimi kunnolla
     var lista = document.getElementById("lista");
     var rivi = lista.rows.length;
     var tallenna = JSON.parse(localStorage.getItem('tallenna'));

     for (var i = rivi-1; i > 0; i--) {
         var checkbox = lista.rows[i].cells[0].getElementsByTagName("input")[0];

         if (checkbox.checked == true) { 
             lista.deleteRow(i);
             var poistettavaTieto = tallenna[i]; 
             delete tallenna[i]; //koodi käyttää delete -operaattoria poistaakseen objektin avain-arvo parin tallenna -oliosta
             localStorage.setItem('tallenna', JSON.stringify(tallenna)); //ja tallentaa sen uudelleen LocalStorageen setItem() -metodilla.
             localStorage.removeItem(poistettavaTieto); //Tämän jälkeen se käyttää removeItem() -metodia poistaakseen kyseisen avain-arvo parin LocalStoragesta.
         }
     }
 }



function haeTiedot(){  // tietojen haku ja sijoitus listalle. Tätä jumppasimme pitkään ystäväni ChatGPT: kanssa
    var tallennetutTiedot = JSON.parse(localStorage.getItem('tallenna')) || {};
    var lista = document.getElementById("lista");
    
    for (var avain in tallennetutTiedot) {
        if (tallennetutTiedot.hasOwnProperty(avain)) {
            
            var arvo = tallennetutTiedot[avain];
    
            var rivit = lista.rows.length;
            var rivi = lista.insertRow(rivit);
    
            rivi.insertCell(0).innerHTML= '<input type="checkbox" name="tehtava" onclick="if(this.checked){yliViiva(this)}">';
            rivi.insertCell(1).innerHTML= arvo;   

//miten saada aiemmin valitut checkboxit aktiiviseksi?            
//if arvo also Local Storage Key and Local Storage Key Value == true
// rivi.insertCell(0).checked
// rivi.insertCell(1).style.textDecoration = "line-through"
      }
    }  
  }

  function yliViiva(x) { // Muuttaa valitun rivin tekstin yliviivatuksi (ja tallentaa localStorageen tiedon true)
    var viivaa = x.parentNode.parentNode;
    var tieto= viivaa.innerText;
    viivaa.style.textDecoration = "line-through";

    localStorage.setItem(tieto, x.checked);

}






 
