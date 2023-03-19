document.getElementById("aloita").addEventListener("click", uusiLista);
document.getElementById("lisaa").addEventListener("click", uusiRivi);

function uusiLista(){
    
    let ul=document.createElement("ul"); //uusi lista
    let li=document.createElement("li"); //listalle otsikkorivi
   // let li2=document.createElement("li"); //listalle eka tieto-rivi
    let li3=document.createElement("li"); //listalle uusi tekstinsyöttörivi 
    let li4=document.createElement("li"); //listalle uusi nappularivi
    //let pallo=document.createElement("input"); //radiopallo
    let rivi=document.createElement("input"); //tekstin syöttö
    let nappi=document.createElement("button"); //lisää uusi rivi-button
    let nappi2=document.createElement("button"); //poista valitut-button
    let nappi3=document.createElement("button"); //tallenna-button

    let otsikko=document.getElementById("otsikko").value;
    //let ekaRivi=document.getElementById("ekarivi").value;
    

    ul.setAttribute("id", "eka");
    li.setAttribute("class", "ots");
    li3.setAttribute("class", "lisays");
    rivi.setAttribute("type", "text");
    rivi.setAttribute("id", "toimisko");
 //   pallo.setAttribute("type", "radio");
    nappi2.setAttribute("id", "lisaa");
    nappi2.setAttribute("class", "nappi3");
    nappi.innerText="Lisää";
    nappi2.innerText="Poista tehdyt";
    nappi3.innerText="Tallenna";
    
    ul.appendChild(li);
//    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);

    li.innerHTML=otsikko;
    
  //  li2.innerText=ekaRivi;
 //   li2.appendChild(pallo);
    li3.appendChild(rivi);
    li4.appendChild(nappi);
    li4.appendChild(nappi2);
    li4.appendChild(nappi3);


    document.getElementById("tanne").appendChild(ul);
}



function uusiRivi(){
    'use strict';
    let rivi1=document.createElement("li");
   // let rivi2=document.createElement("li");
    let pallo=document.createElement("input"); //radiopallo
   // let tieto=document.getElementById("toimisko").value;

 //   rivi1.innerHTML=tieto;
    
    pallo.setAttribute("type", "radio");
    rivi1.appendChild(pallo);
    document.getElementById("eka").appendChild(rivi1);
}






document.getElementById("poista").addEventListener("click", poistaRivi);

function poistaRivi() {
    let lista=document.getElementById("row");
    let valittu = document.getElementById("valinta");
    let valittu2 = document.getElementById("valinta")
    let testi=document.getElementById("rivi");
if (valittu = true) {  
    lista.removeChild(testi);
    lista.removeChild(valittu2);
    

}
}

// function init() {
//     'use strict';
//     //console.log("Ikkunan alustus");

//     // Add an event listener to the form:
//     var theForm = document.getElementById('tanne');
//    // theForm.onsubmit = calculate;

// } // End of init() function.

// // Assign an event listener to the window's load event:
// window.onload = init();