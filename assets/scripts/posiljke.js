let brojObrisanihPosiljki = 0;
let brojRegistrovanihPosiljki = 0;


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

//Vraca datum u string formatu dd-mm-yyyy
function formatirajDatum(datum) {

  let dd = String(datum.getDate()).padStart(2, '0');
  let mm = String(datum.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = datum.getFullYear();

  return dd + '-' + mm + '-' + yyyy;
}

function changeForm(a) {

  var prva = document.getElementById("novePosiljke");
  var druga = document.getElementById("brisanjePosiljki");
  var treca = document.getElementById("zakasnjelePosiljke");

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
    prviButton.classList.add("active");
    drugiButton.classList.remove("active");
    treciButton.classList.remove("active");

    prva.style.display = "block";
    druga.style.display = "none";
    treca.style.display = "none";
    document.getElementById("idNovePosiljke").focus();
    document.getElementById("uspjesnoProknjizenePosiljke").style.visibility = "hidden";
    proknjizenePosiljke = 0;
    //document.getElementById('opisForme').innerText="Registruj nove pošiljke.";
    //window.location='#sveNarudzbe';
  }
  else if (a == 2) {
    prviButton.classList.remove("active");
    drugiButton.classList.add("active");
    treciButton.classList.remove("active");

    // document.getElementById('opisForme').innerText="Obriši pošiljke koje su gotove.";

    prva.style.display = "none";
    druga.style.display = "block";
    treca.style.display = "none";
    document.getElementById("uspjesnoProknjizenePosiljke").style.visibility = "hidden";
    proknjizenePosiljke = 0;
    document.getElementById("obrisanePosiljke").focus();
    //window.location='#zakasnjeleNarudzbe';
  }
  else if (a == 3) {
    prviButton.classList.remove("active");
    drugiButton.classList.remove("active");
    treciButton.classList.add("active");

    //document.getElementById('opisForme').innerText="Ispod se nalaze posiljke koje kasne. Pregledaj ih i eventualno označi kao pristigle."

    prva.style.display = "none";
    druga.style.display = "none";
    treca.style.display = "block";
    document.getElementById("uspjesnoProknjizenePosiljke").style.visibility = "hidden";
    proknjizenePosiljke = 0;
    ucitajPosiljkeKojeKasne();
  }
  else {
    prviButton.classList.add("active");
    drugiButton.classList.remove("active");
    treciButton.classList.remove("active");

    prva.style.display = "block";
    druga.style.display = "none";
    treca.style.display = "none";
    document.getElementById("uspjesnoProknjizenePosiljke").style.visibility = "hidden";
    proknjizenePosiljke = 0;
    //document.getElementById('opisForme').innerText="Registruj nove pošiljke.";
  }
}

function showNotification1(msg, boja) {

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
    timer: 200,
    placement: {
      from: 'bottom',
      align: 'right'
    }
  });
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
var proknjizenePosiljke = 0;
function vratiDeklinacijuPosiljke(brojPosiljki) {
  if (brojPosiljki == 1) return " pošiljka";
  else if (brojPosiljki == 2 || brojPosiljki == 3 || brojPosiljki == 4) return " pošiljke"
  else if (brojPosiljki >= 5 || brojPosiljki <= 20) return " pošiljki";
  else if (brojPosiljki > 20 && brojPosiljki % 10 == 1) return " pošiljka";
  else if (brojPosiljki > 20 && (brojPosiljki % 10 == 2 || brojPosiljki % 10 == 3 || brojPosiljki % 10 == 4)) return " pošiljke";
  else if (brojPosiljki > 20 && (brojPosiljki % 10 > 4)) return " pošiljki";
  else return "pošiljaka";
}


function spasiPosiljku() {

  var idNovePosiljke = document.getElementById('idNovePosiljke').value;
  
  if (idNovePosiljke.length == 12 || (idNovePosiljke.length == 10 && idNovePosiljke[0] == 'A')) {

    document.getElementById('idNovePosiljke').value = "";

    $.post('/posiljke/add', { barkod: idNovePosiljke, datum: new Date() }, function (returnedData) {

      if (returnedData.poruka != 'OK') showNotification(returnedData.poruka, 4);

      else {
        proknjizenePosiljke++;
        document.getElementById("uspjesnoProknjizenePosiljke").innerText = "Uspješno proknjiženo " + proknjizenePosiljke + vratiDeklinacijuPosiljke(proknjizenePosiljke);
        document.getElementById("uspjesnoProknjizenePosiljke").style.visibility = "visible";
        
      }
    });
  }
}

function obrisiPosiljku() {

  // brojObrisanihPosiljki++;
  //console.log(brojObrisanihPosiljki);

  let posiljkaZaObrisati = document.getElementById('obrisanePosiljke').value;

  if(posiljkaZaObrisati.length == 11 && posiljkaZaObrisati[0] == 'O'){
  
      document.getElementById('obrisanePosiljke').value = "";

      $.post('/posiljke/remove', { barkod: posiljkaZaObrisati.substring(1) }, function (returnedData) {

        if (returnedData.poruka != 'Pošiljka uspješno obrisana') showNotification(returnedData.poruka, 4);
  
        else {
          proknjizenePosiljke++;
          document.getElementById("uspjesnoProknjizenePosiljke").innerText = "Uspješno obrisano " + proknjizenePosiljke + vratiDeklinacijuPosiljke(proknjizenePosiljke);
          document.getElementById("uspjesnoProknjizenePosiljke").style.visibility = "visible";
  
  
        }
      });
  }

  if (posiljkaZaObrisati.length == 12) {

    document.getElementById('obrisanePosiljke').value = "";

    $.post('/posiljke/remove', { barkod: posiljkaZaObrisati }, function (returnedData) {

      if (returnedData.poruka != 'Pošiljka uspješno obrisana') showNotification(returnedData.poruka, 4);

      else {
        proknjizenePosiljke++;
        document.getElementById("uspjesnoProknjizenePosiljke").innerText = "Uspješno obrisano " + proknjizenePosiljke + vratiDeklinacijuPosiljke(proknjizenePosiljke);
        document.getElementById("uspjesnoProknjizenePosiljke").style.visibility = "visible";


      }
    });
  }
}


function proknjiziPosiljkeGrupno(){

    let textArea = document.getElementById('posiljkeTextArea').value;
    
    let array = textArea.split("\n");
    array = array.filter(x => (x.trim() != 'M Shop' && x.trim().length == 12));

    array.forEach(function(part, index, theArray) {
      theArray[index] = theArray[index].trim();
    });

    console.log(array);
    
    var r = confirm("Skenirano " + array.length.toString() + " pošiljki. Potvrditi unos.");
    if (r == true) {
      
      $.post('/posiljke/removeMany', {barkodovi:array}, function(returnedData){

          if(returnedData.status == 'ok'){
            showNotification(returnedData.poruka, 2);
            document.getElementById('posiljkeTextArea').value = "";
          }
          else{
            showNotification(returnedData.poruka, 4);
          }
      });

    } else {
      alert("Unos otkazan!");
    }
}


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

function ucitajPosiljkeKojeKasne() {

  let kasnePosiljkeTabela = document.getElementById('posiljkeKasneTabela');
  kasnePosiljkeTabela.innerHTML = "";

  $.get('/posiljke/late', function (returnedData) {

    if (returnedData.poruka != 'OK') showNotification(returnedData.poruka, 4);

    else {

      for (let i = 0; i < returnedData.rezultat.length; i++) {

        let tr = kreirajElement('tr', {});

        let td1 = kreirajElement('td', {});
        td1.innerHTML = returnedData.rezultat[i].barkod;
        let td2 = kreirajElement('td', {});

        td2.innerHTML = formatirajDatum(new Date(returnedData.rezultat[i].datum));

        let td3 = kreirajElement('td', { "class": "text-center" });
        let input1 = kreirajElement('input', { "type": "button", "class": "btn btn-primary", "value": "Kopiraj" });

        //Textbox koji se ne prikazuje, ali koristi za Copy button
        // let tb = kreirajElement('input', {'type':'text', 'value': returnedData.rezultat[i].barkod});

        /*input1.onclick = function () {

          navigator.clipboard.writeText(returnedData.rezultat[i].barkod).then(function () {
          }, function (err) {
            showNotification('Iz nepoznatog razloga kopiranje nije uspjelo!', 4);
          });
        };*/
        input1.onclick = function () { copyToClipboard(returnedData.rezultat[i].barkod); }

        td3.appendChild(input1);

        let td4 = kreirajElement('td', { "class": "text-center" });
        let input2 = kreirajElement('input', { "type": "button", "class": "btn btn-danger", "value": "Obrisi" });

        input2.onclick = function () {

          $.post('/posiljke/remove', { barkod: returnedData.rezultat[i].barkod }, function (returnedData) {

            if (returnedData.poruka != "Pošiljka uspješno obrisana") {
              showNotification(returnedData.poruka, 4);
            }

            else {
              kasnePosiljkeTabela.removeChild(tr);
              showNotification(returnedData.poruka, 2);
            }
          });
        };

        td4.appendChild(input2);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        kasnePosiljkeTabela.appendChild(tr);
      }
    }
  });
}

function logOut() {

  $.get('/logout', function (returnedData) {
    window.location.replace('/login.html');
  });
}