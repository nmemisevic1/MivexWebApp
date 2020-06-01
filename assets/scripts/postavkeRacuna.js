  function showNotification (msg,boja) {
    var ikona;
    if(boja==1 || boja == 2){
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
      },
      z_index: 2000,
  
    });
  }


function dodajKorisnika(){

    let dodijeljeneBaze = [];
    let dodijeljenePrivilegije = [];

    let bazaCheckBoxi = document.getElementsByName('bazaCheckbox');
    let bazaLabele = document.getElementsByName('bazaLabela');
    let privilegijaCheckBoxi = document.getElementsByName('privilegijaCheckbox');
    let privilegijaLabela = document.getElementsByName('privilegijaLabela');

    for (let i=0; i<bazaCheckBoxi.length; i++) {
        // And stick the checked ones onto an array...
        if (bazaCheckBoxi[i].checked) {
            dodijeljeneBaze.push(bazaLabele[i].innerText);
        }
    }

    for (let i=0; i<privilegijaCheckBoxi.length; i++) {
        // And stick the checked ones onto an array...
        if (privilegijaCheckBoxi[i].checked) {
            dodijeljenePrivilegije.push(privilegijaLabela[i].innerText);
        }
    }

    if($('#usernameNoviKorisnik').val() == '' || $('#passwordNoviKorisnik').val() == ''){
        showNotification('Username i password ne mogu biti prazna polja!', 4);
        return;
    }
    
    $.get('/dodajNovogKorisnika', {user: $('#usernameNoviKorisnik').val(), pass: $('#passwordNoviKorisnik').val(), dodijeljeneBaze:dodijeljeneBaze, dodijeljenePrivilegije:dodijeljenePrivilegije},
            
            function(returnedData){

                if(returnedData.ispravan == 'DATABASE_ERROR'){
                    showNotification("Greška u radu sa bazom podataka!",4);
                }
                else if(returnedData.ispravan == 'NE'){
                    showNotification("Odabrani username već postoji!",4);
                }
                else{
                    showNotification("Uspješno dodan novi korisnik!",2);
                    document.getElementById('usernameNoviKorisnik').value = '';
                    document.getElementById('passwordNoviKorisnik').value = '';

                    for (let i=0; i<bazaCheckBoxi.length; i++) {                        
                        bazaCheckBoxi[i].checked = false;                       
                    }

                    for (let i=0; i<privilegijaCheckBoxi.length; i++) {                        
                        privilegijaCheckBoxi[i].checked = false;                       
                    }
                }
            });
}

function ucitajKorisnike(){

    $.get('/ucitajKorisnike', function(returnedData){

        var tabela = document.getElementById('tabelaKorisnika');
        tabela.style.overflow = "hidden";
        $("#tabelaKorisnika tr:not(:first)").remove(); 

        if(returnedData == null) return;

        let sviKorisnici = Object.values(returnedData); 

        for(let i=0; i<sviKorisnici.length; i++){
            
            let noviRed = tabela.insertRow(i+1);            
            noviRed.insertCell(0).innerHTML = sviKorisnici[i].username;
            noviRed.insertCell(1).innerHTML = '***********';

            let izmijeniCelija = noviRed.insertCell(2);
            izmijeniCelija.className = 'text-center';

            let link = document.createElement('a');
            link.setAttribute('href','profil.html');
            
            link.setAttribute('name', sviKorisnici[i].username);

            link.onclick = function(){                
                localStorage.setItem('Username', sviKorisnici[i].username);                              
            }

            let span = document.createElement('span');
            span.style.height = '100%';
            span.style.width = '100%';
            span.style.marginRight = '1vh';
            span.innerHTML = 'Izmijeni';

            let link2 = document.createElement('a');
            //link2.setAttribute('href','');
            link2.classList.add('deleteUser');
            //link2.setAttribute('id', sviKorisnici[i].username+'Obrisi');
            link2.setAttribute('name', sviKorisnici[i].username);
            link2.onclick = function(){ obrisiKorisnika(sviKorisnici[i].username); }

            let span2 = document.createElement('span');
            span2.style.height = '100%';
            span2.style.width = '100%';
            span2.classList.add('deleteUser');
            span2.innerHTML = 'Obriši';
            
            link.appendChild(span);
            link2.appendChild(span2);
            izmijeniCelija.appendChild(link);
            izmijeniCelija.appendChild(link2);

        }
    });
}

function logOut() {

    $.get('/logout', function (returnedData) {
        window.location.replace('/login.html');
    });
}