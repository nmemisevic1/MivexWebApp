function changeForm(a){
  //var prva = document.getElementById("prva");
  var druga = document.getElementById("druga");
  var treca = document.getElementById("treca");
  //var cetvrta = document.getElementById("cetvrta");

  //var prviButton = document.getElementById("button1");
  var drugiButton = document.getElementById("button2");
  var treciButton = document.getElementById("button3");
  //var cetvrtiButton = document.getElementById("button4");

  /*$('.btn').click(function(){
      $(this).toggleClass('active');
  });*/

  if(a==1){
   // prviButton.classList.add("active");
    drugiButton.classList.remove("active");
    treciButton.classList.remove("active");
    //cetvrtiButton.classList.remove("active");

    //prva.style.display = "none";
    druga.style.display = "none";
    treca.style.display = "none";
    //cetvrta.style.display = "none";
  }
  else if(a==2){
     // prviButton.classList.remove("active");
      drugiButton.classList.add("active");
      treciButton.classList.remove("active");
      //cetvrtiButton.classList.remove("active");

    //prva.style.display = "none";
    druga.style.display = "block";
    treca.style.display = "none";
    
    //cetvrta.style.display = "none";
  }
  else if(a==3){
     // prviButton.classList.remove("active");
    drugiButton.classList.remove("active");
    treciButton.classList.add("active");
    //cetvrtiButton.classList.remove("active");

    //prva.style.display = "none";
    druga.style.display = "none";
    treca.style.display = "block";
    document.getElementById("usernameNoviKorisnik").focus();
    //cetvrta.style.display = "none";
  }
  else{
     // prviButton.classList.add("active");
    drugiButton.classList.remove("active");
    treciButton.classList.remove("active");
    
    //prva.style.display = "block";
    druga.style.display = "none";
    treca.style.display = "none";
  }

  /*$.get('/mojRacunPodaci', function(returnedData){

  	document.getElementById('mojUsername').value = returnedData.username;
    document.getElementById('mojPassword').value = returnedData.password;
    //console.log(returnedData.username);
    
  	
  });*/
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

 function obrisiKorisnika(user){
    
    if(confirm("Da li želite obrisati ovaj račun?") == true){

      $.post('/obrisiKorisnika', {korisnik:user}, function(returnedData){

        if(returnedData.ispravan == "NE"){
          showNotification(returnedData.poruka,4);
        }
        else{
          showNotification(returnedData.poruka,2);
        }
        
        ucitajKorisnike();
      });
    }    
 }

 function logOut() {

  $.get('/logout', function (returnedData) {
      window.location.replace('/login.html');
  });
}