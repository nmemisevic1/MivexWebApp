function showNotification (msg,boja) {
    var ikona;
    if(boja==1 || boja==2){
        ikona = "tim-icons icon-check-2";
    }
    else{
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

function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
}

function kreirajElement(element, atributi){

    let el = document.createElement(element);
    setAttributes(el,atributi);
    return el;
}

function getCheckedUsers(chkboxName) {

    var checkboxes = document.getElementsByName(chkboxName);
    var userLabels = document.getElementsByName('userLabels');
    console.log(userLabels);

    var usersChecked = [];
    // loop over them all
    for (var i=0; i<checkboxes.length; i++) {
      // And stick the checked ones onto an array...
      if (checkboxes[i].checked) {
          usersChecked.push(userLabels[i].innerHTML);
      }
    }

    // Return the array if it is non-empty, or null
    return usersChecked.length > 0 ? usersChecked : null;
}

function validanUnosObavijesti(){

    let obavijest = document.getElementById('obavijestKorisnicima').value;
    let datumIsteka = document.getElementById('datumIstekaObavijesti').value;
    let listaKorisnika = getCheckedUsers('checkBoxes');

    if(obavijest == ""){
        showNotification("Molimo unesite tekst obavijesti!",3);
        return false;
    }
    else if(new Date(datumIsteka) < new Date()){
        showNotification("Molimo unesite datum koji nije u prošlosti!",3);
        return false;
    }
    else if(listaKorisnika == null){
        showNotification("Molimo selektirajte bar jednog korisnika!",3);
        return false;
    }

    return true;
}

function posaljiObavijest(){

    if(!validanUnosObavijesti()) return;

    let obavijest = document.getElementById('obavijestKorisnicima').value;
    let datumIsteka = document.getElementById('datumIstekaObavijesti').value;
    let listaKorisnika = getCheckedUsers('checkBoxes');
    
    $.post('/obavijest/add', {tekstObavijesti:obavijest, datumIsteka:datumIsteka, listaKorisnika:listaKorisnika}, function(returnedData){
        
        if(returnedData.poruka == "Uspješno dodana nova obavijest!"){
          showNotification(returnedData.poruka,2);
          dodajObavijestUListu({tekst:obavijest,datumIsteka:datumIsteka,listaKorisnika:listaKorisnika});
        }
        else{
          showNotification(returnedData.poruka,3);
        }
    });

    //resetovanje
    document.getElementById('obavijestKorisnicima').value="";
    document.getElementById('datumIstekaObavijesti').valueAsDate = new Date();
}


function notifikacijeOnLoad(){

    document.getElementById('datumIstekaObavijesti').valueAsDate = new Date();
    dodajUsereUListu();
    ucitajAktuelneObavijesti();
}

var privilegijaZaBrisanjePoruka = false;

function ucitajAktuelneObavijesti(){    

    $.get('/obavijest/getActive', function(returnedData){

        if(returnedData == null) return;

        $.get('/user/current/allPrivileges', function (returnedData1) {

            if(returnedData1 == null || returnedData1.rezultat == null) return;
        
            let listaPrivilegijaKorisnika = returnedData1.rezultat;
        
            for (let i = 0; i < listaPrivilegijaKorisnika.length; i++) {
                if (listaPrivilegijaKorisnika[i] == 'Brisanje poruka') {
                    privilegijaZaBrisanjePoruka = true;
                    break;
                }
            }

            let sveObavijesti = Object.values(returnedData);
        
            for(let i=0; i<sveObavijesti.length; i++){
                dodajObavijestUListu(sveObavijesti[i]);
            }
        });
    });
}


function dodajObavijestUListu(obavijest){

    let tableBody = document.getElementById('listaAktuelnihObavijesti');
    let tr = kreirajElement('tr',{});

    let th1 = kreirajElement('th',{});
    let p1 = kreirajElement('p',{});
    p1.innerHTML = obavijest.tekst;
    th1.appendChild(p1);

    let th2 = kreirajElement('th',{});
    let p2 = kreirajElement('p',{});
    p2.innerHTML = obavijest.datumIsteka.toString().substring(0,10);   
    th2.appendChild(p2);

    let spisakKorisnika = "";

    for(let i=0; i<obavijest.listaKorisnika.length; i++){

        spisakKorisnika += obavijest.listaKorisnika[i];
        if(i != obavijest.listaKorisnika.length-1) spisakKorisnika += ', ';
    }

    let th3 = kreirajElement('th',{});
    let p3 = kreirajElement('p',{});
    p3.innerHTML = spisakKorisnika;
    th3.appendChild(p3);

    let th4 = kreirajElement('th', {"class":"text-center"});
    let input = kreirajElement('input', {"type":"button", "class":"btn btn-danger", "value":"Obriši"});
    if(privilegijaZaBrisanjePoruka == false){
        input.setAttribute("disabled","true");
    }
    input.onclick = function(){ obrisiObavijest(obavijest.tekst, obavijest.datumIsteka, obavijest.listaKorisnika, tr); };
    th4.appendChild(input);

    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    tableBody.appendChild(tr);
}

function dodajUsereUListu(){

    $.get('/ucitajKorisnike', function(returnedData){

        if(returnedData == null) return;

        let sviKorisnici = Object.values(returnedData);         

        for(let i=0; i<sviKorisnici.length; i++){
            dodajUsera(sviKorisnici[i].username);
        }
    });
}

function dodajUsera(user){

    let sviKorisnici = document.getElementById('sviKorisnici');

    let div = kreirajElement('div', {"style":"margin-left:25px;"});
    let input = kreirajElement('input', {"type":"checkbox", "class":"form-check-input", "name":"checkBoxes"});
    let label = kreirajElement('label', {"class":"form-check-label", "name":"userLabels"});
    label.innerHTML = user;

    div.appendChild(input);
    div.appendChild(label);
    sviKorisnici.appendChild(div);
}


function obrisiObavijest(tekst,datumIsteka,listaKorisnika,tr){

    $.post('/obavijest/remove', {tekst:tekst, datumIsteka:datumIsteka, listaKorisnika:listaKorisnika}, function(returnedData){

          if(returnedData.ispravan == "DA"){

             showNotification(returnedData.poruka,1);             
             let tableBody = document.getElementById('listaAktuelnihObavijesti');
             tableBody.removeChild(tr);
          }
          else{
             showNotification(returnedData.poruka,3);            
          }
    });
}

function logOut() {

    $.get('/logout', function (returnedData) {
        window.location.replace('/login.html');
    });
}