function showNotification (msg,boja) {
    var ikona;
    if(boja==1){
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

function readURL(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();

        reader.onload = function (e){
            $('#slikaProizvoda')
                .attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);

    }
}
$("#files").change(function() {
    filename = this.files[0].name
    //console.log(filename);
});

function removeElementById(id){

    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

function dodajProizvodOnLoad(){

    let parentDropdown = document.getElementById('parentKategorija');    

    $.get('/dajSveKategorije', function(returnedData){

        if(returnedData == null || returnedData.rezultat == null) return;

        let sveKategorije = Object.values(returnedData.rezultat); 

        for(let i=0; i<sveKategorije.length; i++){
           
            let option = document.createElement('option');
            option.setAttribute('style', 'color:#000');
            option.text = sveKategorije[i].naziv;
            parentDropdown.add(option);
        }
    });
}

$("#proizvodForma").submit(function(e) {
    e.preventDefault();
});

$("#dodajNoviProizvodFormaId").submit(function(e) {
    e.preventDefault();
});


$("form[name='proizvodForma']").unbind('submit').submit(function(e) {

    e.preventDefault();

    if(proizvodFormaValidacija()) {

        var formData = new FormData($(this)[0]);  

        let baze = [];

        let bazaCheckBoxi = document.getElementsByName('proizvodBazeCheckboxi');
        let bazaLabele = document.getElementsByName('proizvodBazeLabele');

        for (let i=0; i<bazaCheckBoxi.length; i++) {

            if (bazaCheckBoxi[i].checked) {
                baze.push(bazaLabele[i].innerText);
            }
        }

        if(baze.length == 0){
            showNotification("Molimo odaberite bazu u koju želite dodati proizvod",4);
            e.preventDefault();                
        }
        else if(baze.length > 1){
            showNotification("Moguće je odabrati samo jednu bazu za jedan proizvod",4);
            e.preventDefault();                
        }
        else{
            formData.append('baza',baze[0]);

            $.ajax({
                url: "/dodajNoviProizvod",
                type: "POST",

                data: formData,

                success: function (msg) {

                    if(msg.poruka == "Uspješno dodan novi proizvod"){  
                        
                        showNotification(msg.poruka, 2);

                        document.getElementById('nazivProizvoda').value = "";
                        document.getElementById('nabavnaCijena').value = "";
                        document.getElementById('prodajnaCijena').value = "";
                        document.getElementById('ebayPretraga').value = "";
                        document.getElementById('slikaProizvoda').setAttribute("src","../assets/icons/add-photo.png");
                        // $('#slikaProizvoda').attr('src', "");
                        
                        for (let i=0; i<bazaCheckBoxi.length; i++) {                        
                            bazaCheckBoxi[i].checked = false;                       
                        }                   
                    }
                    else{
                        showNotification(msg.poruka,4);
                    }
                },
                cache: false,
                contentType: false,
                processData: false
            });
        }  

        e.preventDefault();
    }
});

function dodajProizvod(){
    
}

function ucitajBaze(){    

    $.get('/currentUser/allDatabases', function(returnedData){

        if(returnedData == null || returnedData.rezultat == null) return;

        let sveBaze = Object.values(returnedData.rezultat);

        for(let i=0; i<sveBaze.length; i++){

            let bazaDiv = kreirajElement('div',{"style":"margin-left:25px;"});
            let inputCheck = kreirajElement('input',{"type":"checkbox","class":"form-check-input", "name":"proizvodBazeCheckboxi"});

            let labelaBaze = kreirajElement('label',{"class":"form-check-label", "name":"proizvodBazeLabele"});
            labelaBaze.innerText=sveBaze[i];
        
            bazaDiv.appendChild(inputCheck);
            bazaDiv.appendChild(labelaBaze);
        
            var baze = document.getElementById('baze');
            baze.appendChild(bazaDiv); 
        }
    });
}


/* ------------------------------------------------------------------------------------------------ */
/* Pomoćne funkcije koje se pozivaju u glavnim funkcijama neophodnim za funkcionalnost aplikacije   */
/* ------------------------------------------------------------------------------------------------ */

/* Validira polja forme za dodavanje novog proizvoda
   Vraca true ako su svi uneseni podaci validni, u suprotnom vraca false */

function proizvodFormaValidacija(){

    let brojKomada = document.getElementById('brojKomada').value;

    //Provjeravamo da li su uneseni neophodni podaci u formi
    if(document.getElementById('nazivProizvoda').value == ""){
        showNotification("Molimo unesite naziv proizvoda!", 4);
        return false;
    }
    else if(document.getElementById('nabavnaCijena').value == ""){
        showNotification("Molimo unesite nabavnu cijenu proizvoda!", 4);
        return false;
    }
    else if(document.getElementById('prodajnaCijena').value == ""){
        showNotification("Molimo unesite prodajnu cijenu proizvoda!", 4);
        return false;
    }
    else if(brojKomada=='' || brojKomada<0 || isNaN(brojKomada) || brojKomada.includes('.')){
        showNotification('Unesite ispravan broj komada!', 4);
        return false;
    }
    else if(document.getElementById('kategorijaOpcija').selected == true){
        showNotification("Molimo odaberite kategoriju proizvoda!", 4);
        return false;
    }
    else if(isNaN(document.getElementById('nabavnaCijena').value.replace(',','.'))){
        showNotification("Molimo unesite ispravnu nabavnu cijenu!", 4);
        return false;
    }
    else if(isNaN(document.getElementById('prodajnaCijena').value.replace(',','.'))){
        showNotification("Molimo unesite ispravnu prodajnu cijenu!", 4);
        return false;
    }
    else if(document.getElementById('slikaProizvoda').src.includes("/assets/icons/add-photo.png")){
        showNotification('Odabrati sliku za proizvod!', 4);
        return false;
    }
    else return true;
}

function logOut() {

    $.get('/logout', function (returnedData) {
        window.location.replace('/login.html');
    });
}