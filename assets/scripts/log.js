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



function logOnLoad(){

    /* postavljanje filtera */
    // Datumi
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("odDatum").value = today;
    document.getElementById("doDatum").value = today;
    
    // Useri

    $.get('/ucitajKorisnike', function(returnedData){

        if(returnedData == null) return;

        let useri = Object.values(returnedData); 

        for(let i=0; i<useri.length; i++){

            let user = kreirajElement('option',{"style":"color:black;","value":useri[i].username});
            user.innerText = useri[i].username;
            document.getElementById("useri").appendChild(user);
        }
    });
    
  /*  for(let i=0;i<useri.length;i++){
        let user = kreirajElement('option',{"style":"color:black;","value":useri[i]});
        user.innerText = useri[i];
        document.getElementById("useri").appendChild(user);
    } */
/*********************************************************************** */

    var tabela = document.getElementById('logTabela');

    $.get('/log/latest', function(returnedData){

        if(returnedData.poruka == 'OK'){

            if(returnedData.rezultat == null) return;

            let k = Object.values(returnedData.rezultat); 

            for(let i=k.length-1; i>=0; i--){

                var row = tabela.insertRow(1);

                var korisnik = row.insertCell(0);
                var datumAkcije = row.insertCell(1);
                var opisAkcije = row.insertCell(2);
                //var opcijaAkcije = row.insertCell(3);

                //opcijaAkcije.classList.add("text-center");

                korisnik.innerText = k[i].korisnik;
                //opcijaAkcije.innerHTML = "<a class='deleteTrosak text-center' href='#' onclick='ponistiAkciju(this)'>Poništi akciju</a>";

                let dat = new Date(k[i].datum);

                var dan = dat.getUTCDate();
                var mjesec = dat.getUTCMonth()+1;
                var godina = dat.getUTCFullYear();

                datumAkcije.innerHTML = dan+'/'+mjesec+'/'+godina + ' - ' + k[i].vrijeme;
                opisAkcije.innerText = k[i].zapis;
            }
        }
        else{
            showNotification(returnedData.poruka,4);
        }
    });
    
}

function ponistiAkciju(){
    //showNotification("Coming soon!",3);
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

function filtrirajLogove(){

    var tabela = document.getElementById('theadLogTabela');
    tabela.innerHTML = "";

    let e = document.getElementById("useri");
    let user = e.options[e.selectedIndex].text;
    let odDatum = document.getElementById('odDatum').value;
    let doDatum = document.getElementById('doDatum').value;
    
    let odDatuma = new Date(odDatum);
    let doDatuma = new Date(doDatum);

    $.get('/log/filter', {korisnik:user, odDatuma:odDatuma, doDatuma:doDatuma} , function(returnedData){

        if(returnedData.poruka == 'OK'){

            if(returnedData.rezultat == null) return;

            let k = Object.values(returnedData.rezultat); 

            for(let i=k.length-1; i>=0; i--){

                var row = tabela.insertRow(0);

                var korisnik = row.insertCell(0);
                var datumAkcije = row.insertCell(1);
                var opisAkcije = row.insertCell(2);
                //var opcijaAkcije = row.insertCell(3);

                //opcijaAkcije.classList.add("text-center");

                korisnik.innerText = k[i].korisnik;
                //opcijaAkcije.innerHTML = "<a class='deleteTrosak text-center' href='#' onclick='ponistiAkciju(this)'>Poništi akciju</a>";

                let dat = new Date(k[i].datum);

                var dan = dat.getUTCDate();
                var mjesec = dat.getUTCMonth()+1;
                var godina = dat.getUTCFullYear();

                datumAkcije.innerHTML = dan+'/'+mjesec+'/'+godina + ' - ' + k[i].vrijeme;
                opisAkcije.innerText = k[i].zapis;
            }
        }
        else{
            showNotification(returnedData.poruka,4);
        }
    });

    //showNotification("Uradi pizdo",1);
}

function logOut() {

    $.get('/logout', function (returnedData) {
        window.location.replace('/login.html');
    });
}