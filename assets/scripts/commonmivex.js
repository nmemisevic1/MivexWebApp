// Važna napomena
// Ne dirati nazive funkcija 
// Jer je jedna menuPrivil[I]gesAdder
// A druga proizvodiMenuPrivil[E]gesAdder
// Da se ne bi mijenjalo milion fajlova
// Samo povuci iz baze privilegije usera i dodati ih na početak.
// Greška je opažena tek na kraju. Žao mi je.
function ucitajBazeTrenutnogKorisnika() {

  let bazaDropDown = document.getElementById('aktivnaBaza');

  $.get('/user/current/aktivnaBaza/get', function (returnedData1) {

      if(returnedData1 == null || returnedData1.rezultat == null) return;

      let aktivnaBaza = returnedData1.rezultat;

      $.get('/currentUser/allDatabases', function (returnedData) {

          if(returnedData == null || returnedData.rezultat == null) return;

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


type = ['primary', 'info', 'success', 'warning', 'danger'];
function menuPriviligesAdder(kodnoIme) {

  var dashboard = true; // dashboard moraju imati svi a šta će biti na dashboardu kao i na ostalim stranicama u zasebnim funkcijama za te stranice.
  var proizvodi = false;
  var narudzbe = false;
  var posiljke = false;
  var troskovi = false;
  var kategorije = false;
  var postavkeRacuna = false;
  var log = false;
  var baze = false;
  var statistika = false;
  var notifikacije = false;

  $.get('/user/current/allPrivileges', function (returnedData) {

    if(returnedData == null || returnedData.rezultat == null) return;

    let listaPrivilegijaKorisnika = returnedData.rezultat;

    for (let i = 0; i < listaPrivilegijaKorisnika.length; i++) {

      if (listaPrivilegijaKorisnika[i] == 'Baze') baze = true;

      else if (listaPrivilegijaKorisnika[i] == 'Dodaj proizvod' || listaPrivilegijaKorisnika[i] == 'Prodaj proizvod' || listaPrivilegijaKorisnika[i] == 'Storniraj prodaju' ||
      listaPrivilegijaKorisnika[i] == 'Dodaj na stanje' || listaPrivilegijaKorisnika[i] == 'Obrisi proizvod' || listaPrivilegijaKorisnika[i] == 'Edit proizvod' ) proizvodi = true;
      
      else if (listaPrivilegijaKorisnika[i] == 'Statistika') statistika = true;
      else if (listaPrivilegijaKorisnika[i] == 'Registrovane narudzbe' || listaPrivilegijaKorisnika[i] == 'Narudzbe koje kasne' || listaPrivilegijaKorisnika[i] == 'Potrebno naruciti') narudzbe = true;
      else if (listaPrivilegijaKorisnika[i] == 'Pregled svih troskova' || listaPrivilegijaKorisnika[i] == 'Registruj trosak' || listaPrivilegijaKorisnika[i] == 'Dodaj novu vrstu troska') troskovi = true;
      else if (listaPrivilegijaKorisnika[i] == 'Skeniraj poslanu posiljku' || listaPrivilegijaKorisnika[i] == 'Posiljke koje kasne' || listaPrivilegijaKorisnika[i] == 'Skeniraj pristiglu posiljku') posiljke = true;

      else if (listaPrivilegijaKorisnika[i] == 'Slanje poruka') notifikacije = true;
      //else if (listaPrivilegijaKorisnika[i] == 'Brisanje poruka') brisanjePoruka = true;

      else if (listaPrivilegijaKorisnika[i] == 'Dodaj kategoriju' || listaPrivilegijaKorisnika[i] == 'Izmijeni kategoriju' || listaPrivilegijaKorisnika[i] == 'Obrisi kategoriju') kategorije = true;
      else if (listaPrivilegijaKorisnika[i] == 'Racuni') postavkeRacuna = true;
      else if (listaPrivilegijaKorisnika[i] == 'Log') log = true;
    }

    var dashboardItem = document.createElement("LI");
    dashboardItem.innerHTML = "<a href='./dashboard.html'><i class='tim-icons icon-chart-pie-36'></i><p>Dashboard</p></a>";

    var proizvodiItem = document.createElement("LI");
    proizvodiItem.innerHTML = "<a href='./proizvodi.html'><i class='tim-icons icon-app'></i><p>Proizvodi</p></a>";

    var narudzbeItem = document.createElement("LI");
    narudzbeItem.innerHTML = "<a href='./narudzbe.html'><i class='tim-icons icon-cart'></i><p>Narudžbe</p></a>";

    var posiljkeItem = document.createElement("LI");
    posiljkeItem.innerHTML = "<a href='./posiljke.html'><i class='tim-icons icon-delivery-fast'></i><p>Pošiljke</p></a>";

    var troskoviItem = document.createElement("LI");
    troskoviItem.innerHTML = "<a href='./troskovi.html'><i class='tim-icons icon-coins'></i><p>Troškovi</p></a>";

    var notifikacijeItem = document.createElement("LI");
    notifikacijeItem.innerHTML = "<a href='./notifikacije.html'><i class='tim-icons icon-chat-33'></i><p>Notifikacije</p></a>";

    var kategorijeItem = document.createElement("LI");
    kategorijeItem.innerHTML = "<a href='./kategorije.html'><i class='tim-icons icon-align-center'></i><p>Kategorije</p></a>";

    var postavkeRacunaItem = document.createElement("LI");
    postavkeRacunaItem.innerHTML = "<a href='./racuni.html'><i class='tim-icons icon-settings'></i><p>Postavke računa</p></a>";

    var logItem = document.createElement("LI");
    logItem.innerHTML = "<a href='./log.html'><i class='tim-icons icon-paper'></i><p>Log</p></a>";

    var bazeItem = document.createElement("LI");
    bazeItem.innerHTML = "<a href='./baze.html'><i class='tim-icons icon-laptop'></i><p>Baze</p></a>";

    var statistikaItem = document.createElement("LI");
    statistikaItem.innerHTML = "<a href='./statistika.html'><i class='tim-icons icon-chart-bar-32'></i><p>Statistika</p></a>";

    if (kodnoIme == "dashboard") dashboardItem.classList.add("active");
    else if (kodnoIme == "proizvodi") proizvodiItem.classList.add("active");
    else if (kodnoIme == "narudzbe") narudzbeItem.classList.add("active");
    else if (kodnoIme == "posiljke") posiljkeItem.classList.add("active");
    else if (kodnoIme == "troskovi") troskoviItem.classList.add("active");
    else if (kodnoIme == "notifikacije") notifikacijeItem.classList.add("active");
    else if (kodnoIme == "kategorije") kategorijeItem.classList.add("active");
    else if (kodnoIme == "postavkeRacuna") postavkeRacunaItem.classList.add("active");
    else if (kodnoIme == "log") logItem.classList.add("active");
    else if (kodnoIme == "baze") bazeItem.classList.add("active");
    else if (kodnoIme == "statistika") statistikaItem.classList.add("active");
    else;

    var meni = document.getElementById("meniNavigacija");

    if (dashboard == true) meni.appendChild(dashboardItem);
    if (proizvodi == true) meni.appendChild(proizvodiItem);
    if (narudzbe == true) meni.appendChild(narudzbeItem);
    if (posiljke == true) meni.appendChild(posiljkeItem);
    if (troskovi == true) meni.appendChild(troskoviItem);
    if (notifikacije == true) meni.appendChild(notifikacijeItem);
    if (kategorije == true) meni.appendChild(kategorijeItem);
    if (postavkeRacuna == true) meni.appendChild(postavkeRacunaItem);
    if (statistika == true) meni.appendChild(statistikaItem);
    if (log == true) meni.appendChild(logItem);
    if (baze == true) meni.appendChild(bazeItem);
  });
}

function proizvodiMenuPrivilegesAdder(kodnoIme, kodnoIme2) {

  var dashboard = true; // dashboard moraju imati svi a šta će biti na dashboardu kao i na ostalim stranicama u zasebnim funkcijama za te stranice.
  var proizvodi = false;
  var pregledSvihProizvoda = false;
  var prodajaProizvoda = false;
  var narudzbe = false;
  var posiljke = false;
  var troskovi = false;
  //var notifikacije = false;
  var slanjePoruka = false;
  var kategorije = false;
  var postavkeRacuna = false;
  var log = false;
  var baze = false;
  var statistika = false;

  $.get('/user/current/allPrivileges', function (returnedData) {

    if(returnedData == null || returnedData.rezultat == null) return;

    let listaPrivilegijaKorisnika = returnedData.rezultat;

    for (let i = 0; i < listaPrivilegijaKorisnika.length; i++) {

      if (listaPrivilegijaKorisnika[i] == 'Baze') baze = true;
      else if (listaPrivilegijaKorisnika[i] == 'Dodaj proizvod') proizvodi = pregledSvihProizvoda = prodajaProizvoda = true;
      else if (listaPrivilegijaKorisnika[i] == 'Registrovane narudzbe' || listaPrivilegijaKorisnika[i] == 'Narudzbe koje kasne' || listaPrivilegijaKorisnika[i] == 'Potrebno naruciti') narudzbe = true;
      else if (listaPrivilegijaKorisnika[i] == 'Pregled svih troskova' || listaPrivilegijaKorisnika[i] == 'Registruj trosak' || listaPrivilegijaKorisnika[i] == 'Dodaj novu vrstu troska') troskovi = true;
      else if (listaPrivilegijaKorisnika[i] == 'Skeniraj poslanu posiljku' || listaPrivilegijaKorisnika[i] == 'Posiljke koje kasne' || listaPrivilegijaKorisnika[i] == 'Skeniraj pristiglu posiljku') posiljke = true;

      else if (listaPrivilegijaKorisnika[i] == 'Slanje poruka') slanjePoruka = true;
      //else if (listaPrivilegijaKorisnika[i] == 'Brisanje poruka') brisanjePoruka = true;

      else if (listaPrivilegijaKorisnika[i] == 'Dodaj kategoriju' || listaPrivilegijaKorisnika[i] == 'Izmijeni kategoriju' || listaPrivilegijaKorisnika[i] == 'Obrisi kategoriju') kategorije = true;
      else if (listaPrivilegijaKorisnika[i] == 'Racuni') postavkeRacuna = true;
      else if (listaPrivilegijaKorisnika[i] == "Statistika") statistika = true;
      else if (listaPrivilegijaKorisnika[i] == 'Log') log = true;
    }

    var dashboardItem = document.createElement("LI");
    dashboardItem.innerHTML = "<a href='./dashboard.html'><i class='tim-icons icon-chart-pie-36'></i><p>Dashboard</p></a>";

    var proizvodiItem = document.createElement("LI");
    proizvodiItem.innerHTML = "<a href='./proizvodi.html'><i class='tim-icons icon-app'></i><p>Proizvodi</p></a>";

    var proizvodiItemi = document.createElement("UL");
    proizvodiItemi.style.fontSize = "10px";
    proizvodiItemi.style.listStyleType = "none";

    var sviProizvodiItem = document.createElement("LI");
    sviProizvodiItem.innerHTML = "<a href='./proizvodi.html'><i class='tim-icons icon-app'></i><p>Svi proizvodi</p></a>";
    if (kodnoIme2 == "sviProizvodi") sviProizvodiItem.classList.add("active");

    var dodajProizvodItem = document.createElement("LI");
    dodajProizvodItem.innerHTML = "<a href='./dodajProizvod.html'><i class='tim-icons icon-simple-add'></i><p>Dodaj proizvod</p></a>";
    if (kodnoIme2 == "dodajProizvod") dodajProizvodItem.classList.add("active");

    /*var prodaniProizvodiItem = document.createElement("LI");
    prodaniProizvodiItem.innerHTML = "<a href='./prodaniProizvodi.html'><i class='tim-icons icon-send'></i><p>Prodani proizvodi</p></a>";
    if (kodnoIme2 == "prodaniProizvodi") prodaniProizvodiItem.classList.add("active");*/

    if (pregledSvihProizvoda == true) proizvodiItemi.appendChild(sviProizvodiItem);
    if (prodajaProizvoda == true) proizvodiItemi.appendChild(dodajProizvodItem);
    //if (pregledProdanihProizvoda == true) proizvodiItemi.appendChild(prodaniProizvodiItem);

    proizvodiItem.appendChild(proizvodiItemi);

    var narudzbeItem = document.createElement("LI");
    narudzbeItem.innerHTML = "<a href='./narudzbe.html'><i class='tim-icons icon-cart'></i><p>Narudžbe</p></a>";

    var posiljkeItem = document.createElement("LI");
    posiljkeItem.innerHTML = "<a href='./posiljke.html'><i class='tim-icons icon-delivery-fast'></i><p>Pošiljke</p></a>";

    var troskoviItem = document.createElement("LI");
    troskoviItem.innerHTML = "<a href='./troskovi.html'><i class='tim-icons icon-coins'></i><p>Troškovi</p></a>";

    var notifikacijeItem = document.createElement("LI");
    notifikacijeItem.innerHTML = "<a href='./notifikacije.html'><i class='tim-icons icon-chat-33'></i><p>Notifikacije</p></a>";

    var kategorijeItem = document.createElement("LI");
    kategorijeItem.innerHTML = "<a href='./kategorije.html'><i class='tim-icons icon-align-center'></i><p>Kategorije</p></a>";

    var postavkeRacunaItem = document.createElement("LI");
    postavkeRacunaItem.innerHTML = "<a href='./racuni.html'><i class='tim-icons icon-settings'></i><p>Postavke računa</p></a>";

    var logItem = document.createElement("LI");
    logItem.innerHTML = "<a href='./log.html'><i class='tim-icons icon-paper'></i><p>Log</p></a>";

    var bazeItem = document.createElement("LI");
    bazeItem.innerHTML = "<a href='./baze.html'><i class='tim-icons icon-laptop'></i><p>Baze</p></a>";

    var statistikaItem = document.createElement("LI");
    statistikaItem.innerHTML = "<a href='./statistika.html'><i class='tim-icons icon-chart-bar-32'></i><p>Statistika</p></a>";

    proizvodiItem.classList.add("active");


    var meni = document.getElementById("meniNavigacija");

    if (dashboard == true) meni.appendChild(dashboardItem);
    if (proizvodi == true) meni.appendChild(proizvodiItem);
    if (narudzbe == true) meni.appendChild(narudzbeItem);
    if (posiljke == true) meni.appendChild(posiljkeItem);
    if (troskovi == true) meni.appendChild(troskoviItem);
   // if (notifikacije == true) meni.appendChild(notifikacijeItem);
    if(slanjePoruka == true) meni.appendChild(notifikacijeItem);
    if (kategorije == true) meni.appendChild(kategorijeItem);
    if (postavkeRacuna == true) meni.appendChild(postavkeRacunaItem);
    if (statistika == true) meni.appendChild(statistikaItem);
    if (log == true) meni.appendChild(logItem);
    if (baze == true) meni.appendChild(bazeItem);
    
  });



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
function prikaziPoruku(korisnik, poruka) {
  var ikona = "tim-icons icon-email-85";
  var tekst = "<a style='color:#fff;' href='./dashboard.html#notifikacije'>Nova poruka od korisnika <b>" + korisnik + "</b>: <i>" + poruka + "</i> </a>";
  $.notify({
    icon: ikona,
    message: tekst

  }, {
    type: type[1],
    timer: 100000,
    placement: {
      from: 'top',
      align: 'center'
    },
    z_index: 3000,

  });
}
function logOut() {

  $.get('/logout', function (returnedData) {
      window.location.replace('/login.html');
  });
}