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
// PRivilegije za dashboard.html
function loadDashboard() {
    var privilegijaNotifikacija = true;
    var privilegijaStatistike = true;

    if (privilegijaNotifikacija == false && privilegijaStatistike == false) {
        window.location = "./error.html";
    }
}
function loadDashboardCards() {

    var privilegijaNotifikacija = true;
    var privilegijaStatistike = true;
    var body = document.getElementById("prostor");
    body.innerHTML = "";

    if (privilegijaNotifikacija) {
        body.innerHTML += "<div class='col-lg-12 col-md-12' id='notifikacije'><div class='card card-tasks'><div class='card-header '><h6 class='title d-inline' id='headercicPoruke'>Poruke</h6><p class='card-category d-inline'></p><div class='dropdown'><button type='button' class='btn btn-link dropdown-toggle btn-icon' data-toggle='dropdown'id='porukeSettingsIcon'><i class='tim-icons icon-settings-gear-63'></i></button><div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdownMenuLink'id='porukeSettingsActions'></div></div></div><div class='card-body'><div class='table-full-width table-responsive' style='overflow-y: hidden;overflow-x: hidden;'><table class='table'><tbody id='notifikacijeKorisnika'></tbody></table></div><div class='col-4'><a class='btn btn-primary' href='./notifikacije.html'>Pošalji poruku</a></div></div ></div ></div >";
    }
    /*if (privilegijaStatistike){
      body.innerHTML += "<div class='col-12'><div class='card'><div class='card-header'><h5 class='card-category'>Pregled statistike</h5><h3 class='card-title'><i class='tim-icons icon-chart-bar-32 text-primary' style='margin-left:10px;margin-right:10px;'></i>Statistika kompanije</h3></div><div class='card-body'><div class='col-sm-4'><a class='btn btn-primary text-center' href='./statistika.html' style='width: 100%;'>Pregled statistike</a></div></div></div></div>";
    }*/
}
// Privilegije za baze.html
function bazeLoader() {

    $.get('/user/current/hasPrivilege', { privilegija: 'Baze' }, function (returnedData) {

        if (returnedData.poruka == 'OK') {
            var privilegijaBaza = returnedData.rezultat;

            if (privilegijaBaza == false) {
                window.location = "./error.html";
            }
        }
        else {
            showNotification(returnedData.poruka, 4);
        }
    });
}

// Privilegije za dodajProizvod.html
function dodajProizvodLoader() {

    $.get('/user/current/hasPrivilege', { privilegija: 'Dodaj proizvod' }, function (returnedData) {

        if (returnedData.poruka == 'OK') {
            var privilegijaDodajProizvod = returnedData.rezultat;
            if (privilegijaDodajProizvod == false) {
                window.location = "./error.html";
            }
        }
        else {
            showNotification(returnedData.poruka, 4);
        }
    });
}

// Privilegije za kategorije.html
function kategorijeLoader() {

    $.get('/user/current/allPrivileges', function (returnedData) {

        if (returnedData.poruka == 'OK') {
            let privilegije = Object.values(returnedData.rezultat);
            var privilegijaDodajKategoriju = false;
            var privilegijaIzmijeniKategoriju = false;
            var privilegijaObrisiKategoriju = false;

            for (let i = 0; i < privilegije.length; i++) {
                if (privilegije[i] == 'Dodaj kategoriju') privilegijaDodajKategoriju = true;
                else if (privilegije[i] == 'Izmijeni kategoriju') privilegijaIzmijeniKategoriju = true;
                else if (privilegije[i] == 'Obrisi kategoriju') privilegijaObrisiKategoriju = true;
            }

            if (privilegijaDodajKategoriju == false && privilegijaIzmijeniKategoriju == false && privilegijaObrisiKategoriju == false) {
                window.location = "./error.html";
            }
        }
        else {
            showNotification(returnedData.poruka, 4);
        }
    });
}
function kategorijeCardsLoader() {

    $.get('/user/current/allPrivileges', function (returnedData) {

        if (returnedData.poruka == 'OK') {

            let privilegije = Object.values(returnedData.rezultat);
            var privilegijaDodajKategoriju = false;
            var privilegijaIzmijeniKategoriju = false;
            var privilegijaObrisiKategoriju = false;

            for (let i = 0; i < privilegije.length; i++) {
                if (privilegije[i] == 'Dodaj kategoriju') privilegijaDodajKategoriju = true;
                else if (privilegije[i] == 'Izmijeni kategoriju') privilegijaIzmijeniKategoriju = true;
                else if (privilegije[i] == 'Obrisi kategoriju') privilegijaObrisiKategoriju = true;
            }

            var cardsButtons = document.getElementById("cardsButtons");
            var body = document.getElementById("red");
            cardsButtons.innerHTML = "";
            body.innerHTML = "";

            if (privilegijaDodajKategoriju == true) {
                cardsButtons.innerHTML += "<button autofocus='true' class='btn btn-primary' onclick='changeForm(1);' id='button1' style='width:250px;'>Dodaj kategoriju</button>";
                body.innerHTML += "<div class='box col-md-4' id='dodavanjeKategorije'><form class='form-group' id='addCategoryForm'><p class='form'>Parent kategorija</p><select class='form-control' id='parentKategorija1'></select><p style='margin-top:2vh;'>Naziv kategorije</p><input class='form-control' style='margin-left:0px;' placeholder='Naziv kategorije' id='nazivKategorije'></form><button class='btn btn-primary' style='margin-top:2vh;' onclick='dodajKategoriju();' id='dodajKategorijuButton\'>Dodaj kategoriju</button></div>";
            }
            if (privilegijaIzmijeniKategoriju == true) {
                cardsButtons.innerHTML += "<button class='btn btn-primary' onclick='changeForm(2);' id='button2'  style='width:250px;'>Izmijeni kategoriju</button>";
                body.innerHTML += "<div class='box col-md-4' id='izmjenaKategorije'><form class='form-group' id='editCategoryForm'><p class='form'>Kategorija</p><select class='form-control' id='parentKategorija2'></select><p style='margin-top:2vh;'>Novi naziv kategorije</p><input class='form-control' style='margin-left:0px;' placeholder='Naziv kategorije' id='nazivKategorije2'></form><button class='btn btn-default spasiKategoriju' style='margin-top:2vh;' onclick='izmijeniKategoriju();' id='izmijeniKategorijuButton'>Izmijeni kategoriju</button></div>";
            }
            if (privilegijaObrisiKategoriju == true) {
                cardsButtons.innerHTML += "<button class='btn btn-primary' onclick='changeForm(3);' id='button3'  style='width:250px;'>Obriši kategoriju</button>";
                body.innerHTML += "<div class='box col-md-4' id='brisanjeKategorije'><form class='form-group' id='removeCategoryForm'><p class='form'>Kategorija</p><select class='form-control' id='parentKategorija3'></select></form><button class='btn btn-danger' style='margin-top:2vh;' onclick='obrisiKategoriju();' id='obrisiKategorijuButton'>Obriši kategoriju</button></div>";
            }

            if (privilegijaDodajKategoriju == true) {
                changeForm(1);
            }
            else if (privilegijaDodajKategoriju == false && privilegijaIzmijeniKategoriju == true) {
                changeForm(2);
            }
            else if (privilegijaDodajKategoriju == false && privilegijaIzmijeniKategoriju == false && privilegijaObrisiKategoriju == true) {
                changeForm(3);
            }
        }
        else {
            showNotification(returnedData.poruka, 4);
        }
    });
}

// Privilegije za log.html
function logLoader() {

    $.get('/user/current/hasPrivilege', { privilegija: 'Log' }, function (returnedData) {

        if (returnedData.poruka == 'OK') {

            var privilegijaLog = returnedData.rezultat;
            if (privilegijaLog == false) {
                window.location = "./error.html";
            }
        }
        else {
            showNotification(returnedData.poruka, 4);
        }
    });
}
function narudzbeLoader() {

    $.get('/user/current/allPrivileges', function (returnedData) {

        if (returnedData.poruka == 'OK') {
            var privilegijaRegistrovaneNarudzbe = false;
            var privilegijaNarudzbeKojeKasne = false;
            var privilegijaPotrebnoNaruciti = false;
            let privilegije = Object.values(returnedData.rezultat);

            for (let i = 0; i < privilegije.length; i++) {
                if (privilegije[i] == 'Registrovane narudzbe') privilegijaRegistrovaneNarudzbe = true;
                else if (privilegije[i] == 'Narudzbe koje kasne') privilegijaNarudzbeKojeKasne = true;
                else if (privilegije[i] == 'Potrebno naruciti') privilegijaPotrebnoNaruciti = true;
            }

            if (privilegijaRegistrovaneNarudzbe == false && privilegijaNarudzbeKojeKasne == false && privilegijaPotrebnoNaruciti == false) {
                window.location = "./error.html";
            }
        }
        else {
            showNotification(returnedData.poruka, 4);
        }
    });
}

function narudzbeCardsLoader() {

    $.get('/user/current/allPrivileges', function (returnedData) {

        if (returnedData.poruka == 'OK') {
            var privilegijaRegistrovaneNarudzbe = false;
            var privilegijaNarudzbeKojeKasne = false;
            var privilegijaPotrebnoNaruciti = false;
            let privilegije = Object.values(returnedData.rezultat);

            for (let i = 0; i < privilegije.length; i++) {
                if (privilegije[i] == 'Registrovane narudzbe') privilegijaRegistrovaneNarudzbe = true;
                else if (privilegije[i] == 'Narudzbe koje kasne') privilegijaNarudzbeKojeKasne = true;
                else if (privilegije[i] == 'Potrebno naruciti') privilegijaPotrebnoNaruciti = true;
            }

            var cardsButtons = document.getElementById("cardsButtons");
            var body = document.getElementById("red");

            cardsButtons.innerHTML = "";
            body.innerHTML = "";

            if (privilegijaRegistrovaneNarudzbe == true) {
                cardsButtons.innerHTML += "<button autofocus='true' class='btn btn-primary' onclick='changeForm(1);' id='button1' style='width:250px;'>Registrovane narudžbe</button>";
                body.innerHTML += "<div id='sveNarudzbe' class='col-lg-12 col-md-12 col-sm-12 col-xs-12 col-xs-12'></div>";
            }
            if (privilegijaNarudzbeKojeKasne == true) {
                cardsButtons.innerHTML += "<button class='btn btn-primary' onclick='changeForm(2);' id='button2' style='width:250px;'>Narudžbe koje kasne</button>";
                body.innerHTML += "<div id='zakasnjeleNarudzbe' style='display: none;'><p id='slucajAkoNemaZakasnjelihNarudzbi' style='visibility: hidden;'>Nema narudzbi koje kasne :)</p></div>";
            }
            if (privilegijaPotrebnoNaruciti == true) {
                cardsButtons.innerHTML += "<button class='btn btn-primary' onclick='changeForm(3);' id='button3' style='width:250px;'>Potrebno naručiti</button>";
                body.innerHTML += "<div id='potrebneNarudzbe' class='col-xs-12'></div>";
            }
            if (privilegijaRegistrovaneNarudzbe == true) {
                changeForm(1);
            }
            else if (privilegijaRegistrovaneNarudzbe == false && privilegijaNarudzbeKojeKasne == true) {
                changeForm(2);
            }
            else if (privilegijaRegistrovaneNarudzbe == false && privilegijaNarudzbeKojeKasne == false && privilegijaPotrebnoNaruciti == true) {
                changeForm(3);
            }
        }

        else showNotification(returnedData.poruka, 4);
    });
}
function troskoviLoader() {
    var privilegijaRegistrovanjaTroska = true;
    var privilegijaSviTroskovi = true;
    var privilegijaVrsteTroskova = true;

    if (privilegijaRegistrovanjaTroska == false && privilegijaSviTroskovi == false && privilegijaVrsteTroskova == false) {
        window.location = "./error.html";
    }
}

function troskoviOnLoad() {

    /*Ovdje povuci sve troskove iz baze i napuniti posljednjih 10 troskova*/
    /* HARDKODIRANO ISPOD */
    var tabela = document.getElementById('tabelaVrsteTroskova');

    if (tabela != null) {
        tabela = tabela.getElementsByTagName('tbody')[0];
        var UL = document.getElementById('Depth1');
        $.get('/dajSveVrsteTroskova', function (returnedData) {

            if (returnedData == null) return;

            let sveVrsteTroskova = Object.values(returnedData.rezultat);

            for (let i = 0; i < sveVrsteTroskova.length; i++) {

                let th1 = kreirajElement('td', {});
                let input1 = kreirajElement('input', { "class": "form-control", "type": "text", "value": sveVrsteTroskova[i].vrstaTroska, "style": "margin-left:0px;", "onfocus": "this.oldValue = this.value", "onchange": "spasiPromjenuVrsteTroska(this);this.oldValue = this.value;", "disabled": "true", "style": "color:white!important;" });
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
    ucitajSveVrsteTroskova();
}

function troskoviCardsLoader() {

    var troskoviButtons = document.getElementById("troskoviButtons");
    var troskoviBody = document.getElementById("troskoviBody");

    var privilegijaRegistrovanjaTroska = false;
    var privilegijaSviTroskovi = false;
    var privilegijaVrsteTroskova = false;

    troskoviBody.innerHTML = "";
    troskoviButtons.innerHTML = "";

    var prvaKartica;

    $.get('/user/current/allPrivileges', function (returnedData1) {

        if (returnedData1 == null || returnedData1.rezultat == null) return;

        let listaPrivilegijaKorisnika = returnedData1.rezultat;

        for (let i = 0; i < listaPrivilegijaKorisnika.length; i++) {
            if (listaPrivilegijaKorisnika[i] == 'Registruj trosak') privilegijaRegistrovanjaTroska = true;
            if (listaPrivilegijaKorisnika[i] == 'Pregled svih troskova') privilegijaSviTroskovi = true;
            if (listaPrivilegijaKorisnika[i] == 'Dodaj novu vrstu troska') privilegijaVrsteTroskova = true;
        }

        if (privilegijaRegistrovanjaTroska == true) {
            console.log('Usao u 1');
            troskoviButtons.innerHTML += "<button autofocus='true' class='btn btn-primary' onclick='changeForm(1);' id='button1' style='width:200px;'>Registruj trošak</button>";
            troskoviBody.innerHTML += "<div id='registracijaTroska' class='col-lg-12 col-md-12 col-sm-12 col-xs-12 col-xs-12'><div class='row'><div class='col-md-12'><div class='card'><div class='card-header'><h5 class='title'>Odaberi vrstu troška i unesi vrijednost troška kako bi je spasio u bazu.</h5></div><div class='card-body'><form class='form-group'><div class='col-sm-6 col-md-4 col-lg-4 col-xs-12' id='prviDiv' style='margin-left:0px;'><input class='form-control' autocomplete='off' type='text' id='Input1' placeholder='Vrsta' onkeyup='filterTroskova(\"Input1\",\"Depth1\")' onclick='oznaci(this)'><ul class='myUL' id='Depth1' style='display:none;'></ul><br><input class='form-control' type='number' id='vrijednostTroska' placeholder='Vrijednost troška'></div><br><button type='button' class='btn btn-fill btn-primary' onclick='registrujTrosak()'>Registruj trošak</button></form></div><div class='card-footer' style='margin-top:50px;'><h3 class='card-title'>Dodani troškovi</h3><p class='category'></p><div class='table-responsive' style='margin-top:35px;border-bottom:1px white solid;overflow:hidden;'><table class='table tablesorter ' id='tabelaTroskovi'><thead class=' text-primary'><tr><th>Vrsta troška</th><th>Datum troška</th><th class='text-center'>Vrijednost troška</th></tr></thead><tbody></tbody></table></div></div></div></div></div></div>";
            prvaKartica = 1;
        }

        if (privilegijaSviTroskovi == true) {
            console.log('Usao u 2');
            troskoviButtons.innerHTML += "<button class='btn btn-primary' onclick='changeForm(2); ucitajSveTroskove();' id='button2' style='width:200px;'>Svi troškovi</button>";
            troskoviBody.innerHTML += "<div id='sviTroskovi' style='display: none;'><div class='row'><div class='col-md-12'><div class='card '><div class='card-header'><h4 class='card-title'>Svi troškovi od početka korištenja aplikacije</h4></div><div class='card-body'><div class='table-responsive' style='margin-top:35px;border-bottom:1px white solid;overflow:hidden;'><table class='table tablesorter ' id='tabelaSviTroskovi'><thead class=' text-primary'><tr><th>Vrsta troška</th><th>Datum troška</th><th>Vrijednost troška</th><th class='text-center'>Opcija</th></tr></thead><tbody></tbody></table></div></div></div></div></div></div>";
            if (prvaKartica == null) prvaKartica = 2;
        }

        if (privilegijaVrsteTroskova == true) {
            console.log('Usao u 3');
            troskoviButtons.innerHTML += "<button class='btn btn-primary' onclick='changeForm(3)' id='button3' style='width:200px;'>Vrste troškova</button>";
            troskoviBody.innerHTML += "<div id='vrsteTroskova' style='display: none;'><div class='row'><div class='col-md-12'><div class='card '><div class='card-header' id='card-header'><h4 class='card-title'>Upravljanje vrstama troškova</h4></div><div class='card-body' id='card-body'><div class='table-responsive' style='margin-top:35px;border-bottom:1px white solid;overflow:hidden;'><table class='table tablesorter ' id='tabelaVrsteTroskova' name='tabelaVrsteTroskova'><thead class=' text-primary'><tr><th>Vrsta troška</th><!--<th>Broj troškova u vrsti</th>--><th class='text-center'>Opcija</th></tr></thead><tbody><tr><th><input class='form-control' type='text' placeholder='Nova vrsta troška' id='novaVrstaTroska' style='margin-left:0px;'></th><!--<th><input class='form-control' type='text' placeholder='0' disabled='' style='margin-left:0px;'></th>--><th class='text-center'><button class='btn btn-primary' onclick='dodajVrstuTroska()'>Dodaj vrstu</button></th></tr></tbody></table></div></div></div></div></div></div>";
            if (prvaKartica == null) prvaKartica = 3;
        }

        troskoviOnLoad();
        changeForm(prvaKartica);

    });
}
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
function posiljkeLoader() {
    var privilegijaRegistrovanjePosiljke = true;
    var privilegijaPristiglePosiljke = true;
    var privilegijaZakasnjelePosiljke = true;

    if (privilegijaRegistrovanjePosiljke == false && privilegijaPristiglePosiljke == false && privilegijaZakasnjelePosiljke == false) {
        window.location = "./error.html";
    }
}
function posiljkeCardsLoader() {
    var privilegijaRegistrovanjePosiljke = false;
    var privilegijaPristiglePosiljke = false;
    var privilegijaZakasnjelePosiljke = false;

    var posiljkeBody = document.getElementById("posiljkeBody");
    var posiljkeButtons = document.getElementById("posiljkeButtons");

    posiljkeButtons.innerHTML = "";
    posiljkeBody.innerHTML = "";

    var prvaKartica;

    $.get('/user/current/allPrivileges', function (returnedData1) {

        if (returnedData1 == null || returnedData1.rezultat == null) return;

        let listaPrivilegijaKorisnika = returnedData1.rezultat;

        for (let i = 0; i < listaPrivilegijaKorisnika.length; i++) {
            if (listaPrivilegijaKorisnika[i] == 'Skeniraj poslanu posiljku') privilegijaRegistrovanjePosiljke = true;
            if (listaPrivilegijaKorisnika[i] == 'Skeniraj pristiglu posiljku') privilegijaPristiglePosiljke = true;
            if (listaPrivilegijaKorisnika[i] == 'Posiljke koje kasne') privilegijaZakasnjelePosiljke = true;
        }

        if (privilegijaRegistrovanjePosiljke == true) {
            prvaKartica = 1;
            posiljkeButtons.innerHTML += "<button autofocus='true' class='btn btn-primary' onclick='changeForm(1);' id='button1' style='width:250px;'>Registruj pošiljke</button>";
            posiljkeBody.innerHTML += "<div id='novePosiljke' style='margin-left:0px;'>\
                                          <div class='col-sm-3 col-xs-12' style='margin-left:0px;'>\
                                            <h4>Registrovanje novih pošiljki</h4>\
                                            <form class='form-group' style='margin-left:0px;'>\
                                                <label style='margin-left:0px;'>ID pošiljke(12 znamenki)</label>\
                                                <input id='idNovePosiljke' type='text' class='form-control' autofocus='' placeholder='xxx-xxx-xxx-xxx' style='margin-left:0px;' onkeydown='spasiPosiljku(); return (event.keyCode!=13);'>\
                                            </form>\
                                          </div>\
                                            \
                                          <div class='col-sm-3 col-xs-12' style='margin-left:0px; margin-top:200px'>\
                                            <h4>Grupno registrovanje novih pošiljki</h4>\
                                            <form class='form-group' style='margin-left:0px;'>\
                                                <label style='margin-left:0px;'>Barkodovi posiljki</label>\
                                                <textarea name='comment' id='posiljkeTextArea'> </textarea>\
                                            </form>\
                                            \
                                            <button class='btn btn-primary' id='proknjiziGrupnoButton' onclick='proknjiziPosiljkeGrupno();'> Pošalji </button>\
                                          </div>\
                                        </div>";
        }
        if (privilegijaPristiglePosiljke == true) {
            posiljkeButtons.innerHTML += "<button class='btn btn-primary' onclick='changeForm(2);' id='button2'  style='width:250px;'>Označi pristigle</button>";
            posiljkeBody.innerHTML += "<div id='brisanjePosiljki'><h3>Označavanje pristiglih pošiljki</h3><div class='col-sm-3 col-xs-12' style='margin-left:0px;'><form class='form-group' style='margin-left:0px;'><label style='margin-left:0px;'>ID pošiljke(12 znamenki)</label><input id='obrisanePosiljke' type='text' class='form-control' autofocus='' placeholder='xxx-xxx-xxx-xxx' style='margin-left:0px;' onkeydown='obrisiPosiljku(); return (event.keyCode!=13);'></form></div></div>";
            if (prvaKartica == null) prvaKartica = 2;
        }
        if (privilegijaZakasnjelePosiljke == true) {
            posiljkeButtons.innerHTML += "<button class='btn btn-danger' onclick='changeForm(3);' id='button3'  style='width:250px;'>Pošiljke koje kasne</button>";
            posiljkeBody.innerHTML += "<div id='zakasnjelePosiljke'><div class='table-responsive' id='zakasnjelihPosiljkiTabela' style='border-bottom:1px white solid;overflow:hidden;margin-top:35px;'><table class='table tablesorter ' id='zakasnjelePosiljkeTabela'><thead class=' text-primary'><tr><th>Barcode narudzbe</th><th>Datum slanja</th><th class='text-center'>Akcija</th><th class='text-center'>Opcija</th></tr></thead><tbody id='posiljkeKasneTabela'></tbody></table></div></div>";
            if (prvaKartica == null) prvaKartica = 3;
        }

        changeForm(prvaKartica);
    });
}
function proizvodiOverlayLoader() {
    var overlayProizvoda = document.getElementById("overlayEditProizvoda");

    var privilegijaProdajeProizvoda = false;
    var privilegijaStorniranjaProizvoda = false;
    var privilegijaDodavanjeNaStanjeProizvoda = false;
    var privilegijaNarudzbeProizvoda = false;
    var privilegijaBrisanjaProizvoda = false;
    var privilegijaEditProizvoda = false;


    $.get('/user/current/allPrivileges', function (returnedData1) {

        if (returnedData1 == null || returnedData1.rezultat == null) return;

        let listaPrivilegijaKorisnika = returnedData1.rezultat;

        for (let i = 0; i < listaPrivilegijaKorisnika.length; i++) {
            if (listaPrivilegijaKorisnika[i] == 'Prodaj proizvod') privilegijaProdajeProizvoda = true;
            if (listaPrivilegijaKorisnika[i] == 'Storniraj prodaju') privilegijaStorniranjaProizvoda = true;
            if (listaPrivilegijaKorisnika[i] == 'Dodaj na stanje') privilegijaDodavanjeNaStanjeProizvoda = true;
            if (listaPrivilegijaKorisnika[i] == 'Obrisi proizvod') privilegijaBrisanjaProizvoda = true;
            if (listaPrivilegijaKorisnika[i] == 'Naruci') privilegijaNarudzbeProizvoda = true;
            if (listaPrivilegijaKorisnika[i] == 'Edit proizvoda') privilegijaEditProizvoda = true;
        }

        var div1 = kreirajElement("div", { "class": "overlay-content-item1 text-left" });
        div1.innerHTML = "";

        if (privilegijaProdajeProizvoda == true) {
            div1.innerHTML += "<h3 class='text-left'>Prodaja proizvoda</h3><div class='text-left'><p style='margin-top:15px;'>Broj komada koji se prodaju</p><input class='form-control' style='margin-left:0px;' type='number' placeholder='Broj komada koji se prodaju' id='brojKomadaProdaja'><button class='btn btn-primary' style='margin-top:20px;margin-bottom: 60px;' onclick='prodajProizvod()'>Prodaj</button></div><hr style='color:white;border-top: 1px solid white;'>";
        }
        if (privilegijaStorniranjaProizvoda == true) {
            div1.innerHTML += "<h3 class='text-left'>Storniranje proizvoda</h3><br><div class='text-left'><p style='margin-top:10px;'>Broj komada koji se storniraju</p><input class='form-control' style='margin-left:0px;' type='number' placeholder='Broj komada koji se storniraju' id='brojKomadaStorniranih'><button class='btn btn-primary' style='margin-top:20px;margin-bottom: 60px;' onclick='stornirajProdaju()'>Storniraj</button></div><hr style='color:white;border-top: 1px solid white;'></hr>";
        }
        if (privilegijaDodavanjeNaStanjeProizvoda == true) {
            div1.innerHTML += "<h3 class='text-left'>Dodaj na stanje</h3><br><div class='text-left'><p style='margin-top:10px;'>Broj komada koji se dodaju</p><input class='form-control' style='margin-left:0px;' type='number' placeholder='Broj komada koji se dodaju' id='brojKomadaDodanih'><button class='btn btn-primary' style='margin-top:20px;margin-bottom: 60px;' onclick='dodajNaStanje()'>Dodaj</button></div>";
        }

        var div2 = kreirajElement("div", { "class": "overlay-content-item2", "style": "border-bottom:1px solid white;" });
        div2.innerHTML = "";

        if (privilegijaNarudzbeProizvoda == true) {
            div2.innerHTML += "<h3 class='text-left'>Narudžba proizvoda</h3><div class='text-left'><p>Informacije o narudžbi</p><br><p style='margin-top:15px;'>Tracking number / ID</p><input class='form-control' style='margin-left:0px;' type='text' placeholder='Tracking number ili ID' id='trackingNumberNarudzba'><p style='margin-top:15px;'>Broj komada</p><input class='form-control' style='margin-left:0px;' type='text' placeholder='Broj komada' id='brojKomadaNarudzba'><p style='margin-top:15px;'>Račun</p><input class='form-control' style='margin-left:0px;' type='text' placeholder='Ebay račun' id='racunNarudzba'><p style='margin-top:15px;'>Datum narudžbe</p><input class='form-control' style='margin-left:0px;' type='date' id='datumNarudzbe'><p style='margin-top:15px;'>Datum isporuke</p><input class='form-control' style='margin-left:0px;' type='date' id='datumIsporukeNarudzba'><p style='margin-top:15px;'>Nabavna cijena po komadu</p><input class='form-control' style='margin-left:0px;' type='text' placeholder='Nabavna cijena u dolarima' id='nabavnaCijenaNarudzba'><button class='btn btn-primary' style='margin-top:20px;margin-bottom: 60px;' onclick='spremiNarudzbu()'>Spremi narudžbu</button></div><br>";
        }
        if (privilegijaBrisanjaProizvoda == true) {
            div2.innerHTML += "<h3 class='text-left'>Obriši proizvod</h3><div class='text-left'><input type='button' class='btn btn-danger' value='Obriši' style='margin-left: 0px; width:250px;' onclick='obrisiProizvod()'>";
        }

        var div3 = kreirajElement("form", { "class": "overlay-content-item3", "id": "editProizvodForma", "name": "editProizvodForma" });
        div3.innerHTML = "";

        if (privilegijaEditProizvoda == true) {
            div3.innerHTML += "<h3 class='text-left'>Edit proizvoda</h3><div class='text-left'><div class='imageBox'><img src='' style='height:50%;width:50%;max-width: 150px;max-height: 150px;' id='editSlika' name='editSlika'></div><p style='margin-top:20px;'>Odaberi sliku proizvoda</p><label for='files' class='btn'>Odaberi sliku</label></div><input id='files' style='visibility:hidden;' type='file' onchange='readURL(this)' name='files'><p class='text-left' style='margin-top:15px;'>Ime proizvoda</p><input class='form-control' style='margin-left:0px;' type='text' placeholder='Ime proizvoda' id='imeProizvodaEdit' name='imeProizvodaEdit'><p class='text-left' style='margin-top:15px;' class='text-left'>Ebay pretraga</p><div class='row' style='margin-left: 0px;'><div class='col-xs-10'><input class='form-control' style='margin-left:0px;' placeholder='E-bay pretraga' id='ebayPretragaEdit' name='ebayPretragaEdit'></div><div class='col-xs-2'><i id='ebayCopy' class='fa fa-clipboard' aria-hidden='true' style='font-size: 32px; cursor: pointer;'></i></div></div><p class='text-left' style='margin-top:15px;'>Nabavna cijena ($)</p><input class='form-control' style='margin-left:0px;' type='text' placeholder='Nabavna cijena u dolarima' id='nabavnaCijenaEdit' name='nabavnaCijenaEdit'><p class='text-left' style='margin-top:15px;'>Prodajna cijena (KM)</p><input class='form-control' style='margin-left:0px;' type='text' placeholder='Prodajna cijena u markama' id='prodajnaCijenaEdit' name='prodajnaCijenaEdit'><p class='text-left' style='margin-top:15px;'>Broj komada na stanju</p><input class='form-control' style='margin-left:0px;' type='number' placeholder='Komada na stanju' value='1' id='brojKomadaEdit' name='brojKomadaEdit'><div class='text-left'><p class='text-left' style='margin-top:15px;'>Kategorija</p><select class='form-control' style='margin-left:0px;height:5vh;' id='parentKategorija' placeholder='Kategorija' name='parentKategorija'><option value='' disabled selected>Kategorija</option></select></div><div class='text-left' style='margin-top:30px; margin-left: 20px'><input type='checkbox' class='form-check-input' name='narucitiAlertCheckBox'><p class='text-left' style='margin-top:15px;'>Upozorenje za narudžbu</p></div><div class='text-left' id='bazeProizvoda' style='margin-top:30px;'></div><button type='submit' class='btn btn-primary text-left' style='margin-top:20px;margin-bottom: 80px;float: left;'>Spasi izmjene</button><br><br><br></form></div>";
        }

        overlayProizvoda.appendChild(div1);
        overlayProizvoda.appendChild(div2);
        overlayProizvoda.appendChild(div3);

        $("#files").change(function () {
            filename = this.files[0].name
            //document.getElementById("editSlika").src = filename;
            //console.log(filename);
        });

        $("#editProizvodForma").submit(function (e) {
            console.log("Usla kitica");
            e.preventDefault();
        });


        $("form[name='editProizvodForma']").unbind('submit').submit(function (e) {
            console.log("USla kita");
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
                                trenutnoOtvoreniProizvod.getElementsByTagName("a")[3].innerText = "\nBroj komada: " + document.getElementById("brojKomadaEdit").value;
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
        overlayProizvoda.appendChild(div1);
        overlayProizvoda.appendChild(div2);
        overlayProizvoda.appendChild(div3);

        $.get('/dajSveKategorije', function (returnedData) {

            if (returnedData == null || returnedData.rezultat == null) return;
    
            let kategorije = [];
        
            let kategorijeEdit = document.getElementById('parentKategorija');
            console.log(kategorijeEdit);
            let k = Object.values(returnedData.rezultat);
        
            for (let i = 0; i < k.length; i++) {
        
              if (k[i].parent == '') {
                kategorije.push(k[i].naziv);
              }
    
              if(kategorijeEdit != null){
                var kategorija = kreirajElement("option", { "style": "color:black!important;", "value": k[i].naziv });
                kategorija.innerText = k[i].naziv;
                kategorijeEdit.options[kategorijeEdit.options.length] = kategorija;
              }
            }
        });
    });

}
function logOut() {

    $.get('/logout', function (returnedData) {
        window.location.replace('/login.html');
    });
}