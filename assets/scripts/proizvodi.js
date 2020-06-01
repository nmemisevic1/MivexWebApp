
var imeKliknutogProizvoda = "";
let sviNaziviProizvoda = [];

function showNotification(msg, boja) {
  var ikona;
  if (boja == 1) {
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

//Ista kao obična filtriraj, samo što očekuje DOM objekte umjesto id-ova
function filtriraj2(inputElement, ulElement) {

  var filter, li, a, i, txtValue;

  filter = inputElement.value.toUpperCase();

  li = ulElement.getElementsByTagName('li');
  ulElement.style.display = "block";
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



function LiClick() {

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
var dubinaKategorija = 1;


function proizvodiOnload() {

  let pocetnaUL = document.getElementById('Depth1');
  let pocetniInput = document.getElementById('Input1');
  pocetniInput.onclick = function () { pocetniInput.value = ""; filtriraj('Input1', 'Depth1'); focusedInput = "Input1"; focusedUL = "Depth1"; idHighlightKategorije = -1; };
  pocetniInput.onkeyup = function () { filtriraj('Input1', 'Depth1'); idHighlightKategorije = -1; };
  pocetniInput.onfocus = function () { focusedInput = "Input1"; focusedUL = "Depth1"; idHighlightKategorije = -1; }

  let traziProizvodInput = document.getElementById("pretragaFilter");
  let traziProizvodUL = document.getElementById("proizvodiDepth");

  traziProizvodInput.onclick = function () {
    traziProizvodInput.value = "";
    if (traziProizvodInput.value.length >= 2) filtriraj('pretragaFilter', 'proizvodiDepth');
  };

  traziProizvodInput.onkeyup = function () {

    if (traziProizvodInput.value.length >= 2) filtriraj('pretragaFilter', 'proizvodiDepth');

    else if (traziProizvodInput.value.length == 0) {
      let li = traziProizvodUL.getElementsByTagName('li');

      for (let i = 0; i < li.length; i++) {
        li[i].style.display = "none";
      }
    }
  };

  ucitajBazeTrenutnogKorisnika();

  //Ucitati sve kategorije koje nemaju parent kategoriju
  let kategorije = [];

  $.get('/dajSveKategorije', function (returnedData) {

    if (returnedData == null) return;

    /*let kategorijeEdit = document.getElementById('parentKategorija');
    console.log(kategorijeEdit);*/

    let k = Object.values(returnedData.rezultat);

    for (let i = 0; i < k.length; i++) {

      if (k[i].parent == '') {
        kategorije.push(k[i].naziv);
      }
      /*if(kategorijeEdit != null){
        var kategorija = kreirajElement("option", { "style": "color:black!important;", "value": k[i].naziv });
        kategorija.innerText = k[i].naziv;
        kategorijeEdit.options[kategorijeEdit.options.length] = kategorija;
      }*/
    }

    kategorije.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    for (let i = 0; i < kategorije.length; i++) {

      var listItem = kreirajElement("li", { "tabIndex": "-1" });
      //let listItem = document.createElement('li');
      listItem.innerHTML = "<a href=\"#\">" + kategorije[i] + "</a>";

      listItem.onclick = function () { clickNaItem(pocetniInput, pocetnaUL, kategorije[i], document.getElementById('prviDiv')); };
      listItem.onkeyup = function () {
        if (event.keyCode === 13) {
          event.preventDefault();
          clickNaItem(pocetniInput, pocetnaUL, kategorije[i], document.getElementById('prviDiv'));
        }
      }
      //listItem.onkeydown
      pocetnaUL.appendChild(listItem);
    }
  });

  $.get('/proizvodi/nazivi', function (returnedData) {

    if (returnedData.poruka == 'OK') {
      sviNaziviProizvoda = returnedData.rezultat;

      for (let i = 0; i < sviNaziviProizvoda.length; i++) {
        // DODATI NAZIVE SVIH PROIZVODA IZ BAZE
        let listItem = kreirajElement("li", { "tabindex": "-1" });
        listItem.onclick = function () {
          pretragaFilter.value = listItem.innerText;
          document.getElementById("proizvodiDepth").style.display = "none";
          pretragaFilterClick();
        }
        listItem.innerHTML = "<a href=\"#\">" + sviNaziviProizvoda[i] + "</a>";

        //listItem.onclick = function () { clickNaItem(traziProizvodInput, traziProizvodUL, sviNaziviProizvoda[i], document.getElementById('pretragaDiv')); };
        traziProizvodUL.appendChild(listItem);
      }
    }
  });

  let kopirajEbayPretragu = document.getElementById("ebayCopy");
  if (kopirajEbayPretragu != null) {
    kopirajEbayPretragu.onclick = function () {
      copyToClipboard(document.getElementById("ebayPretragaEdit").value);
    };
  }
}


var pretragicaFiltercic = document.getElementById("pretragaFilter");
pretragicaFiltercic.focus();
function ucitajBazeTrenutnogKorisnika() {

  let bazaDropDown = document.getElementById('aktivnaBaza');

  $.get('/user/current/aktivnaBaza/get', function (returnedData1) {

    let aktivnaBaza = returnedData1.rezultat;

    $.get('/currentUser/allDatabases', function (returnedData) {

      if (returnedData == null) return;

      let k = Object.values(returnedData.rezultat);

      for (let i = 0; i < k.length; i++) {

        if (returnedData1.poruka == "Nema zapis" && i == 0) {
          $.post('/baza/changeActive', { aktivnaBaza: k[i] }, function (returnedData) { });
        }

        let option1 = kreirajElement('option', { "class": "form-control", "value": k[i], "style": "color: darkslategray" });
        option1.innerHTML = k[i];
        bazaDropDown.options[bazaDropDown.options.length] = option1;

        if (returnedData.poruka == "OK" && k[i] == aktivnaBaza) {
          bazaDropDown.value = option1.innerHTML;
        }
      }
    });

    bazaDropDown.onchange = function () {
      $.post('/baza/changeActive', { aktivnaBaza: bazaDropDown.options[bazaDropDown.selectedIndex].value }, function (returnedData) { });
    }
  });
}

function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#editSlika')
        .attr('src', e.target.result)
    };
    reader.readAsDataURL(input.files[0]);
  }
}

$("#files").change(function () {
  filename = this.files[0].name
  //console.log(filename);
});

$("#editProizvodForma").submit(function (e) {
  e.preventDefault();
});


$("form[name='editProizvodForma']").unbind('submit').submit(function (e) {

  e.preventDefault();

  let ime = document.getElementById('imeProizvodaEdit').value;
  let nabavna = document.getElementById('nabavnaCijenaEdit').value;
  let prodajna = document.getElementById('prodajnaCijenaEdit').value;
  let brojKom = document.getElementById('brojKomadaEdit').value;
  let bazaCheckBoxi = document.getElementsByName('pregledProizvodaBazeCheckboxi');
  let bazaLabele = document.getElementsByName('pregledProizvodaBazeLabels');


  if (ime.value == "") {
    showNotification("Molimo unesite naziv proizvoda!", 4);
  }
  else if (nabavna == "") {
    showNotification("Molimo unesite ispravnu nabavnu cijenu proizvoda!", 4);
  }
  else if (prodajna == "") {
    showNotification("Molimo unesite prodajnu cijenu proizvoda!", 4);
  }
  else if (document.getElementById('parentKategorija').selected == true) {
    showNotification("Molimo odaberite kategoriju proizvoda!", 4);
  }
  else if (isNaN(nabavna.replace(',', '.')) || nabavna < 0) {
    showNotification("Molimo unesite ispravnu nabavnu cijenu!", 4);
  }
  else if (isNaN(prodajna.replace(',', '.')) || prodajna < 0) {
    showNotification("Molimo unesite ispravnu prodajnu cijenu!", 4);
  }
  else if (brojKom.includes('.') || brojKom < 0) {
    showNotification("Molimo unesite ispravan broj komada!", 4);
  }

  else {
    let editovaneBaze = [];

    for (let i = 0; i < bazaCheckBoxi.length; i++) {

      if (bazaCheckBoxi[i].checked) {
        editovaneBaze.push(bazaLabele[i].innerText);
      }
    }

    if (editovaneBaze.length == 0) {
      showNotification("Molimo odaberite bazu u koju želite dodati proizvod", 4);
    }

    else if (editovaneBaze.length > 1) {
      showNotification("Moguće je odabrati samo jednu bazu za jedan proizvod", 4);
    }

    else {

      let forma = document.getElementById('editProizvodForma');
      let narudzbaAlertCheckBox = document.getElementsByName('narucitiAlertCheckBox');

      var formData = new FormData(forma);

      formData.append('stariNazivProizvoda', imeKliknutogProizvoda);
      formData.append('baza', editovaneBaze[0]);
      formData.append('narudzbaAlert', narudzbaAlertCheckBox[0].checked);

      $.ajax({
        url: "/editProizvod",
        type: "POST",

        data: formData,

        success: function (msg) {

          if (msg.poruka == "Uspješno ažurirani podaci za proizvod") {
            
            showNotification(msg.poruka, 2);
            
            
            imeKliknutogProizvoda = ime;
          }
          else {
            showNotification(msg.poruka, 4);
          }
        },
        cache: false,
        contentType: false,
        processData: false
      });
    }
  }
});


function clickNaItem(parentInput, parentUL, kategorija, parentDiv) {

  $.get('/proizvod/category', { kategorija: kategorija }, function (returnedData) {

    if (returnedData.poruka != 'OK') {
      showNotification(returnedData.poruka, 4);
      return;
    }

    let k = Object.values(returnedData.rezultat);
    nizProizvoda = k; /* */
    let red = document.getElementById('sviProizvodiDiv');
    red.innerHTML = "";

    if (k.length != 0) {

      let naStanjuDropdown = document.getElementById('filterProizvodaStanja');

      for (let i = 0; i < k.length; i++) {

        if (naStanjuDropdown.value == "naStanju" && k[i].brojKomada == 0) {
          continue;
        }

        ucitajProizvodPregled(k[i]);
      }
    }

  });

  parentInput.value = kategorija;
  parentUL.style.display = 'none';
  dubinaKategorija = parentInput.id[parentInput.id.length - 1];
  let podKategorije = [];
  dubinaKategorija++;
  let noviDiv = kreirajElement('div', { "class": "col-sm-4 col-md-3 col-lg-3 col-xs-12" });
  //let sljedeciId = dajSljedeciId(parentInput.id);

  let noviInput = kreirajElement('input', { "class": "form-control", "type": "text", "id": "Input" + dubinaKategorija, "placeholder": "Kategorija" });

  noviDiv.appendChild(noviInput);

  let novaUL = kreirajElement('ul', { "class": "myUL", "style": "display:none", "id": "Depth" + dubinaKategorija });

  $.get('/dajDjecuKategorije', { roditelj: parentInput.value }, function (returnedData) {

    if (returnedData == null) return;

    let k = Object.values(returnedData.rezultat);

    for (let i = 0; i < k.length; i++) {
      podKategorije.push(k[i].naziv);
    }

    if (k.length != 0) {

      let kategorijeRed = document.getElementById('kategorijeRed');
      let children = kategorijeRed.children;

      for (let i = 0; i < children.length; i++) {

        if (parentDiv == children[i]) {

          for (let j = i + 1; j < children.length; j++) {
            children[j].remove();
            j--;
          }
          break;
        }

      }

      podKategorije.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      for (let j = 0; j < podKategorije.length; j++) {

        var listItem1 = kreirajElement('li', { "tabindex": "-1" });
        listItem1.innerHTML = "<a href=\"#\">" + podKategorije[j] + "</a>";
        listItem1.onclick = function () { clickNaItem(noviInput, novaUL, podKategorije[j], noviDiv); };
        listItem1.onkeyup = function () {
          if (event.keyCode === 13) {
            event.preventDefault();
            clickNaItem(noviInput, novaUL, podKategorije[j], noviDiv);
          }
        }
        novaUL.appendChild(listItem1);
      }

      noviDiv.appendChild(novaUL);
      document.getElementById('kategorijeRed').appendChild(noviDiv);
      noviInput.onclick = function () { noviInput.value = ""; filtriraj2(noviInput, novaUL); focusedInput = noviInput.id; focusedUL = "Depth" + noviInput.id.substr(5); idHighlightKategorije = -1; }

      noviInput.onkeyup = function () { filtriraj2(noviInput, novaUL); idHighlightKategorije = -1; }
      noviInput.onfocus = function () { focusedInput = noviInput.id; focusedUL = "Depth" + noviInput.id.substr(5); idHighlightKategorije = -1; }
      noviInput.focus();

      focusedInput = noviInput.id;
      novaUL.style.display = "block";
    }

    else {

      let kategorijeRed = document.getElementById('kategorijeRed');
      let children = kategorijeRed.children;

      for (let i = 0; i < children.length; i++) {

        if (parentDiv == children[i]) {

          for (let j = i + 1; j < children.length; j++) {
            children[j].remove();
            j--;
          }
          break;
        }

      }
    }
  });


}
function dajVidljivuListuKategorija(focusedUL) {
  let kategorije = document.getElementById(focusedUL).getElementsByTagName('li');
  console.log(focusedUL);
  let noveKategorije = [];
  for (let i = 0; i < kategorije.length; i++) {
    if (kategorije[i].style.display != "none") noveKategorije.push(kategorije[i]);
  }
  return noveKategorije;
}
var idHighlightKategorije = -1;
var focusedInput = "Input1";
var focusedUL = "Depth1";
kategorijeRed.onkeydown = function (event) {
  if (document.activeElement.id.substr(0, 5) == "Input" || document.activeElement.tabIndex == -1) {
    console.log(focusedUL);
    console.log(focusedInput);

    let kategorije = dajVidljivuListuKategorija(focusedUL);
    //console.log(kategorije);
    if (event.keyCode == 38) {
      event.preventDefault();
      // GORE
      idHighlightKategorije--;
      if (idHighlightKategorije < -1) { idHighlightKategorije = kategorije.length - 1; kategorije[idHighlightKategorije].focus(); }
      else if (idHighlightKategorije == -1) document.getElementById(focusedInput).focus();
      else kategorije[idHighlightKategorije].focus();
      //console.log(kategorije[idHighlightKategorije]);
    }
    else if (event.keyCode == 40) {
      event.preventDefault();
      // DOLJE
      idHighlightKategorije++;

      if (idHighlightKategorije == kategorije.length) {
        idHighlightKategorije = -1;
        document.getElementById(focusedInput).focus();
      }
      else kategorije[idHighlightKategorije].focus();
      //console.log(kategorije[idHighlightKategorije]);
    }
    // A kad kliknemo enter
    else if (event.keyCode == 13 && document.activeElement.tabindex == -1) {
      document.activeElement.click();
    }
    else;
  }
};

var idHighlightProizvoda = -1;
pretragaDiv.onkeydown = function (event) {
  if (document.getElementById("proizvodiDepth").style.display != "none") {
    console.log(event.keyCode + " " + document.activeElement.tabIndex);
    let proizvodi = dajVidljivuListuKategorija("proizvodiDepth");
    if (event.keyCode == 38) {
      event.preventDefault()
      idHighlightProizvoda--;
      if (idHighlightProizvoda < -1) { idHighlightProizvoda = proizvodi.length - 1; proizvodi[idHighlightProizvoda].focus(); }
      else if (idHighlightProizvoda == -1) document.getElementById("pretragaFilter").focus();
      else proizvodi[idHighlightProizvoda].focus();
    }
    else if (event.keyCode == 40) {
      event.preventDefault();
      idHighlightProizvoda++;
      if (idHighlightProizvoda == proizvodi.length) {
        idHighlightProizvoda = -1;
        document.getElementById("pretragaFilter").focus();
      }
      else proizvodi[idHighlightProizvoda].focus();
    }
    
    else if (event.keyCode == 13 && document.activeElement.tabIndex == -1) {
      console.log("HVVVV");
      document.activeElement.click();
    }
  }

}
var trenutnoOtvoreniProizvod = null;

function openNav(nazivProizvoda, nesto) {
  console.log(nesto);
  trenutnoOtvoreniProizvod = nesto;
  imeKliknutogProizvoda = nazivProizvoda;
  document.getElementById("myNav").style.height = "100%";
  document.getElementById("myNav").style.width = "100%";

  $.get('/dajPodatkeProizvoda', { nazivProizvoda: imeKliknutogProizvoda }, function (returnedData) {

    if (document.getElementById('imeProizvodaEdit') != null) document.getElementById('imeProizvodaEdit').value = imeKliknutogProizvoda;
    if (document.getElementById('ebayPretragaEdit') != null) document.getElementById('ebayPretragaEdit').value = returnedData.rezultat.ebayPretraga;
    if (document.getElementById('nabavnaCijenaEdit') != null) document.getElementById('nabavnaCijenaEdit').value = parseFloat(returnedData.rezultat.nabavnaCijena).toFixed(2);
    if (document.getElementById('prodajnaCijenaEdit') != null) document.getElementById('prodajnaCijenaEdit').value = parseFloat(returnedData.rezultat.prodajnaCijena).toFixed(2);
    if (document.getElementById('brojKomadaEdit') != null) document.getElementById('brojKomadaEdit').value = returnedData.rezultat.brojKomada;
    if (document.getElementById('parentKategorija') != null) document.getElementById('parentKategorija').value = returnedData.rezultat.kategorija;
    if (document.getElementById('editSlika') != null) {
      document.getElementById('editSlika').src = "assets/img/" + returnedData.rezultat._id + returnedData.rezultat.ekstenzijaSlike;
      let narudzbaAlertCheckBox = document.getElementsByName('narucitiAlertCheckBox');

      if (returnedData.rezultat.narucitiAlert == true) {
        narudzbaAlertCheckBox[0].checked = true;
      }

      ucitajBazeProizvoda();

    }




  });

}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  //console.log(trenutnoOtvoreniProizvod.getElementsByTagName("a"));
  
  document.getElementById("myNav").style.height = "0%";
  document.getElementById("myNav").style.width = "0%";
  trenutnoOtvoreniProizvod = null;
}

function prikaziOpcijeProizvoda() {

  var slikaINaziv = document.getElementById("slikaINaziv");
  var opcije = document.getElementById("opcije");

  slikaINaziv.style.height = "0%";
  slikaINaziv.style.width = "0%";

  opcije.style.height = "100%";
  opcije.style.width = "100%";
}

function sakrijOpcijeProizvoda() {

  var slikaINaziv = document.getElementById("slikaINaziv");
  var opcije = document.getElementById("opcije");

  slikaINaziv.style.height = "100%";
  slikaINaziv.style.width = "100%";

  opcije.style.height = "0%";
  opcije.style.width = "0%";
}

function prodajProizvod() {

  let brojKomada = document.getElementById('brojKomadaProdaja').value;

  if (brojKomada == "" || brojKomada < 0) {
    showNotification('Molimo unesite broj komada proizvoda koji želite prodati!', 4);
  }
  else if (isNaN(document.getElementById('brojKomadaProdaja').value)) {
    showNotification('Molimo unesite ispravan broj komada proizvoda koji želite prodati!', 4);
  }
  else {

    $.post('/prodajProizvod', { nazivProizvoda: imeKliknutogProizvoda, brojKomada: document.getElementById('brojKomadaProdaja').value }, function (returnedData) {

      if (returnedData.poruka == "Uspješno prodan proizvod") {
        showNotification(returnedData.poruka, 2);
      }
      else {
        showNotification(returnedData.poruka, 4);
      }
    });
  }
}

function dodajNovuNarudzbu() {

  let brKomada = document.getElementById('brojKomadaNarudzba').value;
  let datumIsporuka = document.getElementById('datumIsporuke').value;
  let racunNarudzba = document.getElementById('racunNarudzba').value;

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  if (brKomada == '') {
    showNotification('Molimo unesite broj komada za narudžbu!');
  }
  else if (isNaN(brKomada)) {
    showNotification('Broj komada za narudžbu nije u ispravnom formatu!');
  }
  else if (!datumIsporuka) {
    showNotification('Molimo odaberite datum isporuke!');
  }
  else {

    $.get('/dajPodatkeProizvoda', { nazivProizvoda: imeKliknutogProizvoda }, function (returnedData2) {

      if (returnedData2.poruka == "OK") {

        $.post('/dodajNovuNarudzbu', { nazivProizvoda: imeKliknutogProizvoda, brojKomada: brKomada, datumIsporuke: datumIsporuka, racun: racunNarudzba, proizvodID: returnedData2.rezultat._id, ekstenzijaSlike: returnedData2.rezultat.ekstenzijaSlike, ebayPretraga: document.getElementById("ebayPretragaEdit").value }, function (returnedData) {

          if (returnedData.poruka == "Uspješno registrovana nova narudžba!") {
            showNotification(returnedData.poruka, 2);
          }
          else {
            showNotification(returnedData.poruka, 4);
          }
        });
      }
      else {
        showNotification("Došlo je do neočekivane greške. Pokušajte ponovo!", 4);
      }
    })
  }
}

function ucitajBazeProizvoda() {

  $.get('/currentUser/allDatabases', function (returnedData) {

    if (returnedData == null) return;

    let sveBaze = Object.values(returnedData.rezultat);

    $.get('/proizvod/allDatabases', { nazivProizvoda: imeKliknutogProizvoda }, function (returnedData2) {

      if (returnedData2 == null) return;

      let trenutnaBazaProizvoda = returnedData2.rezultat;
      var bazeProizvoda = document.getElementById('bazeProizvoda');
      bazeProizvoda.innerHTML = "<h4 class=\"text-left\">Baza u kojoj je proizvod</h4>";

      for (let i = 0; i < sveBaze.length; i++) {

        let bazaDiv = kreirajElement('div', { "style": "margin-left:20px;" });
        let inputCheck = kreirajElement('input', { "type": "checkbox", "class": "form-check-input", "name": "pregledProizvodaBazeCheckboxi" });

        let labelaBaze = kreirajElement('label', { "class": "form-check-label", "for": "exampleCheck1", "name": "pregledProizvodaBazeLabels" });
        labelaBaze.innerText = sveBaze[i];

        if (trenutnaBazaProizvoda == sveBaze[i]) inputCheck.checked = true;

        bazaDiv.appendChild(inputCheck);
        bazaDiv.appendChild(labelaBaze);

        bazeProizvoda.appendChild(bazaDiv);
      }
    });
  });
}

function spremiNarudzbu() {

  let brojKomada = document.getElementById('brojKomadaNarudzba').value;
  let datumIsporuke = document.getElementById('datumIsporukeNarudzba').value;
  let nabavnaCijena = document.getElementById('nabavnaCijenaNarudzba').value;
  let racun = document.getElementById('racunNarudzba').value;
  let datumNarudzbe = document.getElementById('datumNarudzbe').value
  let trackingNumber = document.getElementById('trackingNumberNarudzba').value;
  let ebayPretraga = document.getElementById("ebayPretragaEdit").value;

  if (isNaN(brojKomada) || brojKomada < 0 || brojKomada == '') {
    showNotification('Unesite ispravan broj komada!', 4);
    return;
  }
  else if (!datumIsporuke) {
    showNotification('Odaberite očekivani datum dostave!', 4);
    return;
  }
  else if (isNaN(nabavnaCijena.replace(',', '.')) || nabavnaCijena < 0 || nabavnaCijena == '') {
    showNotification('Unesite ispravnu nabavnu cijenu!', 4);
    return;
  }
  else {
    $.get('/dajPodatkeProizvoda', { nazivProizvoda: imeKliknutogProizvoda }, function (returnedData2) {

      if (returnedData2.poruka == "OK") {

        $.post('/dodajNovuNarudzbu', {
          nazivProizvoda: imeKliknutogProizvoda, brojKomada: brojKomada, datumNarudzbe: datumNarudzbe,
          datumIsporuke: datumIsporuke, nabavnaCijena: nabavnaCijena, racun: racun, proizvodID: returnedData2.rezultat._id,
          ekstenzijaSlike: returnedData2.rezultat.ekstenzijaSlike, trackingNumber: trackingNumber, ebayPretraga: ebayPretraga
        }, function (returnedData) {

          if (returnedData.poruka == "Uspješno registrovana nova narudžba!") {
            showNotification(returnedData.poruka, 2);
            document.getElementById('brojKomadaNarudzba').value = "";
            document.getElementById('datumIsporukeNarudzba').value = null;
            document.getElementById('datumNarudzbe').value = null;
            document.getElementById('nabavnaCijenaNarudzba').value = "";
            document.getElementById('racunNarudzba').value = "";
            document.getElementById('trackingNumberNarudzba').value = "";
          }
          else {
            showNotification(returnedData.poruka, 4);
          }
        });
      }
    });
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

function stornirajProdaju() {

  let brojStorniranihKomada = document.getElementById('brojKomadaStorniranih').value;

  if (brojStorniranihKomada == '' || isNaN(brojStorniranihKomada) || brojStorniranihKomada < 0) {
    showNotification('Unesite ispravan broj komada!', 4);
    return;
  }
  else {
    $.post('/stornirajProdajuProizvoda', { nazivProizvoda: imeKliknutogProizvoda, brojStorniranihKomada: brojStorniranihKomada }, function (returnedData) {

      if (returnedData.poruka == "Uspješno ažurirani podaci za proizvod!") {
        showNotification(returnedData.poruka, 2);
      }
      else {
        showNotification(returnedData.poruka, 4);
      }
    });
  }
}

function dodajNaStanje() {

  let brojKomada = document.getElementById('brojKomadaDodanih').value;

  if (isNaN(brojKomada) || brojKomada == '' || brojKomada < 0) {
    showNotification('Molimo unesite broj!', 4);
  }
  else {
    $.post('/dodajNaStanje', { nazivProizvoda: imeKliknutogProizvoda, brojKomada: brojKomada }, function (returnedData) {

      if (returnedData.poruka == "Uspješno ažurirani podaci za proizvod!") {
        showNotification(returnedData.poruka, 2);
      }
      else {
        showNotification(returnedData.poruka, 4);
      }
    });
  }
}


var pretragaFilter = document.getElementById("pretragaFilter");
var nizProizvoda = []; /* */

function filtrirajStanja() {
  let red = document.getElementById('sviProizvodiDiv');
  red.innerHTML = "";
  let naStanjuDropdown = document.getElementById('filterProizvodaStanja');

  for (let i = 0; i < nizProizvoda.length; i++) {

    if (naStanjuDropdown.value == "naStanju" && nizProizvoda[i].brojKomada == 0) {
      continue;
    }

    ucitajProizvodPregled(nizProizvoda[i]);
  }

}
function pretragaFilterClick() {
  if (pretragaFilter.value != "") {

    let red = document.getElementById('sviProizvodiDiv');
    red.innerHTML = "";

    $.get('/proizvodi/pretraga', { pretraga: pretragaFilter.value }, function (returnedData) {

      if (returnedData.poruka != 'OK') showNotification(returnedData.poruka, 4);

      else {

        let k = returnedData.rezultat;
        nizProizvoda = k;/* */
        if (k.length != 0) {

          let naStanjuDropdown = document.getElementById('filterProizvodaStanja');

          for (let i = 0; i < k.length; i++) {

            if (naStanjuDropdown.value == "naStanju" && k[i].brojKomada == 0) {
              continue;
            }

            ucitajProizvodPregled(k[i]);
          }
        }
      }
    });
  }
  else {
    showNotification("Unesite naziv za pretragu", 4);
  }
}
pretragaFilter.addEventListener("keyup", function (event) {

  if (event.keyCode === 13) {

    event.preventDefault();

    if (pretragaFilter.value != "") {

      let red = document.getElementById('sviProizvodiDiv');
      red.innerHTML = "";

      $.get('/proizvodi/pretraga', { pretraga: pretragaFilter.value }, function (returnedData) {

        if (returnedData.poruka != 'OK') showNotification(returnedData.poruka, 4);

        else {

          let k = returnedData.rezultat;
          nizProizvoda = k;/* */
          if (k.length != 0) {

            let naStanjuDropdown = document.getElementById('filterProizvodaStanja');

            for (let i = 0; i < k.length; i++) {

              if (naStanjuDropdown.value == "naStanju" && k[i].brojKomada == 0) {
                continue;
              }

              ucitajProizvodPregled(k[i]);
            }
          }
        }
      });
    }
    else {
      showNotification("Unesite naziv za pretragu", 4);
    }
  }
});

//Prima kao parametar objekat proizvod, dodaje ga u listu za pregled proizvoda na stanju (slika+naziv)
function ucitajProizvodPregled(k) {

  let red = document.getElementById('sviProizvodiDiv');

  let wrapper = kreirajElement('div', {});
  let a1 = kreirajElement('a', { 'href': '#', 'data-toggle': 'modal' });
  let div = kreirajElement('div', { 'class': 'itemBox col-sm-4 col-md-3 col-lg-3 col-xs-12', 'onclick': 'openNav(\'' + k.nazivProizvoda + '\',this)' });
  let img = kreirajElement('img', { 'height': '150', 'width': '150', 'src': 'assets/img/' + k._id + k.ekstenzijaSlike, /*'onclick': 'openNav(\'' + k.nazivProizvoda + '\',this)'*/ });
  let col = kreirajElement('div', { 'class': 'col-12 text-center' });
  let a2 = kreirajElement('a', { 'href': '#', /*'onclick': 'openNav(\'' + k.nazivProizvoda + '\',this)'*/ });
  let a3 = kreirajElement('a', { "style": "color:rgb(111, 199, 240);", "href": "#" }); a3.innerText = "\nBroj komada: " + k.brojKomada;
  a2.innerHTML = k.nazivProizvoda;

  div.appendChild(img);
  col.appendChild(a2);
  col.appendChild(a3);
  div.appendChild(col);
  a1.appendChild(div);
  wrapper.appendChild(a1);
  red.innerHTML += wrapper.innerHTML;
}

function isprazniListuProizvoda() {
  document.getElementById('sviProizvodiDiv').innerHTML = "";
}

function obrisiProizvod() {

  $.post('/proizvod/remove', { naziv: imeKliknutogProizvoda }, function (returnedData) {

    if (returnedData.poruka == "Uspješno obrisan proizvod!") {
      showNotification(returnedData.poruka, 2);
      closeNav();
      isprazniListuProizvoda();
    }
    else {
      showNotification(returnedData.poruka, 4);
    }
  });
}
/*function keyPress (e) {
  if(e.key === "Escape") {
      try{
        closeNav();
      }catch(e){}
  }
}*/
$(document).keyup(function (e) {
  if (e.key === "Escape") { // escape key maps to keycode `27`
    try {
      closeNav();
    } catch (e) { }
  }
});

function logOut() {

  $.get('/logout', function (returnedData) {
    window.location.replace('/login.html');
  });
}