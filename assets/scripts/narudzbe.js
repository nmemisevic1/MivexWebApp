var imeKliknutogProizvoda = "";
var ebayPretragaKliknutogProizvoda = "";

var narudzbeKojeSeCekaju = [];
var narudzbeKojeKasne = [];
var onoStoJePotrebnoNaruciti = [];

function copyToClipboard(barkod) {

  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = barkod;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
}

function changeForm(a) {

  var prva = document.getElementById("sveNarudzbe");
  var druga = document.getElementById("zakasnjeleNarudzbe");
  var treca = document.getElementById("potrebneNarudzbe");

  var prviButton = document.getElementById("button1");
  var drugiButton = document.getElementById("button2");
  var treciButton = document.getElementById("button3");

  if (prva == null) prva = document.getElementById("haha");
  if (druga == null) druga = document.getElementById("haha");
  if (treca == null) treca = document.getElementById("haha");
  if (prviButton == null) prviButton = document.getElementById("haha");
  if (drugiButton == null) drugiButton = document.getElementById("haha");
  if (treciButton == null) treciButton = document.getElementById("haha");

  if (a == 1) {

    prva.innerHTML = "";

    prviButton.classList.add("active");
    drugiButton.classList.remove("active");
    treciButton.classList.remove("active");

    prva.style.display = "block";
    druga.style.display = "none";
    treca.style.display = "none";
    document.getElementById('opisForme').innerText = "Lista svih narudžbi za koje se čeka dostava";

    /*$.get('/dajSveNarudzbe', function (returnedData) {

      let listaSvihNarudzbi = Object.values(returnedData.rezultat);
      ucitajSveNarudzbe(listaSvihNarudzbi);
      ucitajNarudzbeUDropdown("kojeSeCekaju");

      prviButton.classList.add("active");
      drugiButton.classList.remove("active");
      treciButton.classList.remove("active");

      prva.style.display = "block";
      druga.style.display = "none";
      treca.style.display = "none";
      document.getElementById('opisForme').innerText = "Lista svih narudžbi za koje se čeka dostava";
    });*/

    //window.location='#sveNarudzbe';
  }
  else if (a == 2) {

    druga.innerHTML = "";

    $.get('/narudzbe/kasnjenje', function (returnedData) {

      if(returnedData == null) return;

      let listaSvihNarudzbi = Object.values(returnedData.rezultat);
      ucitajNarudzbeKojeKasne(listaSvihNarudzbi);
      ucitajNarudzbeUDropdown("kojeKasne");
      prviButton.classList.remove("active");
      drugiButton.classList.add("active");
      treciButton.classList.remove("active");
      document.getElementById('opisForme').innerText = "Lista svih narudžbi koje kasne sa dostavom";

      prva.style.display = "none";
      druga.style.display = "block";
      treca.style.display = "none";
      //window.location='#zakasnjeleNarudzbe';
    });

  }
  else if (a == 3) {
    treca.innerHTML = "";
    $.get('/proizvod/potrebnoNaruciti', function (returnedData) {

      if(returnedData == null) return;

      let listaSvihNarudzbi = Object.values(returnedData.rezultat);
      let potrebnoNaruciti = Object.values(returnedData.potrebnoNaruciti);
      ucitajProizvodeKojeJePotrebnoNaruciti(listaSvihNarudzbi, potrebnoNaruciti);
      ucitajNarudzbeUDropdown("potrebneNaruciti");

      prviButton.classList.remove("active");
      drugiButton.classList.remove("active");
      treciButton.classList.add("active");

      prva.style.display = "none";
      druga.style.display = "none";
      treca.style.display = "block";

      document.getElementById('opisForme').innerText = "Lista svih proizvoda koje je potrebno naručiti";
    });
  }
  else {
    prviButton.classList.add("active");
    drugiButton.classList.remove("active");

    prva.style.display = "block";
    druga.style.display = "none";
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
    },
    z_index: 2000,
  });
}


function ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu) {
  //document.getElementById('spasiNarudzbuButton').style.visibility = "visible";
  btnSpasiNarudzbu.style.visibility = "visible";
}

function spasiNarudzbu(narudzba) {

  document.getElementById('spasiNarudzbuButton').style.visibility = "hidden";
  showNotification("Narudzba uspješno izmijenjena", 2);
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

function narudzbeOnLoad() {
  /* UCITAVANE NARUDZBI U DROPDOWN */
  var kojeSeCekaju = true;
  var kojeKasne = true;
  var potrebneNaruciti = true;
  
  if (document.getElementById("button1") != null) {
    if (document.getElementById("button1").classList.contains("active")) {
      kojeSeCekaju = true;
    }
    else kojeSeCekaju = false;
  } else {
    kojeSeCekaju = false;
  }
  if (document.getElementById("button2") != null) {
    if (document.getElementById("button2").classList.contains("active")) {
      kojeKasne = true;
    }
    else kojeKasne = false;
  } else {
    kojeKasne = false;
  }
  if (document.getElementById("button3") != null) {
    if (document.getElementById("button3").classList.contains("active")) {
      potrebneNaruciti = true;
    }
    else potrebneNaruciti = false;
  } else {
    potrebneNaruciti = false;
  }
  
  if (kojeSeCekaju) ucitajNarudzbeUDropdown("kojeSeCekaju");
  else if (kojeKasne) ucitajNarudzbeUDropdown("kojeKasne");
  else if (potrebneNaruciti) ucitajNarudzbeUDropdown("potrebneNaruciti");
  else;
  document.getElementById("pretragaFilter").focus();
  /**********                      */
  document.getElementById('opisForme').innerText = "Lista svih narudžbi za koje se čeka dostava";

  /*$.get('/dajSveNarudzbe', function (returnedData) {

    let listaSvihNarudzbi = Object.values(returnedData.rezultat);

    ucitajSveNarudzbe(listaSvihNarudzbi);
    // ucitajNarudzbeKojeKasne(listaSvihNarudzbi);

  });*/

}


function ucitajSveNarudzbe(listaSvihNarudzbi) {

  for (let i = 0; i < listaSvihNarudzbi.length; i++) {

    var sveNarudzbe = document.getElementById('sveNarudzbe');
    let narudzba = kreirajElement('div', { "class": "row", "style": "margin-left:0px;border:1px solid white;border-radius: 0.5; margin-top:10px;", "id": "idnarudzbe" })/*IDNARUDZBE KAKO CES TI TO NEYY*/

    let btnSpasiNarudzbu = kreirajElement('input', {
      "type": "button", "class": "btn btn-primary spasiNarudzbu", "id": "spasiNarudzbuButton",
      "value": "Spasi narudžbu", "style": "vertical-align:middle; width:250px;visibility: hidden;", "onclick": "spasiNarudzbu()"
    });

    btnSpasiNarudzbu.onclick = function () {

      $.post('/narudzba/edit', {
        stariNazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda, stariBrojKomada: listaSvihNarudzbi[i].brojKomada,
        stariDatumNarudzbe: listaSvihNarudzbi[i].datumNarudzbe, stariDatumIsporuke: listaSvihNarudzbi[i].datumIsporuke, stariRacun: listaSvihNarudzbi[i].racun,
        staraNabavnaCijena: listaSvihNarudzbi[i].nabavnaCijena, stariTrackingNumber: listaSvihNarudzbi[i].trackingNumber , brojKomada: komadiInput.value,
        datumNarudzbe: datumNarudzbeInput.value, datumIsporuke: datumIsporukeInput.value, racun: profil.value, nabavnaCijena: nabavnaCijenaInput.value, 
        nazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda, trackingNumber: trackingNumber.value
      }, function (returnedData) {

        if (returnedData.ispravan == "NE") {
          showNotification(returnedData.poruka, 4);
        }
        else {
          showNotification(returnedData.poruka, 2);
        }
      });
    }

    let nazivProizvodaLabel = kreirajElement('label', {});
    nazivProizvodaLabel.innerText = "Naziv proizvoda: ";

    let nazivProizvoda = kreirajElement('label', { "style": "margin-left:10px" });
    nazivProizvoda.innerText = listaSvihNarudzbi[i].nazivProizvoda;

    let poljaNarudzbe = kreirajElement('div', { "class": "col-sm-4 col-lg-6 col-md-3 col-xs-12", "style": "margin-top:5px;" })
    let formPoljaNarudzbe = kreirajElement('form', { "class": "form-group" });

    let trackingNumberLabel = kreirajElement('label', {});
    trackingNumberLabel.innerText = "Tracking number / ID";
    let trackingNumber = kreirajElement('input', { "class": "form-control", "style": "margin-left:0px;", "type": "text", "value": listaSvihNarudzbi[i].trackingNumber });
    trackingNumber.onchange = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }
    trackingNumber.onkeydown = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }

    let komadiLabel = kreirajElement('label', {}); komadiLabel.innerText = "Broj komada";
    let komadiInput = kreirajElement('input', { "class": "form-control", "style": "margin-left:0px;", "type": "number", "value": listaSvihNarudzbi[i].brojKomada });
    komadiInput.onchange = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }
    komadiInput.onkeydown = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }

    let profilLabel = kreirajElement('label', {}); profilLabel.innerText = "Račun";
    let profil = kreirajElement('input', { "class": "form-control", "style": "margin-left:0px;", "type": "text", "value": listaSvihNarudzbi[i].racun });
    profil.onchange = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }
    profil.onkeydown = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }

    let datumNarudzbeLabel = kreirajElement('label', {}); datumNarudzbeLabel.innerText = "Datum narudzbe";
    let datumNarudzbeInput = kreirajElement('input', { "class": "form-control", "style": "margin-left:0px;", "type": "date", "value": listaSvihNarudzbi[i].datumNarudzbe });
    datumNarudzbeInput.onchange = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }
    datumNarudzbeInput.onkeydown = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }

    let datumIsporukeLabel = kreirajElement('label', {}); datumIsporukeLabel.innerText = "Datum isporuke";
    let datumIsporukeInput = kreirajElement('input', { "class": "form-control", "style": "margin-left:0px;", "type": "date", "value": listaSvihNarudzbi[i].datumIsporuke });
    datumIsporukeInput.onchange = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }
    datumIsporukeInput.onkeydown = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }

    let nabavnaCijenaLabel = kreirajElement('label', {}); nabavnaCijenaLabel.innerText = "Nabavna cijena";
    let nabavnaCijenaInput = kreirajElement('input', { "class": "form-control", "style": "margin-left:0px;", "type": "text", "value": listaSvihNarudzbi[i].nabavnaCijena });
    nabavnaCijenaInput.onchange = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }
    nabavnaCijenaInput.onkeydown = function () { ponudiSpasavanjeNarudzbe(btnSpasiNarudzbu); }

    let br = kreirajElement('br', {});
    let br3 = kreirajElement('br', {});
    formPoljaNarudzbe.appendChild(nazivProizvodaLabel);
    formPoljaNarudzbe.appendChild(nazivProizvoda);
    formPoljaNarudzbe.appendChild(br);
    formPoljaNarudzbe.appendChild(br3);
    formPoljaNarudzbe.appendChild(trackingNumberLabel);
    formPoljaNarudzbe.appendChild(trackingNumber);
    formPoljaNarudzbe.appendChild(komadiLabel);
    formPoljaNarudzbe.appendChild(komadiInput);
    formPoljaNarudzbe.appendChild(profilLabel);
    formPoljaNarudzbe.appendChild(profil);
    formPoljaNarudzbe.appendChild(datumNarudzbeLabel);
    formPoljaNarudzbe.appendChild(datumNarudzbeInput);
    formPoljaNarudzbe.appendChild(datumIsporukeLabel);
    formPoljaNarudzbe.appendChild(datumIsporukeInput);
    formPoljaNarudzbe.appendChild(nabavnaCijenaLabel);
    formPoljaNarudzbe.appendChild(nabavnaCijenaInput);
    poljaNarudzbe.appendChild(formPoljaNarudzbe);


    let poljaOpcija = kreirajElement('div', { "class": "col-sm-4 col-md-3 col-lg-6 col-xs-12 text-center", "style": "margin-top:5px;" });
    let btnIsporuceno = kreirajElement('input', { "type": "button", "class": "btn btn-primary", "value": "Isporučena", "style": "vertical-align:middle; width:250px;" });
    let btnObrisiNarudzbu = kreirajElement('input', { "type": "button", "class": "btn btn-danger", "value": "Obriši narudžbu", "style": "vertical-align:middle; width:250px;" });


    btnObrisiNarudzbu.onclick = function () {

      let objekatZaBrisanje = {
        nazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda, brojKomada: listaSvihNarudzbi[i].brojKomada,
        datumNarudzbe: listaSvihNarudzbi[i].datumNarudzbe, datumIsporuke: listaSvihNarudzbi[i].datumIsporuke, racun: listaSvihNarudzbi[i].racun,
        nabavnaCijena: listaSvihNarudzbi[i].nabavnaCijena, trackingNumber: listaSvihNarudzbi[i].trackingNumber
      };

      $.post('/obrisiNarudzbu', objekatZaBrisanje, function (returnedData) {

        if (returnedData.ispravan == "NE") {
          showNotification(returnedData.poruka, 4);
        }
        else {
          showNotification(returnedData.poruka, 2);
          sveNarudzbe.removeChild(narudzba);
        }
      });
    };


    btnIsporuceno.onclick = function () {

      $.post('/narudzba/delivered', {
        nazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda, brojKomada: listaSvihNarudzbi[i].brojKomada,
        datumNarudzbe: listaSvihNarudzbi[i].datumNarudzbe, datumIsporuke: listaSvihNarudzbi[i].datumIsporuke, racun: listaSvihNarudzbi[i].racun,
        nabavnaCijena: listaSvihNarudzbi[i].nabavnaCijena, trackingNumber: listaSvihNarudzbi[i].trackingNumber
      }, function (returnedData) {

        if (returnedData.ispravan == "NE") {
          showNotification(returnedData.poruka, 4);
        }
        else {
          showNotification(returnedData.poruka, 2);
          sveNarudzbe.removeChild(narudzba);
        }
      });
    };

    var br1 = document.createElement("br");
    var br2 = document.createElement("br");

    poljaOpcija.appendChild(btnIsporuceno);
    poljaOpcija.appendChild(br1);
    poljaOpcija.appendChild(btnObrisiNarudzbu);
    poljaOpcija.appendChild(br2);
    poljaOpcija.appendChild(btnSpasiNarudzbu);

    // narudzba.appendChild(imageBox);
    narudzba.appendChild(poljaNarudzbe);
    narudzba.appendChild(poljaOpcija);
    sveNarudzbe.appendChild(narudzba);
  }
}

function ucitajNarudzbeKojeKasne(listaSvihNarudzbi) {

  var zakasnjeleNarudzbe = document.getElementById('zakasnjeleNarudzbe');
  zakasnjeleNarudzbe.innerHTML = "";
  let narudzbeKojeKasneObjekti = [];


  for (let i = 0; i < listaSvihNarudzbi.length; i++) {

    if (new Date(listaSvihNarudzbi[i].datumIsporuke) < new Date()) {

      let narudzba = kreirajElement('div', { "class": "row", "style": "margin-left:0px;border:1px solid white;border-radius: 0.5; margin-top:10px;", "id": "idnarudzbe" });

      let nazivProizvodaLabel = kreirajElement('label', {});
      nazivProizvodaLabel.innerText = "Naziv proizvoda: ";

      let nazivProizvoda = kreirajElement('label', { "style": "margin-left:10px" });
      nazivProizvoda.innerText = listaSvihNarudzbi[i].nazivProizvoda;

      let poljaNarudzbe = kreirajElement('div', { "class": "col-sm-4 col-lg-6 col-md-3 col-xs-12", "style": "margin-top:5px;" })
      let formPoljaNarudzbe = kreirajElement('form', { "class": "form-group" });

      let komadiLabel = kreirajElement('label', {});
      komadiLabel.innerText = "Broj komada: ";
      let komadiInput = kreirajElement('label', { "style": "margin-left:10px;", "value": listaSvihNarudzbi[i].brojKomada });
      komadiInput.innerText = listaSvihNarudzbi[i].brojKomada;

      let profilLabel = kreirajElement('label', {});
      profilLabel.innerText = "Račun: ";
      let profil = kreirajElement('label', { "style": "margin-left:10px;", "value": listaSvihNarudzbi[i].racun });
      profil.innerText = listaSvihNarudzbi[i].racun;

      let datumNarudzbeLabel = kreirajElement('label', {});
      datumNarudzbeLabel.innerText = "Datum narudžbe: ";
      let datumNarudzbeInput = kreirajElement('label', { "style": "margin-left:10px;", "value": listaSvihNarudzbi[i].datumNarudzbe });
      datumNarudzbeInput.innerText = listaSvihNarudzbi[i].datumNarudzbe;

      let datumIsporukeLabel = kreirajElement('label', {});
      datumIsporukeLabel.innerText = "Datum isporuke: ";
      let datumIsporukeInput = kreirajElement('label', { "style": "margin-left:10px;", "value": listaSvihNarudzbi[i].datumIsporuke });
      datumIsporukeInput.innerText = listaSvihNarudzbi[i].datumIsporuke;

      let nabavnaCijenaLabel = kreirajElement('label', {});
      nabavnaCijenaLabel.innerText = "Nabavna cijena: ";
      let nabavnaCijenaInput = kreirajElement('label', { "style": "margin-left:10px;", "value": listaSvihNarudzbi[i].nabavnaCijena });
      nabavnaCijenaInput.innerText = listaSvihNarudzbi[i].nabavnaCijena + " $";

      let br = kreirajElement('br', {});
      let br3 = kreirajElement('br', {});
      let br4 = kreirajElement('br', {});
      let br5 = kreirajElement('br', {});
      let br6 = kreirajElement('br', {});

      formPoljaNarudzbe.appendChild(nazivProizvodaLabel);
      formPoljaNarudzbe.appendChild(nazivProizvoda);
      formPoljaNarudzbe.appendChild(br);
      formPoljaNarudzbe.appendChild(komadiLabel);
      formPoljaNarudzbe.appendChild(komadiInput);
      formPoljaNarudzbe.appendChild(br3);
      formPoljaNarudzbe.appendChild(profilLabel);
      formPoljaNarudzbe.appendChild(profil);
      formPoljaNarudzbe.appendChild(br4);
      formPoljaNarudzbe.appendChild(datumNarudzbeLabel);
      formPoljaNarudzbe.appendChild(datumNarudzbeInput);
      formPoljaNarudzbe.appendChild(br5);
      formPoljaNarudzbe.appendChild(datumIsporukeLabel);
      formPoljaNarudzbe.appendChild(datumIsporukeInput);
      formPoljaNarudzbe.appendChild(br6);
      formPoljaNarudzbe.appendChild(nabavnaCijenaLabel);
      formPoljaNarudzbe.appendChild(nabavnaCijenaInput);

      poljaNarudzbe.appendChild(formPoljaNarudzbe);


      let poljaOpcija = kreirajElement('div', { "class": "col-sm-4 col-md-3 col-lg-6 col-xs-12 text-center", "style": "margin-top:5px;" });
      let btnIsporuceno = kreirajElement('input', { "type": "button", "class": "btn btn-primary", "value": "Isporučena", "style": "vertical-align:middle; width:250px;" });
      let btnObrisiNarudzbu = kreirajElement('input', { "type": "button", "class": "btn btn-danger", "value": "Obriši narudžbu", "style": "vertical-align:middle; width:250px;" });


      let btnSpasiNarudzbu = kreirajElement('input', {
        "type": "button", "class": "btn btn-primary spasiNarudzbu", "id": "spasiNarudzbuButton",
        "value": "Spasi narudžbu", "style": "vertical-align:middle; width:250px;visibility: hidden;", "onclick": "spasiNarudzbu()"
      });

      btnObrisiNarudzbu.onclick = function () {

        $.post('/obrisiNarudzbu', {
          nazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda, brojKomada: listaSvihNarudzbi[i].brojKomada,
          datumNarudzbe: listaSvihNarudzbi[i].datumNarudzbe, datumIsporuke: listaSvihNarudzbi[i].datumIsporuke, racun: listaSvihNarudzbi[i].racun,
          nabavnaCijena: listaSvihNarudzbi[i].nabavnaCijena, trackingNumber:listaSvihNarudzbi[i].trackingNumber
        }, function (returnedData) {

          if (returnedData.ispravan == "NE") {
            showNotification(returnedData.poruka, 4);
          }
          else {
            showNotification(returnedData.poruka, 2);
            zakasnjeleNarudzbe.removeChild(narudzba);
          }
        });
      };

      btnSpasiNarudzbu.onclick = function () {

        $.post('/narudzba/edit', {
          stariNazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda, stariBrojKomada: listaSvihNarudzbi[i].brojKomada,
          stariDatumNarudzbe: listaSvihNarudzbi[i].datumNarudzbe, stariDatumIsporuke: listaSvihNarudzbi[i].datumIsporuke, stariRacun: listaSvihNarudzbi[i].racun,
          staraNabavnaCijena: listaSvihNarudzbi[i].nabavnaCijena, brojKomada: komadiInput.value, datumNarudzbe: datumNarudzbeInput.value,
          datumIsporuke: datumIsporukeInput.value, racun: profil.value, nabavnaCijena: nabavnaCijenaInput.value, nazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda
        }, function (returnedData) {

          if (returnedData.ispravan == "NE") {
            showNotification(returnedData.poruka, 4);
          }
          else {
            showNotification(returnedData.poruka, 2);
          }
        });
      }

      btnIsporuceno.onclick = function () {

        $.post('/narudzba/delivered', {
          nazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda, brojKomada: listaSvihNarudzbi[i].brojKomada,
          datumNarudzbe: listaSvihNarudzbi[i].datumNarudzbe, datumIsporuke: listaSvihNarudzbi[i].datumIsporuke, racun: listaSvihNarudzbi[i].racun,
          nabavnaCijena: listaSvihNarudzbi[i].nabavnaCijena, trackingNumber: listaSvihNarudzbi[i].trackingNumber
        }, function (returnedData) {

          if (returnedData.ispravan == "NE") {
            showNotification(returnedData.poruka, 4);
          }
          else {
            showNotification(returnedData.poruka, 2);
            zakasnjeleNarudzbe.removeChild(narudzba);
          }
        });
      };

      var br1 = document.createElement("br");
      var br2 = document.createElement("br");

      poljaOpcija.appendChild(btnIsporuceno);
      poljaOpcija.appendChild(br1);
      poljaOpcija.appendChild(btnObrisiNarudzbu);
      poljaOpcija.appendChild(br2);
      poljaOpcija.appendChild(btnSpasiNarudzbu);

      // narudzba.appendChild(imageBox);
      narudzba.appendChild(poljaNarudzbe);
      narudzba.appendChild(poljaOpcija);
      //zakasnjeleNarudzbe.appendChild(narudzba); 

      narudzbeKojeKasneObjekti.push({ "objekat": listaSvihNarudzbi[i], "node": narudzba });
    }
  }




  //Ako narudzba kasni sa dostavom, dodajemo je u listu narudzbi koje kasne
  //if(new Date(listaSvihNarudzbi[i].datumIsporuke) < new Date()){


  // }

  narudzbeKojeKasneObjekti.sort(function (a, b) {
    return new Date(a.objekat.datumIsporuke) - new Date(b.objekat.datumIsporuke);
  });

  for (let j = 0; j < narudzbeKojeKasneObjekti.length; j++) {
    zakasnjeleNarudzbe.appendChild(narudzbeKojeKasneObjekti[j].node);
  }

}

function ucitajProizvodeKojeJePotrebnoNaruciti(listaSvihNarudzbi, potrebnoNarucitiKomada) {

  var potrebneNarudzbe = document.getElementById('potrebneNarudzbe');
  potrebneNarudzbe.innerHTML = "";
  let narudzbeKojeKasneObjekti = [];

  let sortirati = [];

  for (let i = 0; i < listaSvihNarudzbi.length; i++) {
    sortirati.push({ "narudzba": listaSvihNarudzbi[i], "potrebnoNaruciti": potrebnoNarucitiKomada[i] });
  }

  sortirati.sort(function (a, b) {
    return b.potrebnoNaruciti.potrebnoNarucitiKomada - a.potrebnoNaruciti.potrebnoNarucitiKomada;
  });

  //Sortirane narudzbe
  listaSvihNarudzbi = [];
  for (let i = 0; i < sortirati.length; i++) {
    listaSvihNarudzbi.push(sortirati[i].narudzba);
  }

  //Paralelno sortiran niz komada za naruciti
  potrebnoNarucitiKomada = [];
  for (let i = 0; i < sortirati.length; i++) {
    potrebnoNarucitiKomada.push(sortirati[i].potrebnoNaruciti);
  }

  for (let i = 0; i < listaSvihNarudzbi.length; i++) {

    let narudzba = kreirajElement('div', { "class": "row", "style": "margin-left:0px;border:1px solid white;border-radius: 0.5; margin-top:10px;", "id": "idnarudzbe" });

    let nazivProizvodaLabel = kreirajElement('label', {});
    nazivProizvodaLabel.innerText = "Naziv proizvoda: ";

    let nazivProizvoda = kreirajElement('label', { "style": "margin-left:10px" });
    nazivProizvoda.innerText = listaSvihNarudzbi[i].nazivProizvoda;

    let poljaNarudzbe = kreirajElement('div', { "class": "col-sm-4 col-lg-6 col-md-4 col-xs-12", "style": "margin-top:5px;" });
    let formPoljaNarudzbe = kreirajElement('form', { "class": "form-group" });

    let komadiLabel = kreirajElement('label', {});
    komadiLabel.innerText = "Broj komada na stanju: ";
    let brojKomadaLabel = kreirajElement('label', { "style": "margin-left:10px;" });
    brojKomadaLabel.innerText = listaSvihNarudzbi[i].brojKomada;

    let ebayPretragaLabel = kreirajElement('label', {});
    ebayPretragaLabel.innerText = "Ebay pretraga: ";
    let ebayPretragaCopy = kreirajElement('a', { 'class': 'linkZaKopiranje', "style": "margin-left:10px;" });
    ebayPretragaCopy.innerText = "Kopiraj";

    let potrebnoNarucitiLabel = kreirajElement('label', {});
    potrebnoNarucitiLabel.innerText = "Naručiti bar: ";
    let potrebnoNaruciti = kreirajElement('label', { "style": "margin-left:10px;" });
    potrebnoNaruciti.innerText = potrebnoNarucitiKomada[i].potrebnoNarucitiKomada + " komada";

    let prosjekProdajeLabel = kreirajElement('label', {});
    prosjekProdajeLabel.innerText = "Broj prodanih dnevno: ";
    let prosjekProdaje = kreirajElement('label', { "style": "margin-left:10px;" });
    prosjekProdaje.innerText = Math.round(listaSvihNarudzbi[i].prosjekProdaje * 100) / 100 + " komada";

    let br1 = kreirajElement('br', {});
    let br2 = kreirajElement('br', {});
    let br3 = kreirajElement('br', {});
    let br4 = kreirajElement('br', {});

    formPoljaNarudzbe.appendChild(nazivProizvodaLabel);
    formPoljaNarudzbe.appendChild(nazivProizvoda);
    formPoljaNarudzbe.appendChild(br1);
    formPoljaNarudzbe.appendChild(komadiLabel);
    formPoljaNarudzbe.appendChild(brojKomadaLabel);
    formPoljaNarudzbe.appendChild(br2);
    formPoljaNarudzbe.appendChild(ebayPretragaLabel);
    formPoljaNarudzbe.appendChild(ebayPretragaCopy);
    formPoljaNarudzbe.appendChild(br3);
    formPoljaNarudzbe.appendChild(potrebnoNarucitiLabel);
    formPoljaNarudzbe.appendChild(potrebnoNaruciti);
    formPoljaNarudzbe.appendChild(br4);
    formPoljaNarudzbe.appendChild(prosjekProdajeLabel);
    formPoljaNarudzbe.appendChild(prosjekProdaje);
    poljaNarudzbe.appendChild(formPoljaNarudzbe);


    let poljaOpcija = kreirajElement('div', { "class": "col-sm-4 col-md-3 col-lg-6 col-xs-12 text-center", "style": "margin-top:5px;" });
    let btnNaruci = kreirajElement('input', { "type": "button", "class": "btn btn-primary", "value": "Naruči", "style": "vertical-align:middle; width:250px;" });
    let btnDontShow = kreirajElement('input', { "type": "button", "class": "btn btn-danger", "value": "Ne prikazuj ovaj proizvod", "style": "vertical-align:middle; margin-left:5px; width:250px;" });

    ebayPretragaCopy.onclick = function () {
      copyToClipboard(listaSvihNarudzbi[i].ebayPretraga);
    }

    btnDontShow.onclick = function () {

      $.post('/proizvod/editNarudzbaAlert', { nazivProizvoda: listaSvihNarudzbi[i].nazivProizvoda, narudzbaAlert: false }, function (returnedData) {

        if (returnedData.poruka == "Ovaj proizvod se više neće pojavljivati u preporukama za narudžbe!") {
          showNotification(returnedData.poruka, 2);
          potrebneNarudzbe.removeChild(narudzba);
        }
        else {
          showNotification(returnedData.poruka, 4);
        }
      });
    };

    btnNaruci.onclick = function () {

      $.get('/user/current/allPrivileges', function(returnedData){

          if(returnedData.poruka != 'OK'){
              showNotification(returnedData.poruka, 4);
              return;
          }
          
          if(returnedData.rezultat == null) return;

          let listaSvihPrivilegija = Object.values(returnedData.rezultat);
          
          for(let j=0; j<listaSvihPrivilegija.length; j++){

              if(listaSvihPrivilegija[j] == 'Naruci'){
                  
                  openNav(listaSvihNarudzbi[i].nazivProizvoda, listaSvihNarudzbi[i].ebayPretraga, listaSvihNarudzbi[i]._id, listaSvihNarudzbi[i].ekstenzijaSlike);
                  window.open('https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=' + listaSvihNarudzbi[i].ebayPretraga.replace(' ', '+') + '&_sacat=0');
                  break;
              }
          }
      });

      /*if (privilegija) {
        openNav(listaSvihNarudzbi[i].nazivProizvoda, listaSvihNarudzbi[i].ebayPretraga);
        window.open('https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=' + listaSvihNarudzbi[i].ebayPretraga.replace(' ', '+') + '&_sacat=0');
      }*/

      //openOrderOverlay();
    };

    poljaOpcija.appendChild(btnNaruci);
    poljaOpcija.appendChild(btnDontShow);

    narudzba.appendChild(poljaNarudzbe);
    narudzba.appendChild(poljaOpcija);

    narudzbeKojeKasneObjekti.push({ "objekat": listaSvihNarudzbi[i], "node": narudzba });

  }

  for (let j = 0; j < narudzbeKojeKasneObjekti.length; j++) {
    potrebneNarudzbe.appendChild(narudzbeKojeKasneObjekti[j].node);
  }
}

//Funkcija koja vraca danasnji datum u formatu yyyy-mm-dd
function getCurrentDate() {

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function spremiNarudzbu2() {

  let brojKomada = document.getElementById('brojKomadaNarudzba').value;
  let datumIsporuke = document.getElementById('datumIsporukeNarudzba').value;
  let nabavnaCijena = document.getElementById('nabavnaCijenaNarudzba').value;
  let racun = document.getElementById('racunNarudzba').value;
  let datumNarudzbe = document.getElementById('datumNarudzbe').value;
  let trackingNumber = document.getElementById('trackingNumberNarudzba').value;

  $.get('/dajPodatkeProizvoda', { nazivProizvoda: imeKliknutogProizvoda }, function (returnedData2) {

    if (returnedData2.poruka == "OK") {

      $.post('/dodajNovuNarudzbu', {
        nazivProizvoda: imeKliknutogProizvoda, brojKomada: brojKomada, datumNarudzbe: datumNarudzbe,
        datumIsporuke: datumIsporuke, nabavnaCijena: nabavnaCijena, racun: racun, proizvodID: returnedData2.rezultat._id,
        ekstenzijaSlike: returnedData2.rezultat.ekstenzijaSlike, trackingNumber: trackingNumber, ebayPretraga: ebayPretragaKliknutogProizvoda
      }, function (returnedData) {

        if (returnedData.poruka == "Uspješno registrovana nova narudžba!") {
          showNotification(returnedData.poruka, 2);
          document.getElementById('brojKomadaNarudzba').value = "";
          document.getElementById('datumIsporukeNarudzba').value = null;
          document.getElementById('nabavnaCijenaNarudzba').value = "";
          document.getElementById('racunNarudzba').value = "";
          document.getElementById('trackingNumberNarudzba').value = "";
          closeNav();
        }
        else {
          showNotification(returnedData.poruka, 4);
        }
      });
    }

  });

}


var pretragaFilter = document.getElementById("pretragaFilter");

pretragaFilter.addEventListener("keyup", function (event) {

  if (event.keyCode === 13) {

    event.preventDefault();

    if (pretragaFilter.value != "") {

      let prva = document.getElementById("sveNarudzbe");
      let druga = document.getElementById("zakasnjeleNarudzbe");
      let treca = document.getElementById("potrebneNarudzbe");

      //Ocistimo prethodno ucitane narudzbe kako bi izbjegli dupliciranje
      document.getElementById('sveNarudzbe').innerHTML = "";
      document.getElementById('zakasnjeleNarudzbe').innerHTML = "";
      document.getElementById('potrebneNarudzbe').innerHTML = "";

      if (prva.style.display == "block") {

        $.get('/dajSveNarudzbe', function (returnedData) {

          if(returnedData != null && returnedData.rezultat != null){

            let listaSvihNarudzbi = Object.values(returnedData.rezultat);
            let filtriranaLista = filtrirajNarudzbe(listaSvihNarudzbi, pretragaFilter.value);
            ucitajSveNarudzbe(filtriranaLista);
          }
        });
      }
      else if (druga.style.display == "block") {

        $.get('/narudzbe/kasnjenje', function (returnedData) {

          if(returnedData != null && returnedData.rezultat != null){

            let listaSvihNarudzbi = Object.values(returnedData.rezultat);
            let filtriranaLista = filtrirajNarudzbe(listaSvihNarudzbi, pretragaFilter.value);
            ucitajNarudzbeKojeKasne(filtriranaLista);
          }
          
        });
      }
      else if (treca.style.display == "block") {
        potrebnoNarucitiTabOnClick(pretragaFilter.value);
      }
      else {
        showNotification("Učitavanje neuspješno iz nepoznatih razloga!", 4);
      }
    }
    else {
      showNotification("Unesite naziv za pretragu", 4);
    }
  }
});

function potrebnoNarucitiTabOnClick(pretragaFilter) {

  $.get('/proizvod/potrebnoNaruciti', function (returnedData) {

    if(returnedData == null) return;

    let listaSvihProizvoda = Object.values(returnedData.rezultat);
    let filtriranaLista = filtrirajProizvode(listaSvihProizvoda, pretragaFilter);
    let potrebnoNaruciti = Object.values(returnedData.potrebnoNaruciti);
    ucitajProizvodeKojeJePotrebnoNaruciti(filtriranaLista, potrebnoNaruciti);
  });
}

//Prima listu svih narudzbi i string pretrage, te vraca filtriranu listu. Pretraga se radi po nazivu proizvoda i po tracking number
function filtrirajNarudzbe(listaSvihNarudzbi, pretragaString) {

  let rez = [];
  let rijeci = pretragaString.split(' ');

  for (let i = 0; i < listaSvihNarudzbi.length; i++) {

    let pass = true;
    for (let j = 0; j < rijeci.length; j++) {

      if (listaSvihNarudzbi[i].trackingNumber.includes(rijeci[j])) {
        pass = true;
        break;
      }

      if (!listaSvihNarudzbi[i].nazivProizvoda.toUpperCase().includes(rijeci[j].toUpperCase())) {
        pass = false;
        break;
      }
    }

    if (pass) rez.push(listaSvihNarudzbi[i]);
  }

  return rez;
}

//Prima listu proizvoda i string pretrage, te vraca filtriranu listu. Pretraga se radi po nazivu proizvoda
function filtrirajProizvode(listaSvihProizvoda, pretragaString) {

  let rez = [];
  let rijeci = pretragaString.split(' ');

  for (let i = 0; i < listaSvihProizvoda.length; i++) {

    let pass = true;
    for (let j = 0; j < rijeci.length; j++) {

      if (!listaSvihProizvoda[i].nazivProizvoda.toUpperCase().includes(rijeci[j].toUpperCase())) {
        pass = false;
        break;
      }
    }

    if (pass) rez.push(listaSvihProizvoda[i]);
  }

  return rez;
}
function openNav(nazivProizvoda, ebayPretraga, proizvodId, proizvodEkstenzija) {

  imeKliknutogProizvoda = nazivProizvoda;
  ebayPretragaKliknutogProizvoda = ebayPretraga;

  document.getElementById('slikaProizvodaNarudzbe').src = "../assets/img/" + proizvodId + proizvodEkstenzija;
  document.getElementById("myNav").style.height = "100%";
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.height = "0%";
  document.getElementById("myNav").style.width = "0%";
  potrebnoNarucitiTabOnClick(pretragaFilter.value);
}
$(document).keyup(function (e) {
  if (e.key === "Escape") { // escape key maps to keycode `27`
    try {
      closeNav();
    } catch (e) { }
  }
});


// DROPDOWN ZA NARUDZBE
$("#pretragaFilter").click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById("narudzbice").style.display = "block";
  $('#narudzbice').show();
});
$(document).click(function (e) {
  if (e.target.id == "narudzbice" || e.target.id == "pretragaFilter" || e.target.classList[0] == "li") {
    //alert("do't hide");  
  } else {
    document.getElementById("narudzbice").style.display = "none";
    //$(".login-panel").hide();

  }
});



function ucitajNarudzbeUDropdown(narudzbe) {
  document.getElementById("narudzbice").innerHTML = "";

  if (narudzbe == "kojeSeCekaju") {
    /*for (let i = 0; i < narudzbeKojeSeCekaju.length; i++) {
      var li1 = kreirajElement('li', { "tabindex": "-1", "onclick": "clickNaLiItem(this)" });
      var a1 = kreirajElement('a', { "href": "#statistike" }); a1.innerText = narudzbeKojeSeCekaju[i];
      li1.appendChild(a1);
      document.getElementById("narudzbice").appendChild(li1);
    }*/
  }
  else if (narudzbe == "kojeKasne") {
    for (let i = 0; i < narudzbeKojeKasne.length; i++) {
      var li1 = kreirajElement('li', { "tabindex": "-1", "onclick": "clickNaLiItem(this)" });
      var a1 = kreirajElement('a', { "href": "#statistike" }); a1.innerText = narudzbeKojeKasne[i];
      li1.appendChild(a1);
      document.getElementById("narudzbice").appendChild(li1);
    }
  }
  else if (narudzbe == "potrebneNaruciti") {
    for (let i = 0; i < onoStoJePotrebnoNaruciti.length; i++) {
      var li1 = kreirajElement('li', { "tabindex": "-1", "onclick": "clickNaLiItem(this)" });
      var a1 = kreirajElement('a', { "href": "#statistike" }); a1.innerText = onoStoJePotrebnoNaruciti[i];
      li1.appendChild(a1);
      document.getElementById("narudzbice").appendChild(li1);
    }
  }
  else;
}

function prikaziListuNarudzbi() {
  document.getElementById("narudzbice").style.display = "block";
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
function filterNarudzbi(inputID, ulID) {
  filtriraj(inputID, ulID);
  idHighlightNarudzbe = -1;
}

function oznaci(ch) {
  focusedInput = ch.id;
  focusedUL = "narudzbice";
  //console.log(focusedInput + " " + focusedUL);
  idHighlightNarudzbe = -1;
}

function dajVidljiveNarudzbe() {
  let narudzbe = document.getElementById(focusedUL).getElementsByTagName('li');
  let noveNarudzbe = [];
  for (let i = 0; i < narudzbe.length; i++) {
    if (narudzbe[i].style.display != "none") noveNarudzbe.push(narudzbe[i]);
  }
  return noveNarudzbe;
}

var focusedInput = "pretragaFilter";
var focusedUL = "narudzbice";
var idHighlightNarudzbe = -1;

function clickNaLiItem(li) {
  document.getElementById("pretragaFilter").value = li.childNodes[0].innerText;
  // filtrirajNarudzbe(listaNarudzbi,narudzbe[i].childNodes[0].innerText);
}
$(document).keyup(function (e) {
  if (e.key === "Enter") {
    let narudzbe = dajVidljiveNarudzbe();
    for (var i = 0; i < narudzbe.length; i++) {
      if (narudzbe[i] === document.activeElement) {
        document.getElementById(focusedInput).value = narudzbe[i].childNodes[0].innerText;
        document.getElementById(focusedUL).style.display = "none";
        // filtrirajNarudzbe(listaNarudzbi,narudzbe[i].childNodes[0].innerText);
      }
    }
  }

});

document.onkeydown = function (event) {

  if (document.getElementById(focusedUL).style.display == "block" && document.getElementById(focusedUL).childNodes >1) {

    let narudzbe = dajVidljiveNarudzbe();
    if (event.keyCode == 38) {
      event.preventDefault();
      // GORE
      idHighlightNarudzbe--;
      if (idHighlightNarudzbe < -1) { idHighlightNarudzbe = narudzbe.length - 1; narudzbe[idHighlightNarudzbe].focus(); }
      else if (idHighlightNarudzbe == -1) document.getElementById(focusedInput).focus();
      else narudzbe[idHighlightNarudzbe].focus();

    }
    else if (event.keyCode == 40) {
      event.preventDefault();
      // DOLJE
      idHighlightNarudzbe++;

      if (idHighlightNarudzbe == narudzbe.length) {
        idHighlightNarudzbe = -1;
        document.getElementById(focusedInput).focus();
      }
      else narudzbe[idHighlightNarudzbe].focus();
    }
    else;
  }
};


function logOut() {

  $.get('/logout', function (returnedData) {
      window.location.replace('/login.html');
  });
}