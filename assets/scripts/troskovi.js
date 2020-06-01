function changeForm(a) {
  var prva = document.getElementById("registracijaTroska");
  var druga = document.getElementById("sviTroskovi");
  var treca = document.getElementById("vrsteTroskova");


  var prviButton = document.getElementById("button1");
  var drugiButton = document.getElementById("button2");
  var treciButton = document.getElementById("button3");

  if (prva == null) prva = document.getElementById("haha");
  if (druga == null) druga = document.getElementById("haha");
  if (treca == null) treca = document.getElementById("haha");
  if (prviButton == null) prviButton = document.getElementById("haha");
  if (drugiButton == null) drugiButton = document.getElementById("haha");
  if (treciButton == null) treciButton = document.getElementById("haha");

  /*$('.btn').click(function(){
      $(this).toggleClass('active');
  });*/

  if (a == 1) {
    prviButton.classList.add("active");
    drugiButton.classList.remove("active");
    treciButton.classList.remove("active");


    prva.style.display = "block";
    druga.style.display = "none";
    treca.style.display = "none";


    window.location = '#registracijaTroska';
  }
  else if (a == 2) {
    prviButton.classList.remove("active");
    drugiButton.classList.add("active");
    treciButton.classList.remove("active");


    prva.style.display = "none";
    druga.style.display = "block";
    treca.style.display = "none";


    window.location = '#sviTroskovi';
  }
  else if (a == 3) {
    prviButton.classList.remove("active");
    drugiButton.classList.remove("active");
    treciButton.classList.add("active");


    prva.style.display = "none";
    druga.style.display = "none";
    treca.style.display = "block";


    window.location = '#vrsteTroskova';
    document.getElementById("novaVrstaTroska").focus();
  }
  else {
    prviButton.classList.add("active");
    drugiButton.classList.remove("active");
    treciButton.classList.remove("active");


    prva.style.display = "block";
    druga.style.display = "none";
    treca.style.display = "none";

  }
}

function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function kreirajElement(element, atributi) {

  let el = document.createElement(element);
  setAttributes(el, atributi);
  return el;
}


function filtriraj(inputId, ulId) {
  // console.log(inputId,ulId);
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById(inputId);
  filter = input.value.toUpperCase();
  ul = document.getElementById(ulId);
  li = ul.getElementsByTagName('li');
  ul.style.display = "block";
  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function LiClick(listItem) {
  var proba = listItem.textContent;
  var input = document.getElementById('Input1');
  var ul = document.getElementById('Depth1');
  input.value = proba;
  if (document.getElementById("Depth1") != null) {
    ul.style.display = "none";
  }
}

function showNotification(msg, boja) {
  var ikona;
  if (boja == 1 || boja == 2) {
    ikona = "tim-icons icon-check-2";
  }
  else {
    ikona = "tim-icons icon-alert-circle-exc";
  }

  $.notify({
    icon: ikona,
    message: msg

  }, {
    type: type[boja],
    timer: 1500,
    placement: {
      from: 'top',
      align: 'center'
    }
  });
}

function registrujTrosak() {

  var vrstaTroska = document.getElementById('Input1');
  var vrijednostTroska = document.getElementById('vrijednostTroska');
  var sviTroskovi = document.getElementById('Depth1');

  var jelPostojiUVrstama = false;


  var li = sviTroskovi.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue == vrstaTroska.value) jelPostojiUVrstama = true;
  }


  if (vrstaTroska.value == null || vrstaTroska.value == "") {
    showNotification("Niste odabrali vrstu <b>troška</b>!", 4);
    return;
  }
  else if (jelPostojiUVrstama == false) {
    showNotification("Vrsta troška koju ste unijeli <b>ne postoji</b>, molimo dodajte je prvo!", 4);
    return;
  }
  else;
  if (vrijednostTroska.value == null) {
    showNotification("Niste unijeli vrijednost troška!", 4);
    return;
  }
  if (vrijednostTroska.value == 0) {
    showNotification("0-KM zaista i ne predstavlja neki <b>trošak</b>", 4);
    return;
  }
  else {

    /*Registrovati trošak u bazu i prikazati poruku */
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    $.post('/dodajTrosak', { vrstaTroska: vrstaTroska.value, iznosTroska: vrijednostTroska.value, datumTroska: today }, function (returnedData) {

      if (returnedData.poruka == "Uspješno registrovan novi trošak!") {

        showNotification(returnedData.poruka, 2);
        /* dodavanje u tabelu ispod */
        var tabela = document.getElementById('tabelaTroskovi');
        var row = tabela.insertRow(1);

        var vrstaTroskaCell = row.insertCell(0);
        var datumTroskaCell = row.insertCell(1);
        var vrijednostTroskaCell = row.insertCell(2);

        vrijednostTroskaCell.classList.add("text-center");

        vrstaTroskaCell.innerText = vrstaTroska.value;
        vrijednostTroskaCell.innerText = vrijednostTroska.value + " KM";

        var datum = new Date();
        var dan = datum.getUTCDate();
        var mjesec = datum.getUTCMonth() + 1;
        var godina = datum.getUTCFullYear();
        var datumString = dan + "." + mjesec + "." + godina;
        datumTroskaCell.innerHTML = datumString;

        vrstaTroska.value = "";
        vrijednostTroska.value = "";
      }

      else {
        showNotification(returnedData.poruka, 4);
      }

    });
  }
}
function troskoviOnLoad1() {

  /*Ovdje povuci sve troskove iz baze i napuniti posljednjih 10 troskova*/
  /* HARDKODIRANO ISPOD */
  var tabela = document.getElementById('tabelaVrsteTroskova');
  console.log(tabela);

  if (tabela != null) {
    tabela = tabela.getElementsByTagName('tbody')[0];
    var UL = document.getElementById('Depth1');
    $.get('/dajSveVrsteTroskova', function (returnedData) {

      if (returnedData == null) return;

      let sveVrsteTroskova = Object.values(returnedData.rezultat);

      for (let i = 0; i < sveVrsteTroskova.length; i++) {

        let th1 = kreirajElement('td', {"style":"margin-left:0px;"});
        let input1 = kreirajElement('input', { "class": "form-control", "type": "text", "value": sveVrsteTroskova[i].vrstaTroska, "onfocus": "this.oldValue = this.value", "onchange": "spasiPromjenuVrsteTroska(this);this.oldValue = this.value;", "disabled": "true", "style": "margin-left:0px;color:white!important;" });
        //let th2 = kreirajElement('td', {});
        //let input2 = kreirajElement('input', { "class": "form-control", "type": "text", "value": "10", "style": "margin-left:0px;", "disabled": "" ,"style":"color:white!important;"});
        let th3 = kreirajElement('td', { "class": "text-center" });
        let a = kreirajElement('a', { "class": "deleteTrosak", "href": "#" });
        a.onclick = function () { deleteVrstaTroska(this, sveVrsteTroskova[i].vrstaTroska); };
        a.innerHTML = "Obrisi";
        let tr = kreirajElement('tr', {});

        th1.appendChild(input1);
        //th2.appendChild(input2);
        th3.appendChild(a);
        tr.appendChild(th1);
        //tr.appendChild(th2);
        tr.appendChild(th3);
        tabela.appendChild(tr);

        //Ucitavamo i sve vrste troskova u UL
        let li = kreirajElement('li', { "onclick": "LiClick(this)" });
        let a2 = kreirajElement('a', { "href": "#" });
        a2.innerHTML = sveVrsteTroskova[i].vrstaTroska;
        li.appendChild(a2);
      }
    });
  }


  //Ucitavamo tabelu svih troskova ogranicenu na 40 itema
  var tabela2 = document.getElementById('tabelaSviTroskovi');
  if (tabela2 != null) {
    tabela2 = tabela2.getElementsByTagName('tbody')[0];
    $.get('/dajSveTroskove', function (returnedData) {

      if (returnedData == null) return;

      let sviTroskovi = Object.values(returnedData.rezultat);

      for (let i = 0; i < sviTroskovi.length; i++) {

        let tr = kreirajElement('tr', {});
        let th1 = kreirajElement('td', {});
        th1.innerHTML = sviTroskovi[i].vrstaTroska;
        let th2 = kreirajElement('td', {});
        th2.innerHTML = sviTroskovi[i].datumTroska;
        let th3 = kreirajElement('td', {});
        th3.innerHTML = sviTroskovi[i].iznosTroska + ' KM';
        let th4 = kreirajElement('td', { "class": "text-center" });
        let a3 = kreirajElement('a', { "class": "deleteTrosak", "href": "#" });
        let trosak = { vrstaTroska: sviTroskovi[i].vrstaTroska, iznosTroska: sviTroskovi[i].iznosTroska, datumTrosa: sviTroskovi[i].datumTroska };
        a3.onclick = function () { deleteTrosak(this, trosak); };
        a3.innerHTML = 'Obrisi';

        th4.appendChild(a3);
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        tabela2.appendChild(tr);
      }

    });
  }
}

function deleteTrosak(element, trosak) {

  $.post('/obrisiTrosak', { vrstaTroska: trosak.vrstaTroska, iznosTroska: trosak.iznosTroska, datumTroska: trosak.datumTroska }, function (returnedData) {

    if (returnedData.poruka == "Uspješno obrisan trošak!") {
      showNotification(returnedData.poruka, 2);
      document.getElementById("tabelaSviTroskovi").deleteRow(element.parentNode.parentNode.rowIndex);
    }
    else {
      showNotification(returnedData.poruka, 4);
    }

  });
}

function deleteVrstaTroska(element, nazivVrsteTroska) {

  // showNotification("Uspješno obrisana vrsta troška pod <b>indeksom</b> " + element.parentNode.parentNode.rowIndex,1);
  document.getElementById("tabelaVrsteTroskova").deleteRow(element.parentNode.parentNode.rowIndex);

  $.post('/obrisiVrstuTroska', { vrstaTroska: nazivVrsteTroska }, function (returnedData) {

    if (returnedData.poruka == "Uspješno obrisana vrsta troška!") {
      showNotification(returnedData.poruka, 2);
    }
    else {
      showNotification(returnedData.poruka, 4);
    }
  });
}

function jelPostojiElementUTabeli(tabela, inputElement) {
  var l = tabela.rows.length;

  var s = '';
  for (var i = 0; i < l; i++) {
    var tr = tabela.rows[i];

    var cll = tr.cells[0];

    if (cll.innerText.toUpperCase() == inputElement.value.toUpperCase()) return false;
  }
}

function dodajVrstuTroska() {

  var novaVrstaTroska = document.getElementById("novaVrstaTroska");
  var tabela = document.getElementById("tabelaVrsteTroskova");

  if (novaVrstaTroska.value == null || novaVrstaTroska.value == "") {
    showNotification("Morate unijeti naziv <b>vrste troška</b>!", 4);
    return;
  }

  /********************************************* */

  $.post('/dodajNovuVrstuTroska', { vrstaTroska: novaVrstaTroska.value }, function (returnedData) {

    if (returnedData.poruka == "Uspješno dodana nova vrsta troška!") {

      var row = tabela.insertRow(2);/* ovdje se dodaje na drugi index jer je 0-header 1-ova zajebancija za dodavanje*/

      var vrstaTroskaCell = row.insertCell(0);
      var obrisiOpcija = row.insertCell(1);

      obrisiOpcija.innerHTML = "<a class='deleteTrosak' href='#' onclick='deleteVrstaTroska(this)'>Obrisi</a>"
      obrisiOpcija.classList.add("text-center");

      vrstaTroskaCell.innerHTML = "<input disabled='true' class='form-control' type='text' value='" + novaVrstaTroska.value + "' style='margin-left:0px;color:white!important;' onfocus='this.oldValue = this.value' onchange='spasiPromjenuVrsteTroska(this);this.oldValue = this.value;'>";
      //brojTroskovaUVrsti.innerHTML = "<input class='form-control' type='text' value='0' style='margin-left:0px;' disabled=''></input>";
      ucitajVrstuTroskaUDropdown(novaVrstaTroska.value);
      showNotification(returnedData.poruka, 2);
    }

    else {
      showNotification(returnedData.poruka, 4);
    }

    novaVrstaTroska.value = "";
  });
}


function dajProsluVrijednost(element) {
  return element.value;
}

function spasiPromjenuVrsteTroska(vrstaTroska) {
  var proslaVrijednost = vrstaTroska.oldValue;
  document.getElementById("novaVrstaTroska");
  novaVrstaTroska.value = vrstaTroska.value;
  showNotification("Vrsta troška <b>" + vrstaTroska.oldValue + "</b> u redu tabele <b>" + vrstaTroska.parentNode.parentNode.rowIndex + "</b>" + " je poprimila novu vrijednost <b>" + vrstaTroska.value + "</b>", 2);

}

function ucitajSveTroskove() {

  //Ucitavamo tabelu svih troskova ogranicenu na 40 itema
  var tabela2 = document.getElementById('tabelaSviTroskovi').getElementsByTagName('tbody')[0];
  tabela2.innerHTML = "";

  $.get('/dajSveTroskove', function (returnedData) {

    if (returnedData == null) return;

    let sviTroskovi = Object.values(returnedData.rezultat);

    for (let i = 0; i < sviTroskovi.length; i++) {

      let tr = kreirajElement('tr', {});
      let th1 = kreirajElement('td', {});
      th1.innerHTML = sviTroskovi[i].vrstaTroska;
      let th2 = kreirajElement('td', {});
      th2.innerHTML = sviTroskovi[i].datumTroska;
      let th3 = kreirajElement('td', {});
      th3.innerHTML = sviTroskovi[i].iznosTroska + ' KM';
      let th4 = kreirajElement('td', { "class": "text-center" });
      let a3 = kreirajElement('a', { "class": "deleteTrosak", "href": "#" });
      let trosak = { vrstaTroska: sviTroskovi[i].vrstaTroska, iznosTroska: sviTroskovi[i].iznosTroska, datumTroska: sviTroskovi[i].datumTroska };
      a3.onclick = function () { deleteTrosak(this, trosak); };
      a3.innerHTML = 'Obrisi';

      th4.appendChild(a3);
      tr.appendChild(th1);
      tr.appendChild(th2);
      tr.appendChild(th3);
      tr.appendChild(th4);
      tabela2.appendChild(tr);
    }

  });
}
$("#Input1").click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  if (document.getElementById("Depth1") != null) {
    document.getElementById("Depth1").style.display = "block";
    $('#Depth1').show();
  }

});
$(document).click(function (e) {
  if (e.target.id == "Depth1" || e.target.id == "Input1" || e.target.classList[0] == "li") {
    //alert("do't hide");  
  } else {
    if (document.getElementById("Depth1") != null) {
      document.getElementById("Depth1").style.display = "none";
    }
    //$(".login-panel").hide();

  }
});

function filterTroskova(inputID, ulID) {
  filtriraj(inputID, ulID);
  idHighlightTroska = -1;
}

function oznaci(ch) {
  focusedInput = ch.id;
  focusedUL = "Depth1";
  document.getElementById("Depth1").style.display = "block";
  console.log(focusedInput + " " + focusedUL);
  idHighlightTroska = -1;
}

function dajVidljiveTroskove() {
  let troskovi = document.getElementById(focusedUL).getElementsByTagName('li');
  let noviTroskovi = [];
  for (let i = 0; i < troskovi.length; i++) {
    if (troskovi[i].style.display != "none") noviTroskovi.push(troskovi[i]);
  }
  return noviTroskovi;
}

var focusedInput = "Input1";
var focusedUL = "Depth1";
var idHighlightTroska = -1;

function clickNaLiItem(li) {
  document.getElementById("Input1").value = li.childNodes[0].innerText;
}
$(document).keyup(function (e) {
  if (e.key === "Enter") {
    let troskovi = dajVidljiveTroskove();
    for (var i = 0; i < troskovi.length; i++) {
      if (troskovi[i] === document.activeElement) {
        document.getElementById(focusedInput).value = troskovi[i].childNodes[0].innerText;
        document.getElementById(focusedUL).style.display = "none";
      }
    }
  }

});

document.onkeydown = function (event) {

  if (document.getElementById(focusedUL) != null) {
    if (document.getElementById(focusedUL).style.display == "block") {

      let troskovi = dajVidljiveTroskove();
      if (event.keyCode == 38) {
        event.preventDefault();
        // GORE
        idHighlightTroska--;
        if (idHighlightTroska < -1) {
          idHighlightTroska = troskovi.length - 1;
          troskovi[idHighlightTroska].focus();

        }
        else if (idHighlightTroska == -1) {
          document.getElementById(focusedInput).focus();

        }
        else troskovi[idHighlightTroska].focus();

      }
      else if (event.keyCode == 40) {

        event.preventDefault();
        // DOLJE
        idHighlightTroska++;

        if (idHighlightTroska == troskovi.length) {
          idHighlightTroska = -1;
          document.getElementById(focusedInput).focus();
        }
        else troskovi[idHighlightTroska].focus();
      }
      else;
    }
  }
};

function ucitajSveVrsteTroskova() {
  if (document.getElementById("Depth1") != null) {
    let UL = document.getElementById('Depth1');
    UL.innerHTML = "";

    $.get('/dajSveVrsteTroskova', function (returnedData) {

      console.log(returnedData);

      if (returnedData == null) return;

      

      let sveVrsteTroskova = Object.values(returnedData.rezultat);

      for (let i = 0; i < sveVrsteTroskova.length; i++) {
        console.log('Kitica');
        //Ucitavamo i sve vrste troskova u UL
        let li = kreirajElement('li', { "tabindex": "-1", "onclick": "clickNaLiItem(this)" });
        let a2 = kreirajElement('a', { "href": "#" });
        a2.innerText = sveVrsteTroskova[i].vrstaTroska;
        li.appendChild(a2);
        UL.appendChild(li);
      }
    });
  }
}

function ucitajVrstuTroskaUDropdown(vrstaTroska) {
  if (document.getElementById("Depth1") != null) {
    let UL = document.getElementById('Depth1');

    let li = kreirajElement('li', { "tabindex": "-1", "onclick": "clickNaLiItem(this)" });
    let a2 = kreirajElement('a', { "href": "#" });
    a2.innerText = vrstaTroska;
    li.appendChild(a2);
    UL.appendChild(li);
  }
}

function logOut() {

  $.get('/logout', function (returnedData) {
    window.location.replace('/login.html');
  });
}