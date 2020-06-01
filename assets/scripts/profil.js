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

 var originalniUsername = "";
 var originalniPassword = "";

 function ucitajPodatke(){

    let username = localStorage.getItem('Username');

    $.get('/dajPassword', {user: username}, function(returnedData){

      document.getElementById('username').value = username;
      document.getElementById('password').value = returnedData.password;
      originalniUsername = username;
      originalniPassword = returnedData.password;
    });
 }

function ucitajMojePodatke(){
  
    $.get('/mojRacunPodaci', function(returnedData){
      
        document.getElementById('mojUsername').value = returnedData.username;
        document.getElementById('mojPassword').value = '***********';

        originalniUsername = returnedData.username;
        originalniPassword = returnedData.password;
    });
}

 function izmijeniPodatke(){

    let bazaCheckBoxi = document.getElementsByName('bazaCheckbox');
    let bazaLabele = document.getElementsByName('bazaLabela');
    let privilegijaCheckBoxi = document.getElementsByName('privilegijaCheckbox');
    let privilegijaLabele = document.getElementsByName('privilegijaLabela');
    let editovaneBaze = [];
    let editovanePrivilegije = [];

    for (let i=0; i<bazaCheckBoxi.length; i++) {

      if (bazaCheckBoxi[i].checked) {
        editovaneBaze.push(bazaLabele[i].innerText);
      }
    }

    for (let i=0; i<privilegijaCheckBoxi.length; i++) {

      if (privilegijaCheckBoxi[i].checked) {
        editovanePrivilegije.push(privilegijaLabele[i].innerText);
      }
    }

    let noviPassword = "";
    if(document.getElementById('password').value == '***********') noviPassword = originalniPassword;
    else noviPassword = document.getElementById('password').value;

    if(document.getElementById('username').value == '' || noviPassword == ''){
      showNotification('Username i password ne mogu biti prazna polja!', 4);
      return;
    }

    $.get('/izmijeniPodatkeKorisnika', {originalniUser:originalniUsername, originalniPass:originalniPassword, noviUsername:document.getElementById('username').value, noviPassword:noviPassword, editovaneBaze:editovaneBaze, editovanePrivilegije:editovanePrivilegije} , function(returnedData){
        
        if(returnedData.ispravan == "DA"){          
          location.replace("/racuni.html");
          showNotification(returnedData.poruka,2);
        }
        else{
          showNotification(returnedData.poruka,4);
        }
    });
 }

 function izmijeniMojePodatke(){
   
    $.get('/izmijeniPodatkeKorisnika', {originalniUser:originalniUsername, originalniPass:originalniPassword, noviUsername:document.getElementById('mojUsername').value, noviPassword:document.getElementById('mojPassword').value} , function(returnedData){
      
      if(returnedData.ispravan == "NE"){
        showNotification(returnedData.poruka,4);
      }
      else{
        showNotification(returnedData.poruka,2);
      }
      
    });
 }


 function ucitajBazeKorisnika(){

   let username = localStorage.getItem('Username');

   $.get('/baza/getAll', function(returnedData){

      if(returnedData == null || returnedData.rezultat == null) return;

      let sveBaze = Object.values(returnedData.rezultat);

      $.get('/user/allDatabases', {username:username}, function(returnedData2){
        
          let trenutneBazeKorisnika = [];

          if(returnedData2.rezultat != null){
             trenutneBazeKorisnika = Object.values(returnedData2.rezultat);
          }
          for(var i=0;i<sveBaze.length;i++){
        
            let bazaDiv = kreirajElement('div',{"style":"margin-left:25px;"});//id maybe            
            let inputCheck = kreirajElement('input',{"type":"checkbox","class":"form-check-input","id":"exampleCheck1", "name":"bazaCheckbox"});//real id

            if(trenutneBazeKorisnika.includes(sveBaze[i].naziv) == true) inputCheck.checked = true;

            let labelaBaze = kreirajElement('label',{"class":"form-check-label","for":"exampleCheck1", "name":"bazaLabela"});
            labelaBaze.innerText = sveBaze[i].naziv;//real naziv baze
          
            bazaDiv.appendChild(inputCheck);
            bazaDiv.appendChild(labelaBaze);
        
            var korisnikoveBaze = document.getElementById('korisnikoveBaze');
            korisnikoveBaze.appendChild(bazaDiv);   
          }
      });
   });
}

function ucitajPrivilegijeKorisnika(){

  let username = localStorage.getItem('Username');

  $.get('/privilegije/getAll', function(returnedData){

    if(returnedData == null || returnedData.rezultat == null) return;

    let svePrivilegije = Object.values(returnedData.rezultat);

    $.get('/user/allPrivileges', {username:username}, function(returnedData2){

      if(returnedData2 == null) return;
      
      if(returnedData2.rezultat == null){
        for(var i=0;i<svePrivilegije.length;i++){
  
          let privilegijaDiv = kreirajElement('div',{"style":"margin-left:25px;"});//id maybe
          let inputCheck = kreirajElement('input',{"type":"checkbox","class":"form-check-input","id":"exampleCheck1", "name":"privilegijaCheckbox"});//real id
    
          let labelaPrivilegije = kreirajElement('label',{"class":"form-check-label","for":"exampleCheck1", "name":"privilegijaLabela"});
          labelaPrivilegije.innerText=svePrivilegije[i].nazivPrivilegije;//real naziv privilegije
        
          privilegijaDiv.appendChild(inputCheck);
          privilegijaDiv.appendChild(labelaPrivilegije);
  
          var korisnikovePrivilegije = document.getElementById('korisnikovePrivilegije');
          korisnikovePrivilegije.appendChild(privilegijaDiv);  
        }
      }
      else{
        let trenutnePrivilegijeKorisnika = Object.values(returnedData2.rezultat);

        for(var i=0;i<svePrivilegije.length;i++){
  
          let privilegijaDiv = kreirajElement('div',{"style":"margin-left:25px;"});//id maybe
          let inputCheck = kreirajElement('input',{"type":"checkbox","class":"form-check-input","id":"exampleCheck1", "name":"privilegijaCheckbox"});//real id
  
          if(trenutnePrivilegijeKorisnika.includes(svePrivilegije[i].nazivPrivilegije) == true) inputCheck.checked = true;
  
          let labelaPrivilegije = kreirajElement('label',{"class":"form-check-label","for":"exampleCheck1", "name":"privilegijaLabela"});
          labelaPrivilegije.innerText=svePrivilegije[i].nazivPrivilegije;//real naziv privilegije
        
          privilegijaDiv.appendChild(inputCheck);
          privilegijaDiv.appendChild(labelaPrivilegije);
  
          var korisnikovePrivilegije = document.getElementById('korisnikovePrivilegije');
          korisnikovePrivilegije.appendChild(privilegijaDiv);  
        }
      }      
    });

  });
}

function ucitajBazeNovogKorisnika(){

  $.get('/baza/getAll', function(returnedData){

     if(returnedData == null) return;

     let sveBaze = Object.values(returnedData.rezultat);

      for(var i=0;i<sveBaze.length;i++){
    
        let bazaDiv = kreirajElement('div',{"style":"margin-left:25px;"});//id maybe            
        let inputCheck = kreirajElement('input',{"type":"checkbox","class":"form-check-input","id":"exampleCheck1", "name":"bazaCheckbox"});//real id

        let labelaBaze = kreirajElement('label',{"class":"form-check-label","for":"exampleCheck1", "name":"bazaLabela"});
        labelaBaze.innerText = sveBaze[i].naziv;//real naziv baze
      
        bazaDiv.appendChild(inputCheck);
        bazaDiv.appendChild(labelaBaze);
    
        var korisnikoveBaze = document.getElementById('noviKorisnikBaze');
        korisnikoveBaze.appendChild(bazaDiv);   
      }    
  });
}

 function ucitajPrivilegijeNovogKorisnika(){

    $.get('/privilegije/getAll', function(returnedData){

      if(returnedData == null) return;

      let svePrivilegije = Object.values(returnedData.rezultat);

      for(let i=0;i<svePrivilegije.length;i++){

        let privilegijaDiv = kreirajElement('div',{"style":"margin-left:25px;"});//id maybe
        let inputCheck = kreirajElement('input',{"type":"checkbox","class":"form-check-input","id":"exampleCheck1", "name":"privilegijaCheckbox"});//real id
        let labelaPrivilegije = kreirajElement('label',{"class":"form-check-label","for":"exampleCheck1", "name":"privilegijaLabela"});
        labelaPrivilegije.innerText=svePrivilegije[i].nazivPrivilegije;//real naziv privilegije
      
        privilegijaDiv.appendChild(inputCheck);privilegijaDiv.appendChild(labelaPrivilegije);

        var korisnikovePrivilegije = document.getElementById('noviKorisnikPrivilegije');
        korisnikovePrivilegije.appendChild(privilegijaDiv);  
      }
    });
 }

 function logOut() {

  $.get('/logout', function (returnedData) {
      window.location.replace('/login.html');
  });
}